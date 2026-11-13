import {
  PlayerAction,
  IPlayerAction,
} from '@civ-clone/core-player/PlayerAction';
import City from '@civ-clone/core-city/City';

// Sell one of the city's improvements: which one is the client's choice, and the rules decide whether it can be sold.
export interface ISellImprovement extends IPlayerAction {
  value(): City;
}

export class SellImprovement
  extends PlayerAction<City>
  implements ISellImprovement {}

export default SellImprovement;
