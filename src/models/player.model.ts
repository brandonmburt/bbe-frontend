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
    resurrectionPosRank?: string;
    resurrectionAdp?: number;
    resurrectionClv?: number;
}

export interface SelectedPlayer {
    playerInfo: DraftedPlayer;
    playerAdp: number;
    posRank: string;
    team: string;
    pos: string;
    tournamentTitle: string;
}

export interface ReplacementRule {
    id: string,
    firstNameMatch: string,
    lastNameMatch: string,
    firstNameReplacement: string,
    lastNameReplacement: string,
    createdAt: string,
}
