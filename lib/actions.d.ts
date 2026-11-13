import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { CityRegistry } from '@civ-clone/core-city/CityRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerAction from '@civ-clone/core-player/PlayerAction';
/** A player `Action` effect: for each of the player's cities, in order, buying what it builds and selling from it. */
export declare const buyAndSell: (
  cityRegistry?: CityRegistry,
  cityBuildRegistry?: CityBuildRegistry
) => (player: Player) => PlayerAction[];
export default buyAndSell;
