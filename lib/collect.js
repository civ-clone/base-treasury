"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectYields = void 0;
const CityImprovementRegistry_1 = require("@civ-clone/core-city-improvement/CityImprovementRegistry");
const Engine_1 = require("@civ-clone/core-engine/Engine");
const PlayerTreasuryRegistry_1 = require("@civ-clone/core-treasury/PlayerTreasuryRegistry");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
/**
 * A city `ProcessYield` effect that adds every one of the city's `YieldType` yields to its player's `YieldType`
 * treasury, in order. When paying a `MaintenanceType` yield (a negative one) overdraws the treasury, the improvement
 * it pays for is lost instead: it's unregistered, the treasury is refunded its build cost, and the engine is told
 * (`city:unsupported-improvement`).
 */
const collectYields = (YieldType, MaintenanceType, playerTreasuryRegistry = PlayerTreasuryRegistry_1.instance, ruleRegistry = RuleRegistry_1.instance, cityImprovementRegistry = CityImprovementRegistry_1.instance, engine = Engine_1.instance) => (cityYield, city, yields) => {
    const playerTreasury = playerTreasuryRegistry.getByPlayerAndType(city.player(), YieldType);
    yields.forEach((cityYield) => {
        if (!(cityYield instanceof YieldType)) {
            return;
        }
        playerTreasury.add(cityYield);
        if (cityYield instanceof MaintenanceType) {
            if (playerTreasury.value() < 0) {
                const cityImprovement = cityYield.cityImprovement(), buildItem = new BuildItem_1.default(cityImprovement.constructor, city, ruleRegistry);
                cityImprovementRegistry.unregister(cityImprovement);
                playerTreasury.add(buildItem.cost().value());
                engine.emit('city:unsupported-improvement', city, cityImprovement);
                return;
            }
        }
    });
};
exports.collectYields = collectYields;
exports.default = exports.collectYields;
//# sourceMappingURL=collect.js.map