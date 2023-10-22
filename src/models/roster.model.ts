export interface DraftedTeamRowData {
    id: string; // same as draftId; grid requires it
    draftId: string;
    entryType: string;
    title: string; // if tournament or WW, name of contest; otherwise Sit & Go
    entryFee: number;
    totalCLV: number;
    draftSize: number;
    selections: PickInfo[];
    startDate: string; // timestamp of first pick
    tournamentSize: number; // if tournament or WW, number of entries; otherwise 0
    tournamentPrizes: number; // if tournament or WW, total prizes; otherwise 0
    draftType: string; // fast, slow, or instant
}

export interface PickInfo {
    pickNum: number;
    name: string;
    currAdp: number;
    clv: number;
    timestamp: string;
    id: string;
    pos: string;
    team: string;
}

export interface PlayoffStack {
    home: PickInfo[];
    away: PickInfo[];
}