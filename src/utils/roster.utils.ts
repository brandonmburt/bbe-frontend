import { DraftedTeamRowData, PickInfo, PlayoffStack } from '../models/roster.model';
import { Adp } from '../models/adp.model';
import { DraftedTeam, Tournament } from '../models/exposure.model';
import { Player } from '../models/player.model';
import { PLAYOFF_MATCHUPS } from '../constants/playoffs.constants';

export const getDraftedRosters = (draftedTeams: DraftedTeam[], adpMap: Map<string, Adp>, playersMap: Map<string, Player>, tournaments: Tournament[]): DraftedTeamRowData[] => {
    let arr: DraftedTeamRowData[] = [];
        draftedTeams.forEach(draftedTeam => {
            const { qbs, rbs, wrs, tes, draftEntryFee, draftEntry, weeklyWinnerId, tournamentId, draftSize } = draftedTeam;
            let totalCLV = 0;
            const selections: PickInfo[] = [...qbs, ...rbs, ...wrs, ...tes].map(([pick, id, timestamp]) => {
                const adp = adpMap.get(id)?.adp ?? -1;
                const clv = pick - adp;
                totalCLV += clv;
                const player = playersMap.get(id);
                const info: PickInfo = {
                    id,
                    pickNum: pick,
                    name: player.name,
                    pos: player.pos,
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