import CityBuild from '@civ-clone/core-city-build/CityBuild';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Yield from '@civ-clone/core-yield/Yield';

/** What buying the rest of an item costs, given the production `remaining`. */
export type BuyFormula = (remaining: number) => number;

/** `perProduction` for each unit of production remaining. */
export const linearBuyCost =
  (perProduction: number): BuyFormula =>
  (remaining: number): number =>
    perProduction * remaining;

/** The production remaining squared over `divisor`, rounded down, plus `perProduction` for each. */
export const squaredBuyCost =
  (divisor: number, perProduction: number): BuyFormula =>
  (remaining: number): number =>
    Math.floor(remaining ** 2 / divisor) + perProduction * remaining;

/**
 * Whether the city is building a subclass of `Type` and has production still to find: nothing is offered when the
 * production stored already covers the cost.
 */
export const isBuying = (cityBuild: CityBuild, Type: object): boolean =>
  cityBuild.building() !== null &&
  cityBuild.remaining() > 0 &&
  Object.isPrototypeOf.call(Type, cityBuild.building()!.item());

/**
 * A `Spend` rule's effect: `formula` of the production remaining, in `YieldType`, times `emptyMultiplier` while the city has
 * no production stored.
 */
export const buyCost =
  (
    YieldType: typeof Yield,
    formula: BuyFormula,
    emptyMultiplier: number = 1
  ): ((cityBuild: CityBuild) => SpendCost) =>
  (cityBuild: CityBuild): SpendCost => {
    const cost = formula(cityBuild.remaining());

    return new SpendCost(
      YieldType,
      cityBuild.progress().value() === 0 ? cost * emptyMultiplier : cost
    );
  };
