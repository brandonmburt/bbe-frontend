import { DraftedPlayer } from "../models/exposure.model";
import { Adp } from "../models/adp.model";

/**
 * TODO: description
 * @param picks: Array of pick numbers
 * @returns 
 */
export const getAdpObj = (draftedPlayer: DraftedPlayer, adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>): Adp => {
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
        console.error('No ADP data found for player', draftedPlayer);
        return null;
    }
}

/**
 * description
 * @param index: Array of pick numbers
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