import {
  PlayerAction,
  IPlayerAction,
} from '@civ-clone/core-player/PlayerAction';
import City from '@civ-clone/core-city/City';
export interface ISellImprovement extends IPlayerAction {
  value(): City;
}
export declare class SellImprovement
  extends PlayerAction<City>
  implements ISellImprovement {}
export default SellImprovement;
