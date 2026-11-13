"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isOverdrawn = exports.addPlayerTreasury = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const PlayerTreasury_1 = require("@civ-clone/core-treasury/PlayerTreasury");
/**
 * Gives `player` a treasury of `YieldType`, starting with `startingAmount` (nothing is added when it's 0), and
 * registers it.
 */
const addPlayerTreasury = (player, YieldType, startingAmount, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance) => {
    const playerTreasury = new PlayerTreasury_1.default(player, YieldType, cityBuildRegistry, ruleRegistry);
    if (startingAmount !== 0) {
        playerTreasury.add(startingAmount);
    }
    playerTreasuryRegistry.register(playerTreasury);
};
exports.addPlayerTreasury = addPlayerTreasury;
/** An `Updated` criterion: the treasury is overdrawn. */
const isOverdrawn = (playerTreasury) => playerTreasury.value() < 0;
exports.isOverdrawn = isOverdrawn;
//# sourceMappingURL=treasury.js.map