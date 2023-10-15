
export interface Adp {
    playerId: string,
    adp: number,
    posRank: string,
    manualPlayerId: string, // concat(firstName, lastName, pos, team)
}

export type SelectionArr = [number, string, string][]; // [Draft Entry, Pick Number, Picked At][]