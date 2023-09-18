
export interface Adp {
    player_id: string,
    adp: number,
    posRank: string,
}

export type SelectionArr = [number, string, string][]; // [Draft Entry, Pick Number, Picked At][]