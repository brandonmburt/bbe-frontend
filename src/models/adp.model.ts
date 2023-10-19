
export interface Adp {
    playerId: string,
    adp: number,
    posRank: string,
    firstName: string,
    lastName: string,
    team: string,
    pos: string,
    additionalKeys: string[],
}

export type SelectionArr = [number, string, string][]; // [Pick Number, Draft Entry, Picked At][]