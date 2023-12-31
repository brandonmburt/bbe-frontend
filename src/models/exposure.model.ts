export interface Exposure {
    draftSpots: DraftSpots,
    draftedPlayers: DraftedPlayer[],
    draftedPlayersMap?: Map<string, DraftedPlayer>, // TODO: optional?
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
    team: string,
    position: string,
    avgPickNumber: number,
    sumEntryFees: number,
    timesDrafted: number,
    selectionInfo: any[], // SelectionArr[]
    additionalKeys: string[],
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

export interface ExposureSnapshot {
    totalDrafts: number,
    uniquePlayers: {
        qbs: number,
        rbs: number,
        wrs: number,
        tes: number
    }
}

export interface PlayerStack {
    playerId: string;
    name: string;
    team: string;
    position: string;
    entryFees: number;
    timesDrafted: number;
    playoffMatchupWeek: number; // 15, 16, 17, or null
}

export interface PlayoffMatchupInfo {
    week: number;
    home: string;
    away: string;
}

export interface ExposureType {
    id: string;
    label: string;
    season: number; // i.e. 2023
    platform: string; // i.e. 'underdog'
    cutoffDate: string; // i.e. '9/07/2023'
    allowUpload: boolean;
    enableResurrection: boolean;
    active: boolean;
}

export interface UploadedExposureData {
    id: string; // corresponds to exposureType.id
    label: string;
    timestamp: string;
}

export type SelectionArr = [number, string, string][]; // [Pick Number, Draft Entry, Picked At][]