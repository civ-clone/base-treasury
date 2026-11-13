import Engine from '@civ-clone/core-engine/Engine';
import City from '@civ-clone/core-city/City';
import PlayerTreasury from '@civ-clone/core-treasury/PlayerTreasury';
/** An `Updated` effect: tells the engine's listeners the treasury has run out (`player:treasury-exhausted`). */
export declare const emitTreasuryExhausted: (
  engine: Engine
) => (playerTreasury: PlayerTreasury, city: City) => void;
