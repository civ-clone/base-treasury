import { PendingEffectRegistry } from '@civ-clone/core-pending-effect';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Yield from '@civ-clone/core-yield/Yield';
/** The turn `city` last sold on, from its `handler` record, or `null` if it hasn't. */
export declare const soldOn: (
  city: City,
  handler: string,
  pendingEffects?: PendingEffectRegistry
) => number | null;
/** Records that `city` sold on `turn`, replacing any earlier record. */
export declare const recordSale: (
  city: City,
  handler: string,
  turn: number,
  pendingEffects?: PendingEffectRegistry
) => void;
/** Forgets `city`'s record, as when it's destroyed, so the save doesn't keep the city. */
export declare const forgetSales: (
  city: City,
  handler: string,
  pendingEffects?: PendingEffectRegistry
) => void;
/** What an improvement sells for: its cost in production, one `YieldType` each. */
export declare const saleValue: (
  YieldType: typeof Yield,
  ruleRegistry?: RuleRegistry
) => (cityImprovement: CityImprovement) => SpendCost;
