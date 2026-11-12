"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saleValue = exports.forgetSales = exports.recordSale = exports.soldOn = void 0;
const core_pending_effect_1 = require("@civ-clone/core-pending-effect");
const RuleRegistry_1 = require("@civ-clone/core-rule/RuleRegistry");
const BuildItem_1 = require("@civ-clone/core-city-build/BuildItem");
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
// A city's last sale is recorded as a `PendingEffect` on the city, with the turn it sold on, so a saved game keeps it.
//  `handler` is the record's name: a ruleset's own, since saves hold it. Nothing is owed, so no handler is registered
//  for it and it must never be discharged. A city keeps at most one: each sale replaces it.
const salesOf = (city, handler, pendingEffects) => pendingEffects
    .getByTarget(city)
    .filter((pendingEffect) => pendingEffect.handler() === handler);
/** The turn `city` last sold on, from its `handler` record, or `null` if it hasn't. */
const soldOn = (city, handler, pendingEffects = core_pending_effect_1.instance) => {
    const [record] = salesOf(city, handler, pendingEffects);
    return record ? Number(record.data().turn) : null;
};
exports.soldOn = soldOn;
/** Records that `city` sold on `turn`, replacing any earlier record. */
const recordSale = (city, handler, turn, pendingEffects = core_pending_effect_1.instance) => {
    salesOf(city, handler, pendingEffects).forEach((pendingEffect) => pendingEffects.unregister(pendingEffect));
    pendingEffects.register(new core_pending_effect_1.PendingEffect(handler, city, { turn: String(turn) }));
};
exports.recordSale = recordSale;
/** Forgets `city`'s record, as when it's destroyed, so the save doesn't keep the city. */
const forgetSales = (city, handler, pendingEffects = core_pending_effect_1.instance) => salesOf(city, handler, pendingEffects).forEach((pendingEffect) => pendingEffects.unregister(pendingEffect));
exports.forgetSales = forgetSales;
/** What an improvement sells for: its cost in production, one `YieldType` each. */
const saleValue = (YieldType, ruleRegistry = RuleRegistry_1.instance) => (cityImprovement) => new SpendCost_1.default(YieldType, new BuildItem_1.default(cityImprovement.constructor, cityImprovement.city(), ruleRegistry)
    .cost()
    .value());
exports.saleValue = saleValue;
//# sourceMappingURL=sell.js.map