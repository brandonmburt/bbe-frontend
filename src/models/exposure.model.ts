export interface Exposure {
    draftSpots: DraftSpots,
    draftedPlayers: DraftedPlayer[],
    draftedTeams: DraftedTeam[],
    posPicksByRound: PosPicksByRound[],
    draftEntriesRunningTotals: RunningTotals[],
    tournaments: Tournament[];
    entryBreakdown: EntryBreakdown,
    uploadTime: string,
}

export interface EntryBreakdown {
    sitAndGos: BreakdownData,
    tournaments: BreakdownData,
    weeklyWinners: BreakdownData,
}

export interface BreakdownData {
    quantity: number,
    fees: number,
    fastDrafts: number,
    slowDrafts: number,
}

export interface DraftSpots {
    totalDollarSum: number,    
    totalNumDrafts: number,
    positions: {
        1: PositionData,
        2: PositionData,
        3: PositionData,
        4: PositionData,
        5: PositionData,
        6: PositionData,
        7: PositionData,
        8: PositionData,
        9: PositionData,
        10: PositionData,
        11: PositionData,
        12: PositionData,
    }
}

export interface PositionData {
    occurences: number,
    dollarSum: number,
}

export interface DraftedPlayer {
    playerId: string,
    name: string,
    avgPickNumber: number,
    sumEntryFees: number,
    timesDrafted: number,
    selectionInfo: [string, number, string][], // [Draft Entry, Pick Number, Picked At][]
}

export interface DraftedTeam {
    draftEntry: string,
    draftEntryFee: number,
    draftSize: number,
    tournamentId: string,
    weeklyWinnerId: string,
    qbs: SelectionArr,
    rbs: SelectionArr,
    wrs: SelectionArr,
    tes: SelectionArr,
    draftType: string,
}

export interface PosPicksByRound {
    round: number,
    QB: number,
    RB: number,
    WR: number,
    TE: number,
}

export interface RunningTotals {
    date: string,
    draftsRunningTotal: number,
    feesRunningTotal: number,
}

export interface Tournament {
    id: string;
    title: string;
    entryFee: number;
    tournamentSize: number;
    totalPrizes: number;
}

export type SelectionArr = [number, string, string][]; // [Pick Number, Draft Entry, Picked At][]