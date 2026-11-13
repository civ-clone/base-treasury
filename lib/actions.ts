import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  CityRegistry,
  instance as cityRegistryInstance,
} from '@civ-clone/core-city/CityRegistry';
import City from '@civ-clone/core-city/City';
import CompleteProduction from '../PlayerActions/CompleteProduction';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
import SellImprovement from '../PlayerActions/SellImprovement';

/** A player `Action` effect: for each of the player's cities, in order, buying what it builds and selling from it. */
export const buyAndSell =
  (
    cityRegistry: CityRegistry = cityRegistryInstance,
    cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance
  ): ((player: Player) => PlayerAction[]) =>
  (player: Player): PlayerAction[] =>
    cityRegistry
      .getByPlayer(player)
      .flatMap((city: City) => [
        new CompleteProduction(player, cityBuildRegistry.getByCity(city)),
        new SellImprovement(player, city),
      ]);

export default buyAndSell;
