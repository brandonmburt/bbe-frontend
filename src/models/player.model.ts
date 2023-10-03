import { DraftedPlayer } from "../models/exposure.model";

export interface Player {
    id: string;
    name: string;
    firstName: string;
    lastName: string;
    pos: string;
    team: string;
}

export interface PlayerInputOption {
    label: string;
    playerId: string;
    selectionInfo: [string, number, string][];
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
}

export interface SelectedPlayer {
    playerInfo: DraftedPlayer;
    playerAdp: number;
    posRank: string;
    team: string;
    pos: string;
    tournamentTitle: string;
}