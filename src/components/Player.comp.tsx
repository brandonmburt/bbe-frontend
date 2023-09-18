import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks'
import { selectDraftedPlayers } from '../redux/slices/exposure.slice';
import { Player } from '../models/player.model';
import { DraftedPlayer } from '../models/exposure.model';
import { selectPlayersMap } from '../redux/slices/players.slice';
import { deserializeMap } from '../redux/utils/serialize.utils';
import { calcuateScatterRange, calculateLineOfBestFit } from '../utils/math.utils';
import { SelectedPlayerTable } from './tables/SelectedPlayerTable.comp';
import { PlayerScatterPlotChart } from './charts/PlayerScatterPlot.comp';

interface PlayerData {
    playerAvg: number;
    avgStr: string;
    playerAdp: number;
    playerAdpStr: string;
    pos: string;
    timesDrafted: number,
    sumEntryFees: number,
}

interface ScatterData {
    x: number;
    y?: number;
    dateShort?: string;
    dateLong?: string;
    bestFit?: number;
}

export default function PlayerExposure(props) {

    const { playerInfo, playerAdp, posRank, team, pos } = props.data;

    const [playersMap] = useState<Map<string, Player>>(deserializeMap(useAppSelector(selectPlayersMap)));

    const [scatterData, setScatterData] = useState<ScatterData[]>(null);
    const [scatterRange, setScatterRange] = useState<[number, number]>([1, 216]);
    const [playerData, setPlayerData] = useState<PlayerData>(null);
    const [draftedPlayers] = useState<DraftedPlayer[]>(useAppSelector(selectDraftedPlayers));
    const [lineData, setLineData] = useState<any[]>(null);

    useEffect(() => {
        if (playersMap) {
            let scatterPoints: ScatterData[] = generateScatterData(playerInfo.selectionInfo);
            setScatterData(scatterPoints);
            setLineData(calculateLineOfBestFit(scatterPoints));
            setScatterRange(calcuateScatterRange(scatterPoints.map(e => e.y), playerAdp));

            const pInfo = draftedPlayers.find(({playerId: id}) => id === playerInfo.playerId);
            const { timesDrafted, sumEntryFees } = pInfo;
            setPlayerData({
                playerAvg: +playerInfo.avgPickNumber.toFixed(1),
                avgStr: getTooltipStr('Average', playerInfo.avgPickNumber.toFixed(1).toString()),
                playerAdp: playerAdp,
                playerAdpStr: getTooltipStr('Current ADP', playerAdp.toString()),
                pos: pos,
                timesDrafted,
                sumEntryFees,
            });
        }
    }, [playersMap, props]);

    const getTooltipStr = (label: string, val: string): string => [label, ' (', val, ')'].join('');

    const generateScatterData = (selectionInfo: [string, number, string][]): ScatterData[] => {
        return selectionInfo.map(([, pickNum, datetime]) => {
            return {
                y: pickNum,
                x: Number(new Date(datetime)),
                dateShort: datetime.split(' ')[0].substring(5).split('-').join('/'),
                dateLong: datetime,
            };
        }).sort((a, b) => a.x - b.x);
    }

    return (
        <>
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
            
            {scatterRange && playerData && scatterData && lineData &&
                <PlayerScatterPlotChart
                    height={'400px'}
                    playerData={playerData}
                    scatterData={scatterData}
                    scatterRange={scatterRange}
                    lineData={lineData}
                />
            }
            
        </>
    );
}