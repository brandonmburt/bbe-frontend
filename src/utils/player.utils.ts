import { Adp } from "../models/adp.model";
import { DraftedPlayer, DraftedTeam, ExposureSnapshot, PlayoffMatchupInfo, PlayerStack, Tournament } from "../models/exposure.model";
import { ExposureData, PlayerInputOption, SelectedPlayer } from "../models/player.model";
import { getAdpObj } from '../utils/adp.utils';
import { PLAYOFF_MATCHUPS } from '../constants/playoffs.constants';

/**
 * Returns an array which is used to populate the player exposure autocomplete
 * @param {DraftedPlayer[]} draftedPlayers - array of drafted players
 * @returns {PlayerInputOption[]} - array of PlayerInputOptions
 */
export const generateInputOptions = (draftedPlayers: DraftedPlayer[]): PlayerInputOption[] => {
    // Excluding players that were only drafted once, as the scatterplot wont properly populate
    return draftedPlayers.filter(x => x.timesDrafted > 1).map(player => {
        const { name, playerId, selectionInfo, avgPickNumber, timesDrafted } = player;
        return { label: name, playerId, selectionInfo, avgPick: avgPickNumber, timesDrafted };
    }).sort((a,b) => b.timesDrafted - a.timesDrafted);
}

/**
 * Returns an array of ExposureData objects which are used to populate the player exposure table
 * @param {Map<string, Adp>} adpMap - Map of adps { playerId: Adp }
 * @param {Map<string, string>} playerKeysMap - Map of additional keys { key: playerId }
 * @param {DraftedPlayer[]} draftedPlayers - array of drafted players
 * @param {number} numDrafts - number of drafts
 * @returns {ExposureData[]} - array of ExposureData objects
 */
export const getPlayerExposureRows = (adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>,
    draftedPlayers: DraftedPlayer[], numDrafts: number): ExposureData[] => {
    
    let rows: ExposureData[] = [];
    draftedPlayers.forEach(player => {
        const { avgPickNumber, name, playerId, sumEntryFees, timesDrafted, team, position, additionalKeys } = player;
        const { adp, posRank } = getAdpObj(player, adpMap, playerKeysMap) ?? { adp: -1, posRank: '' };
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
            timesDrafted,
            additionalKeys,
        }
        rows.push(rowObj);
    });
    rows.sort((a, b) => b.percentDrafted - a.percentDrafted);
    return rows;
}

/**
 * Adds resurrection data to the previously generated ExposureData objects
 * @param {ExposureData[]} rows - array of ExposureData objects generated for the exposure grid
 * @param {Map<string, Adp>} resurrectionAdps - Map of resurrection adps { playerId: Adp }
 * @param {Map<string, string>} resurrectionKeysMap - Map of additional resurrection keys
 */
export const addResurrectionData = (rows: ExposureData[], resurrectionAdps: Map<string, Adp>,
    resurrectionKeysMap: Map<string, string>): void => {
    
    rows.forEach((rowObj: ExposureData) => {
        const { id, additionalKeys, avgPick } = rowObj;
        const draftedPlayer: Partial<DraftedPlayer> = { playerId: id, additionalKeys };
        const { adp: resAdp, posRank: resPosRank } = getAdpObj(draftedPlayer, resurrectionAdps, resurrectionKeysMap) ?? { adp: -1, posRank: '' };
        const resurrectionClv = Number((avgPick - resAdp).toFixed(1));
        rowObj.resurrectionAdp = resAdp;
        rowObj.resurrectionPosRank = resPosRank;
        rowObj.resurrectionClv = resurrectionClv;
    });
}

/**
 * Filters draftedTeams by the provided tournamentId and generates player exposure data for that subset of teams
 * @param {Tournament} tournament - tournament to filter exposure data on
 * @param {DraftedTeam[]} draftedTeams - array of drafted teams
 * @param {Map<string, DraftedPlayer>} draftedPlayersMap - Map of drafted players
 * @returns {[DraftedPlayer[], number]} - array of DraftedPlayers and number of drafts
 */
export const getPlayerExposureByTournamentId = (tournament: Tournament, draftedTeams: DraftedTeam[],
    draftedPlayersMap: Map<string, DraftedPlayer>): [DraftedPlayer[], number] => {

    const { id: tournamentId, entryFee } = tournament;
    const filteredMap: Map<string, DraftedPlayer> = new Map();
    let numDrafts = 0; // number of drafts for the current tournament
    draftedTeams.forEach((t: DraftedTeam) => {
        if (t.tournamentId === tournamentId || t.weeklyWinnerId === tournamentId) {
            numDrafts++;
            t.qbs.concat(t.rbs, t.wrs, t.tes).forEach(([ pickNumber, playerId, timestamp ]) => {
                if (!filteredMap.has(playerId)) {
                    const { additionalKeys, name, team, position } = draftedPlayersMap.get(playerId);
                    filteredMap.set(playerId, {
                        playerId, additionalKeys, name, team, position,
                        timesDrafted: 1,
                        avgPickNumber: pickNumber, // Temporarily storing the sum of pick numbers here
                        sumEntryFees: entryFee,
                        selectionInfo: [[pickNumber, t.draftEntry, timestamp]],
                    });
                } else {
                    const exposureObj = filteredMap.get(playerId);
                    exposureObj.timesDrafted++;
                    exposureObj.avgPickNumber += pickNumber;
                    exposureObj.sumEntryFees += entryFee;
                    exposureObj.selectionInfo.push([pickNumber, t.draftEntry, timestamp]);
                }
            });
        }
    });
    const filteredPlayers: DraftedPlayer[] = [];
    filteredMap.forEach((v, k) => {
        const { timesDrafted, avgPickNumber, sumEntryFees } = v;
        filteredPlayers.push({
            ...v,
            avgPickNumber: Number((avgPickNumber/timesDrafted).toFixed(1)),
            sumEntryFees: Number(sumEntryFees.toFixed(1)),
        });
    });
    filteredPlayers.sort((a, b) => b.timesDrafted - a.timesDrafted);
    return [filteredPlayers, numDrafts];
}

