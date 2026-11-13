"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buyAndSell = void 0;
const CityBuildRegistry_1 = require("@civ-clone/core-city-build/CityBuildRegistry");
const CityRegistry_1 = require("@civ-clone/core-city/CityRegistry");
const CompleteProduction_1 = require("../PlayerActions/CompleteProduction");
const SellImprovement_1 = require("../PlayerActions/SellImprovement");
/** A player `Action` effect: for each of the player's cities, in order, buying what it builds and selling from it. */
const buyAndSell = (cityRegistry = CityRegistry_1.instance, cityBuildRegistry = CityBuildRegistry_1.instance) => (player) => cityRegistry
    .getByPlayer(player)
    .flatMap((city) => [
    new CompleteProduction_1.default(player, cityBuildRegistry.getByCity(city)),
    new SellImprovement_1.default(player, city),
]);
exports.buyAndSell = buyAndSell;
exports.default = exports.buyAndSell;
//# sourceMappingURL=actions.js.map