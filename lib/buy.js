"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyCost = exports.isBuying = exports.squaredBuyCost = exports.linearBuyCost = void 0;
const SpendCost_1 = require("@civ-clone/core-treasury/SpendCost");
/** `perProduction` for each unit of production remaining. */
const linearBuyCost = (perProduction) => (remaining) => perProduction * remaining;
exports.linearBuyCost = linearBuyCost;
/** The production remaining squared over `divisor`, rounded down, plus `perProduction` for each. */
const squaredBuyCost = (divisor, perProduction) => (remaining) => Math.floor(remaining ** 2 / divisor) + perProduction * remaining;
exports.squaredBuyCost = squaredBuyCost;
/**
 * Whether the city is building a subclass of `Type` and has production still to find: nothing is offered when the
 * production stored already covers the cost.
 */
const isBuying = (cityBuild, Type) => cityBuild.building() !== null &&
    cityBuild.remaining() > 0 &&
    Object.isPrototypeOf.call(Type, cityBuild.building().item());
exports.isBuying = isBuying;
/**
 * A `Spend` rule's effect: `formula` of the production remaining, in `YieldType`, times `emptyMultiplier` while the city has
 * no production stored.
 */
const buyCost = (YieldType, formula, emptyMultiplier = 1) => (cityBuild) => {
    const cost = formula(cityBuild.remaining());
    return new SpendCost_1.default(YieldType, cityBuild.progress().value() === 0 ? cost * emptyMultiplier : cost);
};
exports.buyCost = buyCost;
//# sourceMappingURL=buy.js.map