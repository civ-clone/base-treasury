import {
  CityImprovementRegistry,
  instance as cityImprovementRegistryInstance,
} from '@civ-clone/core-city-improvement/CityImprovementRegistry';
import {
  Engine,
  instance as engineInstance,
} from '@civ-clone/core-engine/Engine';
import {
  PlayerTreasuryRegistry,
  instance as playerTreasuryRegistryInstance,
} from '@civ-clone/core-treasury/PlayerTreasuryRegistry';
import {
  RuleRegistry,
  instance as ruleRegistryInstance,
} from '@civ-clone/core-rule/RuleRegistry';
import BuildItem from '@civ-clone/core-city-build/BuildItem';
import Buildable from '@civ-clone/core-city-build/Buildable';
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
export const collectYields =
  (
    YieldType: typeof Yield,
    MaintenanceType: abstract new (...args: any[]) => IMaintenanceYield,
    playerTreasuryRegistry: PlayerTreasuryRegistry = playerTreasuryRegistryInstance,
    ruleRegistry: RuleRegistry = ruleRegistryInstance,
    cityImprovementRegistry: CityImprovementRegistry = cityImprovementRegistryInstance,
    engine: Engine = engineInstance
  ): ((cityYield: Yield, city: City, yields: Yield[]) => void) =>
  (cityYield: Yield, city: City, yields: Yield[]): void => {
    const playerTreasury = playerTreasuryRegistry.getByPlayerAndType(
      city.player(),
      YieldType
    );

    yields.forEach((cityYield) => {
      if (!(cityYield instanceof YieldType)) {
        return;
      }

      playerTreasury.add(cityYield);

      if (cityYield instanceof MaintenanceType) {
        if (playerTreasury.value() < 0) {
          const cityImprovement = cityYield.cityImprovement()!,
            buildItem = new BuildItem(
              cityImprovement.constructor as typeof Buildable,
              city,
              ruleRegistry
            );

          cityImprovementRegistry.unregister(cityImprovement);

          playerTreasury.add(buildItem.cost().value());

          engine.emit('city:unsupported-improvement', city, cityImprovement);

          return;
        }
      }
    });
  };

export default collectYields;
