import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks'
import { DraftSpots, EntryBreakdown, PosPicksByRound, RunningTotals } from '../models/exposure.model';
import {
    selectDraftSpots,
    selectEntryBreakdown,
    selectPosPicksByRound,
    selectRunningTotals,
    selectTotalDraftsEntered,
    selectTotalEntryFees,
} from '../redux/slices/exposure.slice';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import { CardComp } from './CardComp.comp';
import { DraftPositionChart } from './charts/DraftPositionChart.comp';
import { DraftsEnteredAreaChart } from './charts/DraftsEnteredAreaChart.comp';
import { PickTendenciesAreaChart } from './charts/PickTendenciesAreaChart.comp';
import useLoginRedirect from '../hooks/useLoginRedirect';
import { selectExposureType } from '../redux/slices/exposure.slice';
import { getNumbericalDate } from '../utils/date.utils';
import { SummaryTable } from './tables/SummaryTable.comp';
import { EntriesTable } from './tables/EntriesTable.comp';

interface BarChartData {
    draftPosition: string;
    frequency: number;
    entryFees: number;
}

interface AreaChartData {
    date: string;
    numberDate: number;
    draftsRunningTotal: number;
    feesRunningTotal: number;
}

export function Home() {
    useLoginRedirect();

    const selectedExposureType = useAppSelector(selectExposureType); // TODO: might want this for adding labels to chart titles?
    const draftSpotsData: DraftSpots = useAppSelector(selectDraftSpots);
    const posPicksByRound: PosPicksByRound[] = useAppSelector(selectPosPicksByRound);
    const runningTotals: RunningTotals[] = useAppSelector(selectRunningTotals);
    const totalDraftsEntered: number = useAppSelector(selectTotalDraftsEntered);
    const totalEntryFees: number = useAppSelector(selectTotalEntryFees);
    const entryBreakdown: EntryBreakdown = useAppSelector(selectEntryBreakdown);

    const [barChartData, setBarChartData] = useState<BarChartData[]>(null);
    const [runningTotalsData, setRunningTotalsData] = useState<AreaChartData[]>(null);

    useEffect(() => {
        if (!draftSpotsData) return;
        const { positions } = draftSpotsData;
        let barChartArr: BarChartData[] = [];
        for (const key in positions) {
            const { occurences, dollarSum } = positions[key];
            barChartArr.push({ draftPosition: key, frequency: occurences, entryFees: dollarSum });
        }
        setBarChartData(barChartArr);
    }, [draftSpotsData]);

    useEffect(() => {
        if (!runningTotals) return;
        let runningTotalsArr: AreaChartData[] = runningTotals.map(row => ({ numberDate: getNumbericalDate(row.date), ...row}));
        setRunningTotalsData(runningTotalsArr);
    }, [runningTotals]);

    const entriesContent = !entryBreakdown ? null : (
        <EntriesTable entryBreakdown={entryBreakdown} />
    );

    const summaryTable = !totalDraftsEntered || !totalEntryFees ? null : (
        <SummaryTable totalDraftsEntered={totalDraftsEntered} totalEntryFees={totalEntryFees} />
    );

    return entriesContent && summaryTable && barChartData ? (
        <>
            <Box sx={{ flexGrow: 1, padding: '20px 40px' }}>
                <Grid container spacing={4}>
                    <Grid xs={12} >
                        <Box sx={{ flexGrow: 1 }} >
                            <Grid container spacing={4}>
                                <Grid xs={12} md={4} >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
                                        <CardComp sx={{ flexGrow: 1}} title='Overview' body={summaryTable} />
                                    </Box>
                                </Grid>
                                <Grid xs={12} md={8} >
                                    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }} >
                                        <CardComp title='Entries' body={entriesContent} />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box sx={{ flexGrow: 1, padding: '20px 40px' }}>
                <Grid container spacing={4} >
                    <Grid xs={12} >
                        <CardComp
                            body={<DraftPositionChart height={'400px'} data={barChartData} />}
                        />
                    </Grid>
                </Grid>
            </Box>

            {runningTotals && posPicksByRound &&
                <Box sx={{ flexGrow: 1, padding: '20px 40px' }}>
                    <Grid container spacing={4}>
                        <Grid xs={12} md={6} >
                            <CardComp
                                body={<DraftsEnteredAreaChart height={'400px'} data={runningTotalsData} />}
                            />
                        </Grid>
                        <Grid xs={12} md={6} >
                            <CardComp
                                body={<PickTendenciesAreaChart height={'400px'} data={posPicksByRound} />}
                            />
                        </Grid>
                    </Grid>
                </Box>
            }

        </>
    ) : null;
}