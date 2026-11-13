import { CityBuildRegistry } from '@civ-clone/core-city-build/CityBuildRegistry';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import Yield from '@civ-clone/core-yield/Yield';
/**
 * Gives `player` a treasury of `YieldType`, starting with `startingAmount` (nothing is added when it's 0), and
 * registers it.
 */
export declare const addPlayerTreasury: (
  player: Player,
  YieldType: typeof Yield,
  startingAmount: number,
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  cityBuildRegistry?: CityBuildRegistry,
  ruleRegistry?: RuleRegistry
) => void;
/** An `Updated` criterion: the treasury is overdrawn. */
export declare const isOverdrawn: (playerTreasury: PlayerTreasury) => boolean;
