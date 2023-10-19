import { Adp } from "../models/adp.model";
import { DraftedPlayer, DraftedTeam } from "../models/exposure.model";
import { ExposureData, PlayerInputOption } from "../models/player.model";
import { getAdpObj } from '../utils/adp.utils';

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
 * @param adpMap 
 * @param playerKeysMap
 * @param draftedPlayers 
 * @param numDrafts 
 * @param ResurrectionAdps: Map<string, Adp> - optional param of resurgence adps
 * @returns 
 */
export const getPlayerExposureRows = (adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>, draftedPlayers: DraftedPlayer[], numDrafts: number, resurrectionAdps?: Map<string, Adp>): ExposureData[] => {
    let rows: ExposureData[] = [];
    draftedPlayers.forEach(player => {
        const { avgPickNumber, name, playerId, sumEntryFees, timesDrafted, team, position } = player;
        const { adp, posRank} = getAdpObj(player, adpMap, playerKeysMap) ?? { adp: -1, posRank: '' };
        const rowObj: ExposureData = {
            id: playerId,
            name: name,
            team,
            pos: position,
            fees: sumEntryFees,
            avgPick: Number(avgPickNumber.toFixed(1)),
            adp,
            posRank,
            clv: Number((avgPickNumber - adp).toFixed(1)),
            percentDrafted: Number((timesDrafted/numDrafts*100).toFixed(1)),
            timesDrafted
        }
        // TODO
        // if (!!resurrectionAdps) {
        //     const { manualPlayerId } = playersMap.get(playerId);
        //     const { adp: resurrectionAdp, posRank: resurrectionPosRank } = resurrectionAdps.get(manualPlayerId) ?? { adp: -1, posRank: '' };
        //     const resurrectionClv = Number((avgPickNumber - resurrectionAdp).toFixed(1));
        //     rowObj.resurrectionAdp = resurrectionAdp;
        //     rowObj.resurrectionPosRank = resurrectionPosRank;
        //     rowObj.resurrectionClv = resurrectionClv;
        // }
        rows.push(rowObj);
    });
    rows.sort((a, b) => b.percentDrafted - a.percentDrafted);
    rows.forEach((row, i) => row.resurrectionAdp === -1 && console.log(row)); // sanity check
    return rows.filter(x => x.resurrectionAdp !== -1); // hacky way to exclude players whose information is different between ADP and Resurgence ADP files
}

/**
 * Filters draftedTeams by the provided tournamentId and generates player exposure data for that subset of teams
 * @param tournamentId: tournament ID
 * @param entryFee: tournament entry fee
 * @param draftedTeams
 * @param draftedPlayersMap - Map of drafted players
 * @returns [DraftedPlayer[], number] - array of DraftedPlayers and number of drafts for the current tournament
 * TODO: should refactor tournaments slice to contain the number of drafts for each tournament
 */
export const getPlayerExposureByTournamentId = (tournamentId: string, entryFee: number,  draftedTeams: DraftedTeam[], draftedPlayersMap: Map<string, DraftedPlayer>): [DraftedPlayer[], number] => {
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
                    name: draftedPlayersMap.get(playerId)?.name ?? '',
                    team: draftedPlayersMap.get(playerId)?.team ?? '',
                    position: draftedPlayersMap.get(playerId)?.position ?? '',
                    playerId,
                });
                exposureMap.get(playerId).timesDrafted++;
                exposureMap.get(playerId).sumPickNumber += pickNumber;
                exposureMap.get(playerId).selectionInfo.push([pickNumber, team.draftEntry, timestamp]);
            });
        }
    });
    const draftedPlayers: DraftedPlayer[] = [];
    exposureMap.forEach((v, k) => {
        const { timesDrafted, sumPickNumber, selectionInfo, name, playerId, team, position, additionalKeys } = v;
        draftedPlayers.push({
            timesDrafted,
            avgPickNumber: Number((sumPickNumber/timesDrafted).toFixed(1)),
            sumEntryFees: Number((entryFee*timesDrafted).toFixed(1)),
            selectionInfo,
            name,
            playerId,
            team,
            position,
            additionalKeys,
        });
    });
    draftedPlayers.sort((a, b) => b.timesDrafted - a.timesDrafted);
    return [draftedPlayers, numDrafts];
}