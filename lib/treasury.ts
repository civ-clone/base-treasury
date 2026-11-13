import {
  CityBuildRegistry,
  instance as cityBuildRegistryInstance,
} from '@civ-clone/core-city-build/CityBuildRegistry';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import Player from '@civ-clone/core-player/Player';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
import Yield from '@civ-clone/core-yield/Yield';

/**
 * Gives `player` a treasury of `YieldType`, starting with `startingAmount` (nothing is added when it's 0), and
 * registers it.
 */
export const addPlayerTreasury = (
  player: Player,
  YieldType: typeof Yield,
  startingAmount: number,
  playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
  cityBuildRegistry: CityBuildRegistry = cityBuildRegistryInstance,
  ruleRegistry: RuleRegistry = ruleRegistryInstance
): void => {
  const playerTreasury = new PlayerTreasury(
    player,
    YieldType,
    cityBuildRegistry,
    ruleRegistry
  );

  if (startingAmount !== 0) {
    playerTreasury.add(startingAmount);
  }

  playerTreasuryRegistry.register(playerTreasury);
};

/** An `Updated` criterion: the treasury is overdrawn. */
export const isOverdrawn = (playerTreasury: PlayerTreasury): boolean =>
  playerTreasury.value() < 0;
