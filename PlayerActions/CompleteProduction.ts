import {
  PlayerAction,
  IPlayerAction,
} from '@civ-clone/core-player/PlayerAction';
import CityBuild from '@civ-clone/core-city-build/CityBuild';

export interface ICompleteProduction extends IPlayerAction {
  value(): CityBuild;
}

export class CompleteProduction
  extends PlayerAction<CityBuild>
  implements ICompleteProduction {}

export default CompleteProduction;
