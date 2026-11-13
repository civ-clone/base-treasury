import { CompleteProduction, SellImprovement } from '../PlayerActions';
import { addPlayerTreasury, isOverdrawn } from '../lib/treasury';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityBuildRegistry from '@civ-clone/core-city-build/CityBuildRegistry';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import CityImprovementRegistry from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import CityRegistry from '@civ-clone/core-city/CityRegistry';
import Effect from '@civ-clone/core-rule/Effect';
import Engine from '@civ-clone/core-engine/Engine';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import PlayerTreasuryRegistry from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import Yield from '@civ-clone/core-yield/Yield';
import buyAndSell from '../lib/actions';
import collectYields from '../lib/collect';
import { emitTreasuryExhausted } from '../lib/events';
import { expect } from 'chai';

class Money extends Yield {}
class Other extends Yield {}
class Upkeep extends Money {
  private _cityImprovement: CityImprovement | null;

  constructor(
    value: number = 0,
    cityImprovement: CityImprovement | null = null
  ) {
    super(-value, 'upkeep');

    this._cityImprovement = cityImprovement;
  }

  cityImprovement(): CityImprovement | null {
    return this._cityImprovement;
  }
}
class Hall extends CityImprovement {}
class Tower extends CityImprovement {}

const setUp = (startingAmount: number = 0) => {
  const ruleRegistry = new RuleRegistry(),
    playerTreasuryRegistry = new PlayerTreasuryRegistry(),
    cityBuildRegistry = new CityBuildRegistry(),
    player = new Player(ruleRegistry);

  ruleRegistry.register(
    new BuildCost(
      new Effect((item: BuildItem) => ({
        value: () => (item.item() === Hall ? 60 : 30),
      }))
    ) as any
  );

  addPlayerTreasury(
    player,
    Money,
    startingAmount,
    playerTreasuryRegistry,
    cityBuildRegistry,
    ruleRegistry
  );

  return {
    cityBuildRegistry,
    player,
    playerTreasury: playerTreasuryRegistry.getByPlayerAndType(player, Money),
    playerTreasuryRegistry,
    ruleRegistry,
  };
};

describe('addPlayerTreasury', (): void => {
  it("registers the player's treasury of the yield, with the starting amount", (): void => {
    const { player, playerTreasury, playerTreasuryRegistry } = setUp(50);

    expect(playerTreasury).to.be.instanceOf(PlayerTreasury);
    expect(playerTreasury.player()).to.equal(player);
    expect(playerTreasury.yield()).to.equal(Money);
    expect(playerTreasury.value()).to.equal(50);
    expect(playerTreasuryRegistry.entries()).to.have.length(1);
  });

  it('starts empty with no starting amount', (): void => {
    expect(setUp().playerTreasury.value()).to.equal(0);
    expect(setUp(-5).playerTreasury.value()).to.equal(-5);
  });
});

describe('isOverdrawn', (): void => {
  it('holds only below 0', (): void => {
    const { playerTreasury } = setUp(1);

    expect(isOverdrawn(playerTreasury)).false;

    playerTreasury.subtract(1);

    expect(isOverdrawn(playerTreasury)).false;

    playerTreasury.subtract(1);

    expect(isOverdrawn(playerTreasury)).true;
  });
});

