"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitTreasuryExhausted = void 0;
/** An `Updated` effect: tells the engine's listeners the treasury has run out (`player:treasury-exhausted`). */
const emitTreasuryExhausted = (engine) => (playerTreasury, city) => {
    engine.emit('player:treasury-exhausted', playerTreasury.player(), playerTreasury, city);
};
exports.emitTreasuryExhausted = emitTreasuryExhausted;
//# sourceMappingURL=events.js.map