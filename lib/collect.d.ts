import { CityImprovementRegistry } from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import { Engine } from '@civ-clone/core-engine/Engine';
import { PlayerTreasuryRegistry } from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import { RuleRegistry } from '@civ-clone/core-rule/RuleRegistry';
import City from '@civ-clone/core-city/City';
import CityImprovement from '@civ-clone/core-city-improvement/CityImprovement';
import Yield from '@civ-clone/core-yield/Yield';
/** A yield that pays for one of the city's improvements: `MaintenanceType` instances carry the improvement. */
export interface IMaintenanceYield extends Yield {
  cityImprovement(): CityImprovement | null;
}
/**
 * A city `ProcessYield` effect that adds every one of the city's `YieldType` yields to its player's `YieldType`
 * treasury, in order. When paying a `MaintenanceType` yield (a negative one) overdraws the treasury, the improvement
 * it pays for is lost instead: it's unregistered, the treasury is refunded its build cost, and the engine is told
 * (`city:unsupported-improvement`).
 */
export declare const collectYields: (
  YieldType: typeof Yield,
  MaintenanceType: abstract new (...args: any[]) => IMaintenanceYield,
  playerTreasuryRegistry?: PlayerTreasuryRegistry,
  ruleRegistry?: RuleRegistry,
  cityImprovementRegistry?: CityImprovementRegistry,
  engine?: Engine
) => (cityYield: Yield, city: City, yields: Yield[]) => void;
export default collectYields;