describe('collectYields', (): void => {
  const collectWith = (startingAmount: number) => {
    const { player, playerTreasury, playerTreasuryRegistry, ruleRegistry } =
        setUp(startingAmount),
      cityImprovementRegistry = new CityImprovementRegistry(),
      engine = new Engine(),
      unsupported: [City, CityImprovement][] = [],
      city = { player: () => player } as unknown as City,
      improvement = (Type: typeof CityImprovement): CityImprovement => {
        const cityImprovement = Object.assign(Object.create(Type.prototype), {
          city: () => city,
        }) as CityImprovement;

        cityImprovementRegistry.register(cityImprovement);

        return cityImprovement;
      };

    engine.on(
      'city:unsupported-improvement',
      (unsupportedCity: City, cityImprovement: CityImprovement) =>
        unsupported.push([unsupportedCity, cityImprovement])
    );

    return {
      city,
      cityImprovementRegistry,
      collect: (yields: Yield[]): void =>
        collectYields(
          Money,
          Upkeep,
          playerTreasuryRegistry,
          ruleRegistry,
          cityImprovementRegistry,
          engine
        )(yields[0], city, yields),
      improvement,
      playerTreasury,
      unsupported,
    };
  };

  it('adds every one of the yields of the type, in order, and nothing else', (): void => {
    const { collect, improvement, playerTreasury, unsupported } =
        collectWith(0),
      hall = improvement(Hall);

    collect([new Money(5), new Other(100), new Upkeep(2, hall), new Money(1)]);

    expect(playerTreasury.value()).to.equal(4);
    expect(unsupported).to.deep.equal([]);
  });

  it('loses an improvement whose upkeep overdraws the treasury, refunding its build cost', (): void => {
    const {
        city,
        cityImprovementRegistry,
        collect,
        improvement,
        playerTreasury,
        unsupported,
      } = collectWith(1),
      hall = improvement(Hall),
      tower = improvement(Tower);

    collect([new Upkeep(1, tower), new Upkeep(2, hall), new Money(3)]);

    // 1 - 1 = 0 keeps the tower; 0 - 2 < 0 loses the hall and refunds 60; then + 3.
    expect(playerTreasury.value()).to.equal(61);
    expect(unsupported).to.deep.equal([[city, hall]]);
    expect(cityImprovementRegistry.entries()).to.deep.equal([tower]);
  });

  it('only loses improvements to upkeep, not to other yields that overdraw', (): void => {
    const { collect, improvement, playerTreasury, unsupported } =
        collectWith(0),
      hall = improvement(Hall);

    collect([new Money(-5), new Upkeep(1, hall)]);

    expect(playerTreasury.value()).to.equal(54);
    expect(
      unsupported.map(([, cityImprovement]) => cityImprovement)
    ).to.deep.equal([hall]);

    const second = collectWith(0);

    second.collect([new Money(-5)]);

    expect(second.playerTreasury.value()).to.equal(-5);
    expect(second.unsupported).to.deep.equal([]);
  });
});

describe('emitTreasuryExhausted', (): void => {
  it('tells the listeners the player, the treasury and the city', (): void => {
    const engine = new Engine(),
      { player, playerTreasury } = setUp(),
      city = {} as City,
      seen: unknown[][] = [];

    engine.on('player:treasury-exhausted', (...args: unknown[]) =>
      seen.push(args)
    );

    emitTreasuryExhausted(engine)(playerTreasury, city);

    expect(seen).to.deep.equal([[player, playerTreasury, city]]);
  });
});

describe('buyAndSell', (): void => {
  it("offers buying and selling for each of the player's cities, in order", (): void => {
    const { cityBuildRegistry, player } = setUp(),
      cities = [{ id: 'a' }, { id: 'b' }] as unknown as City[],
      builds = new Map<City, CityBuild>(
        cities.map((city): [City, CityBuild] => [city, {} as CityBuild])
      ),
      cityRegistry = {
        getByPlayer: (cityPlayer: Player): City[] =>
          cityPlayer === player ? cities : [],
      } as unknown as CityRegistry;

    cityBuildRegistry.getByCity = (city: City): CityBuild => builds.get(city)!;

    const actions = buyAndSell(cityRegistry, cityBuildRegistry)(player);

    expect(actions.map((action) => action.constructor)).to.deep.equal([
      CompleteProduction,
      SellImprovement,
      CompleteProduction,
      SellImprovement,
    ]);
    expect(actions.map((action) => action.value())).to.deep.equal([
      builds.get(cities[0]),
      cities[0],
      builds.get(cities[1]),
      cities[1],
    ]);
    expect(actions.every((action) => action.player() === player)).true;
    expect(
      buyAndSell(
        cityRegistry,
        cityBuildRegistry
      )(new Player(new RuleRegistry()))
    ).to.deep.equal([]);
  });
});
