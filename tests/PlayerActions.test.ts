import { CompleteProduction, SellImprovement } from '../PlayerActions';
import City from '@civ-clone/core-city/City';
import CityBuild from '@civ-clone/core-city-build/CityBuild';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import RuleRegistry from '@civ-clone/core-rule/RuleRegistry';
import { expect } from 'chai';

describe('PlayerActions', (): void => {
  const player = new Player(new RuleRegistry());

  it('CompleteProduction holds the city build to buy', (): void => {
    const cityBuild = {} as CityBuild,
      action = new CompleteProduction(player, cityBuild);

    expect(action).to.be.instanceOf(PlayerAction);
    expect(action.value()).to.equal(cityBuild);
    expect(action.player()).to.equal(player);
  });

  it('SellImprovement holds the city to sell from', (): void => {
    const city = {} as City,
      action = new SellImprovement(player, city);

    expect(action).to.be.instanceOf(PlayerAction);
    expect(action.value()).to.equal(city);
  });

  it('keeps the class names saves and clients use', (): void => {
    expect(CompleteProduction.name).to.equal('CompleteProduction');
    expect(SellImprovement.name).to.equal('SellImprovement');
  });
});
