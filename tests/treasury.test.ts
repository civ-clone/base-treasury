import { buyCost, isBuying, linearBuyCost, squaredBuyCost } from '../lib/buy';
import { forgetSales, recordSale, saleValue, soldOn } from '../lib/sell';
import BuildCost from '@civ-clone/core-city-build/Rules/BuildCost';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Effect from '@civ-clone/core-rule/Effect';
import Gold from '@civ-clone/base-city-yield-gold/Gold';
import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { expect } from 'chai';

class Building {}
class Shrine extends Building {}
class Soldier {}

const standInBuild = (
  Item: object | null,
  remaining: number,
  progress: number
): CityBuild =>
  ({
    building: () => (Item === null ? null : { item: () => Item }),
    remaining: () => remaining,
    progress: () => ({ value: () => progress }),
  } as unknown as CityBuild);

describe('base-treasury', (): void => {
  describe('buy', (): void => {
    it('prices the production remaining', (): void => {
      expect(linearBuyCost(2)(39)).to.equal(78);
      expect(squaredBuyCost(20, 2)(9)).to.equal(4 + 18);
      expect(squaredBuyCost(20, 2)(1)).to.equal(2);
    });

    it('multiplies the price while nothing is stored', (): void => {
      const cost = buyCost(Gold, linearBuyCost(2), 2);

      expect(cost(standInBuild(Shrine, 40, 0)).value()).to.equal(160);
      expect(cost(standInBuild(Shrine, 39, 1)).value()).to.equal(78);
      expect(cost(standInBuild(Shrine, 39, 1)).resource()).to.equal(Gold);
      expect(
        buyCost(Gold, linearBuyCost(2))(standInBuild(Shrine, 40, 0)).value()
      ).to.equal(80);
    });

    it('offers only what the city is building and still needs production for', (): void => {
      expect(isBuying(standInBuild(Shrine, 10, 0), Building)).to.equal(true);
      // A subclass of `Type`, not `Type` itself.
      expect(isBuying(standInBuild(Shrine, 10, 0), Shrine)).to.equal(false);
      expect(isBuying(standInBuild(Soldier, 10, 0), Building)).to.equal(false);
      expect(isBuying(standInBuild(Shrine, 0, 40), Building)).to.equal(false);
      expect(isBuying(standInBuild(null, 10, 0), Building)).to.equal(false);
    });
  });

  describe('sell', (): void => {
    const city = {} as City,
      other = {} as City,
      SOLD = 'test:sold';

    it('records the turn a city sold on, one record a city', (): void => {
      const pendingEffects = new PendingEffectRegistry();

      expect(soldOn(city, SOLD, pendingEffects)).to.equal(null);

      recordSale(city, SOLD, 3, pendingEffects);
      recordSale(city, SOLD, 4, pendingEffects);
      recordSale(other, SOLD, 4, pendingEffects);

      expect(soldOn(city, SOLD, pendingEffects)).to.equal(4);
      expect(soldOn(city, 'test:other', pendingEffects)).to.equal(null);
      expect(pendingEffects.getByTarget(city)).to.have.length(1);
      expect(pendingEffects.getByTarget(city)[0].data()).to.deep.equal({
        turn: '4',
      });

      forgetSales(city, SOLD, pendingEffects);

      expect(soldOn(city, SOLD, pendingEffects)).to.equal(null);
      expect(soldOn(other, SOLD, pendingEffects)).to.equal(4);
    });

    it('sells an improvement for its cost in production', (): void => {
      class Hall extends CityImprovement {}

      const ruleRegistry = new RuleRegistry(),
        hall = Object.assign(Object.create(Hall.prototype), {
          city: () => city,
        }) as CityImprovement;

      ruleRegistry.register(
        new BuildCost(
          new Effect((item: BuildItem) => ({
            value: () => (item.item() === Hall ? 60 : 0),
          }))
        ) as any
      );

      const value = saleValue(Gold, ruleRegistry)(hall);

      expect(value.resource()).to.equal(Gold);
      expect(value.value()).to.equal(60);
    });
  });
});
