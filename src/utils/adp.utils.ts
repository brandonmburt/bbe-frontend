import { DraftedPlayer } from "../models/exposure.model";
import { Adp } from "../models/adp.model";

/**
 * Retreives the ADP object for a given player
 * @param {DraftedPlayer} draftedPlayer - player
 * @param {Map<string, Adp>} adpMap - Map of adps { playerId: Adp }
 * @param {Map<string, string>} playerKeysMap - Map of additional keys { key: playerId }
 * @returns {Adp} - Adp object
 */
export const getAdpObj = (draftedPlayer: Partial<DraftedPlayer>, adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>): Adp => {
    const { playerId, additionalKeys } = draftedPlayer;
    if (adpMap.has(playerId)) {
        return adpMap.get(playerId);
    } else {
        for (let i=0; i<additionalKeys.length; i++) {
            let key = additionalKeys[i];
            if (playerKeysMap.has(key)) {
                logMessage(i, key);
                return adpMap.get(playerKeysMap.get(key));
            }
        }
        // console.log('No ADP data found for player', draftedPlayer);
        return null;
    }
}

/**
 * Debug helper function
 * @param index - index of additional key
 * @param key - additional key
 */
const logMessage = (index: number, key: string): void => {
    if (index === 0) {
        // console.log('Player changed teams: ', key);
    } else if (index === 1) {
        // console.log('Player changed positions: ', key);
    } else {
        console.error('Invalid index. Something went wrong.');
    }
}