/**
 * Generate unique players snapshot
 * @param {ExposureData[]} gridRows - array of ExposureData objects
 * @param {number} draftQuantity - number of drafts
 * @returns {ExposureSnapshot} - ExposureSnapshot object
 */
export const generateExposureSnapshot = (gridRows: ExposureData[], draftQuantity: number): ExposureSnapshot => {
    const snapshot: ExposureSnapshot = {
        totalDrafts: draftQuantity,
        uniquePlayers: { qbs: 0, rbs: 0, wrs: 0, tes: 0 }
    }
    gridRows.forEach(({ pos }) => {
        if (pos === 'QB') snapshot.uniquePlayers.qbs++;
        else if (pos === 'RB') snapshot.uniquePlayers.rbs++;
        else if (pos === 'WR') snapshot.uniquePlayers.wrs++;
        else if (pos === 'TE') snapshot.uniquePlayers.tes++;
    });
    return snapshot;
}

/**
 * Get necessary data to populate the selected player section
 * @param {DraftedPlayer} draftedPlayer
 * @param {Map<string, Adp>} adpMap - Map of adps { playerId: Adp }
 * @param {Map<string, string>} playerKeysMap - Map of additional keys { key: playerId }
 * @param {DraftedPlayer[]} players - array of drafted players
 * @param {Tournament} tournament - tournament info, or null if no tournament selected
 * @returns {SelectedPlayer} - SelectedPlayer object
 */
export const getSelectedPlayerData = (draftedPlayer: DraftedPlayer, adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>,
    players: DraftedPlayer[], tournament: Tournament): SelectedPlayer => {
    
    let { adp, posRank } = getAdpObj(draftedPlayer, adpMap, playerKeysMap) ?? { adp: -1, posRank: null };
    let { position, team } = draftedPlayer ?? { position: null, team: null };
    /* Important becuase players might be a filtered subset of all drafted players data */
    const playerInfo = players.find(({ playerId: pId }) => pId === draftedPlayer.playerId);
    return {
        playerInfo,
        playerAdp: Number(adp) ?? 216, // TODO: handle case when ADP isn't a number
        posRank,
        team,
        pos: position,
        tournamentTitle: tournament?.title ?? null,
    };
}

/**
 * Generate playoff matchup info for a given team
 * @param {string} team - the team of the player we want to get playoff matchup info for
 * @returns {Map<string, PlayoffMatchupInfo>} - Map of playoff matchup info { opponent_team: PlayoffMatchupInfo }
 */
export const getPlayoffMatchupInfoMap = (team: string): Map<string, PlayoffMatchupInfo> => {
    const playoffMap: Map<string, PlayoffMatchupInfo> = new Map();
    [15, 16, 17].forEach(week => {
        const matchup = PLAYOFF_MATCHUPS[week].find(x => x.home === team || x.away === team);
        if (matchup.home === team) playoffMap.set(matchup.away, { week, home: team, away: matchup.away });
        else if (matchup.away === team) playoffMap.set(matchup.home, { week, home: matchup.home, away: team, });
    });
    return playoffMap;
}

/**
 * Generate player stacks for a given player
 * @param {DraftedPlayer} player - the player we want to get stacks for
 * @param {DraftedPlayer[]} draftedPlayers - array of drafted players
 * @param {DraftedTeam[]} draftedTeams - array of drafted teams
 * @param {Map<string, PlayoffMatchupInfo>} playoffMap - Map of playoff matchup info { opponent_team: PlayoffMatchupInfo }
 * @returns {PlayerStack[]} - array of PlayerStack objects
 */
export const generatePlayerStacks = (player: DraftedPlayer, draftedPlayers: DraftedPlayer[],
    draftedTeams: DraftedTeam[], playoffMap: Map<string, PlayoffMatchupInfo>): PlayerStack[] => {
    
    const { selectionInfo, playerId: selectedPlayerId } = player;
    const entryIds = selectionInfo.map(x => x[1]);
    const entriesSet: Set<string> = new Set(entryIds);
    const playersStack: Map<string, PlayerStack> = new Map();
    draftedTeams.forEach(team => {
        const { draftEntry, draftEntryFee, qbs, rbs, wrs, tes } = team;
        if (!entriesSet.has(draftEntry)) return;
        [...qbs, ...rbs, ...wrs, ...tes].forEach(([, playerId, ]) => {
            if (playerId === selectedPlayerId) return;
            if (!playersStack.has(playerId)) {
                const { name, team, position } = draftedPlayers.find(p => p.playerId === playerId);
                playersStack.set(playerId, {
                    playerId, name, team, position,
                    entryFees: draftEntryFee,
                    timesDrafted: 1,
                    playoffMatchupWeek: playoffMap.get(team)?.week ?? null,
                });
            } else {
                playersStack.get(playerId).entryFees += draftEntryFee;
                playersStack.get(playerId).timesDrafted += 1;
            }
        });
    });
    const playersArr = [];
    playersStack.forEach((v, k) => playersArr.push(v));

    return playersArr.sort((a, b) => {
        if (a.timesDrafted !== b.timesDrafted) return b.timesDrafted - a.timesDrafted;
        else return b.entryFees - a.entryFees;
    });
}