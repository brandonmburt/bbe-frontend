export interface BarChartData {
    draftPosition: string;
    frequency: number;
    entryFees: number;
}

export interface AreaChartData {
    date: string;
    numberDate: number;
    draftsRunningTotal: number;
    feesRunningTotal: number;
}

export interface ScatterData {
    x: number;
    y?: number;
    dateShort?: string;
    dateLong?: string;
    bestFit?: number;
}