# base-treasury

Buying and selling with a treasury, for a ruleset to wrap in `core-treasury`'s `Spend`, `Sell` and `Sold` rules with its own
ids, numbers and criteria:

- `lib/buy`: `linearBuyCost(perProduction)` and `squaredBuyCost(divisor, perProduction)`, buy-price formulas of the production
  remaining; `buyCost(YieldType, formula, emptyMultiplier)`, a `Spend` effect that multiplies the price while nothing is
  stored; `isBuying(cityBuild, Type)`, whether the city is building a `Type` and still needs production for it.
- `lib/sell`: `saleValue(YieldType)`, a `Sell` effect that sells an improvement for its cost in production;
  `recordSale`, `soldOn` and `forgetSales`, a city's record of the turn it last sold on, kept as a `PendingEffect`
  so a save holds it, for a one-sale-a-turn rule.
- `lib/treasury`: `addPlayerTreasury(player, YieldType, startingAmount, …)`, for an `Added` rule; `isOverdrawn`, for an
  `Updated` rule.
- `lib/collect`: `collectYields(YieldType, MaintenanceType, …)`, a city `ProcessYield` effect that adds the city's
  yields of the type to its player's treasury and, when an improvement's upkeep overdraws it, loses the improvement and
  refunds its build cost (`city:unsupported-improvement`).
- `lib/events`: `emitTreasuryExhausted`, an `Updated` effect (`player:treasury-exhausted`).
- `lib/actions`: `buyAndSell(…)`, a player `Action` effect offering `CompleteProduction` and `SellImprovement` for each
  of the player's cities.
- `PlayerActions`: `CompleteProduction` (buy what a city is building; its value is the `CityBuild`) and
  `SellImprovement` (sell one of a city's improvements; its value is the `City`, and which improvement is the client's
  choice), the `PlayerAction`s a ruleset offers from its own `Action` rules. Saves and clients name them by class name.

A library: it registers no rules. See `civ1-treasury` for Civilization's prices.
