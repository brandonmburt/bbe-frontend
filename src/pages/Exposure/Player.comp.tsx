import { useState, useEffect } from 'react';
import { calcuateScatterRange, calculateLineOfBestFit } from '../../utils/math.utils';
import { SelectedPlayerTable } from './SelectedPlayerTable.comp';
import { PlayerScatterPlotChart } from '../../components/charts/PlayerScatterPlot.comp';
import { ScatterData } from '../../models/charts.model';
import { Box } from '@mui/material';

interface PlayerData {
    playerAvg: number;
    avgStr: string;
    playerAdp: number;
    playerAdpStr: string;
    pos: string;
    timesDrafted: number;
    sumEntryFees: number;
    tournamentTitle: string;
}

export default function PlayerExposure(props) {

    const { playerInfo, playerAdp, posRank, team, pos } = props.data;

    const [scatterData, setScatterData] = useState<ScatterData[]>(null);
    const [scatterRange, setScatterRange] = useState<[number, number]>([1, 216]);
    const [playerData, setPlayerData] = useState<PlayerData>(null);
    const [lineData, setLineData] = useState<any[]>(null);

    useEffect(() => {
        let scatterPoints: ScatterData[] = generateScatterData(playerInfo.selectionInfo);
        setScatterData(scatterPoints);
        setLineData(calculateLineOfBestFit(scatterPoints));
        setScatterRange(calcuateScatterRange(scatterPoints.map(e => e.y), playerAdp));

        const pInfo = props.data.playerInfo;
        const { timesDrafted, sumEntryFees, tournamentTitle } = pInfo;
        setPlayerData({
            playerAvg: +playerInfo.avgPickNumber.toFixed(1),
            avgStr: getTooltipStr('Average', playerInfo.avgPickNumber.toFixed(1).toString()),
            playerAdp: playerAdp,
            playerAdpStr: getTooltipStr('Current ADP', playerAdp.toString()),
            pos: pos,
            timesDrafted,
            sumEntryFees,
            tournamentTitle
        });
    }, [props]);

    const getTooltipStr = (label: string, val: string): string => [label, ' (', val, ')'].join('');

    const generateScatterData = (selectionInfo: [number, string, string][]): ScatterData[] => {
        return selectionInfo.map(([pickNum, , datetime]) => {
            return {
                y: pickNum,
                x: getNumbericalDate(datetime),
                dateShort: datetime.split(' ')[0].substring(5).split('-').join('/'),
                dateLong: datetime,
            };
        }).sort((a, b) => a.x - b.x);
    }

    // TODO: Move to utils
    const getNumbericalDate = (datetime: string): number => {
        const parts = datetime.split(/[- :]/);
        const year = parseInt(parts[0], 10);
        const month = parseInt((+parts[1] - 1).toString(), 10); // Month is 0-indexed
        const day = parseInt(parts[2], 10);
        const hour = parseInt(parts[3], 10);
        const minute = parseInt(parts[4], 10);
        const second = parseInt(parts[5], 10);
        const dateObject = new Date(Date.UTC(year, month, day, hour, minute, second));
        return dateObject.getTime();
    }

    return (
        <Box>
            {playerData && 
                <SelectedPlayerTable
                    team={team}
                    posRank={posRank}
                    pos={pos}
                    timesDrafted={playerData.timesDrafted}
                    sumEntryFees={playerData.sumEntryFees}
                    playerAvg={playerData.playerAvg}
                    playerAdp={playerData.playerAdp}
                />
            }
            
            {scatterRange && playerData && scatterData && lineData && playerData.timesDrafted > 1 &&
                <PlayerScatterPlotChart
                    height={'400px'}
                    playerData={playerData}
                    scatterData={scatterData}
                    scatterRange={scatterRange}
                    lineData={lineData}
                />
            }
        </Box>
    );
}