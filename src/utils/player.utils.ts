import { Adp } from "../models/adp.model";
import { DraftedPlayer } from "../models/exposure.model";
import { ExposureData, Player, PlayerInputOption } from "../models/player.model";

/**
 * Returns an array which is used to populate the player exposure autocomplete
 * @param draftedPlayers: DraftedPlayer[] - array of drafted players for the current exposure type
 * @returns PlayerInputOption[] - array of PlayerInputOptions
 */
export const generateInputOptions = (draftedPlayers: DraftedPlayer[]): PlayerInputOption[] => {
    // Excluding players that were only drafted once, as the scatterplot wont properly populate
    return draftedPlayers.filter(x => x.timesDrafted > 1).map(player => {
        const { name, playerId, selectionInfo, avgPickNumber, timesDrafted } = player;
        return { label: name, playerId, selectionInfo, avgPick: avgPickNumber, timesDrafted };
    });
}

/**
 * Returns an array of ExposureData objects which is used to populate the player exposure table
 * @param playersMap 
 * @param adpMap 
 * @param draftedPlayers 
 * @param numDrafts 
 * @returns 
 */
export const getPlayerExposureRows = (playersMap: Map<string, Player>, adpMap: Map<string, Adp>, draftedPlayers: DraftedPlayer[], numDrafts: number): ExposureData[] => {
    let rows: ExposureData[] = [];
    draftedPlayers.forEach(({ avgPickNumber, name, playerId, sumEntryFees, timesDrafted }) => {
        const { adp, posRank } = adpMap.get(playerId) ?? null;
        const { team, pos } = playersMap.get(playerId) ?? { team: '', pos: '' };
        rows.push({
            id: playerId,
            name: name,
            team,
            pos,
            fees: sumEntryFees,
            avgPick: Number(avgPickNumber.toFixed(1)),
            adp,
            posRank,
            clv: Number((avgPickNumber - adp).toFixed(1)),
            percentDrafted: Number((timesDrafted/numDrafts*100).toFixed(1)),
            timesDrafted
        });
    });
    rows.sort((a, b) => b.percentDrafted - a.percentDrafted);
    return rows;
}