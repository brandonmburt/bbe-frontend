import { DraftedTeamRowData, PickInfo, PlayoffStack, PlayerFilterOption } from '../models/roster.model';
import { Adp } from '../models/adp.model';
import { DraftedPlayer, DraftedTeam, Tournament } from '../models/exposure.model';
import { PLAYOFF_MATCHUPS } from '../constants/playoffs.constants';
import { getAdpObj } from './adp.utils';

/**
 * Generate drafted roster data for data grid
 * @param {DraftedTeam[]} draftedTeams - array of drafted teams
 * @param {Map<string, Adp>} adpMap - map of adp data
 * @param {Map<string, string>} playerKeysMap - map of additional player keys
 * @param {Map<string, DraftedPlayer>} draftedPlayersMap - map of drafted players
 * @param {Tournament[]} tournaments - array of tournaments
 * @returns {DraftedTeamRowData[]} - array of drafted team row data
 */
export const getDraftedRosters = (draftedTeams: DraftedTeam[], adpMap: Map<string, Adp>, playerKeysMap: Map<string, string>,
    draftedPlayersMap: Map<string, DraftedPlayer>, tournaments: Tournament[]): DraftedTeamRowData[] => {

    let arr: DraftedTeamRowData[] = [];
    draftedTeams.forEach(draftedTeam => {
        const { qbs, rbs, wrs, tes, draftEntryFee, draftEntry, weeklyWinnerId, tournamentId, draftSize, draftType } = draftedTeam;
        let totalCLV = 0;
        const selections: PickInfo[] = [...qbs, ...rbs, ...wrs, ...tes].map(([pick, id, timestamp]) => {
            const adp = getAdpObj(draftedPlayersMap.get(id), adpMap, playerKeysMap)?.adp ?? -1;
            if (adp === -1) console.warn('no adp found for player', id);
            const clv = pick - adp;
            totalCLV += clv;
            const player = draftedPlayersMap.get(id);
            if (!player) {
                console.log('player not found: ', id);
                console.log('team: ', draftedTeam);
                return null;
            }
            const info: PickInfo = {
                id,
                pickNum: pick,
                name: player.name,
                pos: player.position,
                team: player.team,
                currAdp: adp,
                clv,
                timestamp,
            };
            return info;
        }).sort((a, b) => a.pickNum - b.pickNum);
        let rowData: DraftedTeamRowData = {
            id: draftEntry,
            draftId: draftEntry,
            entryFee: draftEntryFee,
            totalCLV,
            draftSize,
            selections,
            entryType: 'Sit & Go',
            title: draftSize.toString() + ' Person Draft',
            tournamentSize: null,
            tournamentPrizes: null,
            startDate: selections[0].timestamp,
            draftType: draftType.charAt(0).toUpperCase() + draftType.slice(1),
        }
        if (weeklyWinnerId !== '' || tournamentId !== '') {
            let tournament: Tournament = tournaments.find(t => t.id === weeklyWinnerId || t.id === tournamentId);
            rowData = {
                ...rowData,
                entryType: weeklyWinnerId !== '' ? 'Weekly Winner' : 'Tournament',
                title: tournament.title,
                tournamentSize: tournament.tournamentSize,
                tournamentPrizes: tournament.totalPrizes
            };
        }
        arr.push(rowData);
    });
    arr.sort((a, b) => b.totalCLV - a.totalCLV);
    return arr;
}

/**
 * Generate the options for the multi-select autocomplete
 * @param {DraftedTeamRowData[]} rosters - Drafts grid data
 * @param {Map<string, DraftedPlayer>} draftedPlayersMap - map of drafted players
 * @returns {PlayerFilterOption[]} - Array of player filter options
 */
export const generateRosterFilterOptions = (rosters: DraftedTeamRowData[], draftedPlayersMap: Map<string, DraftedPlayer>): PlayerFilterOption[] => {
    let optionsMap: Map<string, { name: string, position: string }> = new Map();;
    rosters.forEach(roster => {
        roster.selections.forEach(({ id, name }) => {
            if (!optionsMap.has(id)) {
                const position = draftedPlayersMap.get(id)?.position ?? '';
                optionsMap.set(id, { name, position });
            }
        });
    });
    let options: PlayerFilterOption[] = [];
    optionsMap.forEach((obj, id) => options.push({ value: id, label: obj.name, position: obj.position }) );
    return options;
}

/**
 * Generate playoff stacks for a given roster
 * @param {DraftedTeamRowData} teamData - The roster we want to get playoff stacks for
 * @returns {Map<number, PlayoffStack[]>} - Map of playoff stacks by week
 */
export const getPlayoffStacks = (teamData: DraftedTeamRowData): Map<number, PlayoffStack[]> => {
    let uniqueTeams = new Set<string>(teamData.selections.map(({ team }) => team));
    let teamStackMap = new Map<string, PickInfo[]>();
    uniqueTeams.forEach(team => teamStackMap.set(team, []));
    const order = ['QB', 'WR', 'TE', 'RB'];
    order.forEach(position => {
        teamData.selections.filter(({ pos }) => position === pos).forEach(pick => {
            teamStackMap.get(pick.team).push(pick);
        });
    });
    let playoffStackMap = new Map<number, PlayoffStack[]>();
    [15, 16, 17].forEach(week => {
        playoffStackMap.set(week, []);
        PLAYOFF_MATCHUPS[week].forEach(({ home, away }) => {
            if (teamStackMap.has(home) && teamStackMap.has(away)) {
                playoffStackMap.get(week).push({
                    home: teamStackMap.get(home),
                    away: teamStackMap.get(away),
                });
            }
        });
    });
    return playoffStackMap;
}