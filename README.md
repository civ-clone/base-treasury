# base-treasury

Buying and selling with a treasury, for a ruleset to wrap in `core-treasury`'s `Spend`, `Sell` and `Sold` rules with its own
ids, numbers and criteria:

- `lib/buy`: `linearBuyCost(perProduction)` and `squaredBuyCost(divisor, perProduction)`, buy-price formulas of the production
  remaining; `buyCost(YieldType, formula, emptyMultiplier)`, a `Spend` effect that multiplies the price while nothing is
  stored; `isBuying(cityBuild, Type)`, whether the city is building a `Type` and still needs production for it.
- `lib/sell`: `saleValue(YieldType)`, a `Sell` effect that sells an improvement for its cost in production;
  `recordSale`, `soldOn` and `forgetSales`, a city's record of the turn it last sold on, kept as a `PendingEffect`
  so a save holds it, for a one-sale-a-turn rule.

A library: it registers no rules. See `civ1-treasury` for Civilization's prices.
