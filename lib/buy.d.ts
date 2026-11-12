import CityBuild from '@civ-clone/core-city-build/CityBuild';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Yield from '@civ-clone/core-yield/Yield';
/** What buying the rest of an item costs, given the production `remaining`. */
export type BuyFormula = (remaining: number) => number;
/** `perProduction` for each unit of production remaining. */
export declare const linearBuyCost: (perProduction: number) => BuyFormula;
/** The production remaining squared over `divisor`, rounded down, plus `perProduction` for each. */
export declare const squaredBuyCost: (
  divisor: number,
  perProduction: number
) => BuyFormula;
/**
 * Whether the city is building a subclass of `Type` and has production still to find: nothing is offered when the
 * production stored already covers the cost.
 */
export declare const isBuying: (cityBuild: CityBuild, Type: object) => boolean;
/**
 * A `Spend` rule's effect: `formula` of the production remaining, in `YieldType`, times `emptyMultiplier` while the city has
 * no production stored.
 */
export declare const buyCost: (
  YieldType: typeof Yield,
  formula: BuyFormula,
  emptyMultiplier?: number
) => (cityBuild: CityBuild) => SpendCost;
