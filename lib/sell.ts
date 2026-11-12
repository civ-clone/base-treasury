import {
  PendingEffect,
  PendingEffectRegistry,
  instance as pendingEffectRegistryInstance,
} from '@civ-clone/core-pending-effect';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Buildable from '@civ-clone/core-city-build/Buildable';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import SpendCost from '@civ-clone/core-treasury/SpendCost';
import Yield from '@civ-clone/core-yield/Yield';

// A city's last sale is recorded as a `PendingEffect` on the city, with the turn it sold on, so a saved game keeps it.
//  `handler` is the record's name: a ruleset's own, since saves hold it. Nothing is owed, so no handler is registered
//  for it and it must never be discharged. A city keeps at most one: each sale replaces it.

const salesOf = (
  city: City,
  handler: string,
  pendingEffects: PendingEffectRegistry
): PendingEffect[] =>
  pendingEffects
    .getByTarget(city)
    .filter(
      (pendingEffect: PendingEffect): boolean =>
        pendingEffect.handler() === handler
    );

/** The turn `city` last sold on, from its `handler` record, or `null` if it hasn't. */
export const soldOn = (
  city: City,
  handler: string,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): number | null => {
  const [record] = salesOf(city, handler, pendingEffects);

  return record ? Number(record.data().turn) : null;
};

/** Records that `city` sold on `turn`, replacing any earlier record. */
export const recordSale = (
  city: City,
  handler: string,
  turn: number,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): void => {
  salesOf(city, handler, pendingEffects).forEach(
    (pendingEffect: PendingEffect): void =>
      pendingEffects.unregister(pendingEffect)
  );

  pendingEffects.register(
    new PendingEffect(handler, city, { turn: String(turn) })
  );
};

/** Forgets `city`'s record, as when it's destroyed, so the save doesn't keep the city. */
export const forgetSales = (
  city: City,
  handler: string,
  pendingEffects: PendingEffectRegistry = pendingEffectRegistryInstance
): void =>
  salesOf(city, handler, pendingEffects).forEach(
    (pendingEffect: PendingEffect): void =>
      pendingEffects.unregister(pendingEffect)
  );

/** What an improvement sells for: its cost in production, one `YieldType` each. */
export const saleValue =
  (
    YieldType: typeof Yield,
    ruleRegistry: RuleRegistry = ruleRegistryInstance
  ): ((cityImprovement: CityImprovement) => SpendCost) =>
  (cityImprovement: CityImprovement): SpendCost =>
    new SpendCost(
      YieldType,
      new BuildItem(
        cityImprovement.constructor as typeof Buildable,
        cityImprovement.city(),
        ruleRegistry
      )
        .cost()
        .value()
    );
