import { DraftedPlayer } from "../models/exposure.model";
import { SelectionArr } from "./exposure.model";

export interface PlayerInputOption {
    label: string;
    playerId: string;
    selectionInfo: SelectionArr[];
    avgPick: number;
    timesDrafted: number;
}

export interface ExposureData {
    id: string;
    name: string;
    team: string;
    pos: string;
    fees: number;
    avgPick: number;
    adp: number;
    posRank: string;
    clv: number;
    percentDrafted: number;
    timesDrafted: number;
    additionalKeys?: string[];
    resurrectionPosRank?: string;
    resurrectionAdp?: number;
    resurrectionClv?: number;
    experience?: string; // 'R' | 'S' | 'V'; Note that 'V' is for veteran and is not currently used
}

export interface SelectedPlayer {
    playerInfo: DraftedPlayer;
    playerAdp: number;
    posRank: string;
    team: string;
    pos: string;
    tournamentTitle: string;
}

export interface RookieDefinition {
    id: string,
    playerId: string,
    season: number,
    firstName: string,
    lastName: string,
    team: string,
    position: string,
    createdAt: string,
}

export interface RookieKey {
    playerId: string,
    season: number,
}