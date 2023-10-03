import { Adp } from "../models/adp.model";
import { DraftedPlayer, DraftedTeam } from "../models/exposure.model";
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
    }).sort((a,b) => b.timesDrafted - a.timesDrafted);
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
        const { adp, posRank } = adpMap.get(playerId) ?? { adp: 0, posRank: '' };
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

/**
 * Filters draftedTeams by the provided tournamentId and generates player exposure data for that subset of teams
 * @param tournamentId: tournament ID
 * @param entryFee: tournament entry fee
 * @param draftedTeams 
 * @returns [DraftedPlayer[], number] - array of DraftedPlayers and number of drafts for the current tournament
 * TODO: should refactor tournaments slice to contain the number of drafts for each tournament
 */
export const getPlayerExposureByTournamentId = (tournamentId: string, entryFee: number,  draftedTeams: DraftedTeam[], playersMap: Map<string, Player>): [DraftedPlayer[], number] => {
    const exposureMap = new Map();
    let numDrafts = 0; // number of drafts for the current tournament
    draftedTeams.forEach(team => {
        if (team.tournamentId === tournamentId || team.weeklyWinnerId === tournamentId) {
            numDrafts++;
            team.qbs.concat(team.rbs, team.wrs, team.tes).forEach(p => {
                const [ pickNumber, playerId, timestamp ] = p;
                if (!exposureMap.has(playerId)) exposureMap.set(playerId, {
                    timesDrafted: 0,
                    sumPickNumber: 0,
                    selectionInfo: [],
                    name: playersMap.get(playerId)?.name ?? '',
                    playerId,
                });
                exposureMap.get(playerId).timesDrafted++;
                exposureMap.get(playerId).sumPickNumber += pickNumber;
                exposureMap.get(playerId).selectionInfo.push([team.draftEntry, pickNumber, timestamp]);
            });
        }
    });
    const draftedPlayers: DraftedPlayer[] = [];
    exposureMap.forEach((v, k) => {
        const { timesDrafted, sumPickNumber, selectionInfo, name, playerId } = v;
        draftedPlayers.push({
            timesDrafted,
            avgPickNumber: Number((sumPickNumber/timesDrafted).toFixed(1)),
            sumEntryFees: Number((entryFee*timesDrafted).toFixed(1)),
            selectionInfo,
            name,
            playerId,
        });
    });
    draftedPlayers.sort((a, b) => b.timesDrafted - a.timesDrafted);
    return [draftedPlayers, numDrafts];
}