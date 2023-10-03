import { useState } from 'react';
import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis } from 'recharts';
import { Box, FormControlLabel, FormGroup, Switch } from '@mui/material';
import { POS_COLORS } from '../../constants/colors.constants';

export function PlayerScatterPlotChart(props) {

    const { scatterData, scatterRange, playerData, lineData } = props;

    const [bestFitSwitch, setBestFitSwitch] = useState<boolean>(true);
    const [avgPickSwitch, setAvgPickSwitch] = useState<boolean>(true);
    const [adpSwitch, setAdpSwitch] = useState<boolean>(true);

    const formatXAxisLabel = (value) => scatterData.find(item => value === item.x)?.dateShort ?? value;

    const customTooltipFormatter = (val, name, entry) => {
        return name === "pick" ? [val, "Pick"] : [scatterData.find(item => val === item.x)?.dateLong ?? val, "Timestamp"];
    };

    return (
        <>
            <Box sx={{ width: 1, flexDirection: 'row', display: { xs: 'block', md: 'flex' }, justifyContent: 'right', fontSize: '12px' }}>
                <FormGroup>
                    <FormControlLabel
                        label={<span style={{ fontSize: '14px' }}>Line Of Best Fit</span>}
                        labelPlacement='start'
                        control={
                            <Switch checked={bestFitSwitch} onChange={() => setBestFitSwitch(!bestFitSwitch)} />
                        } />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        label={<span style={{ fontSize: '14px' }}>Average Pick</span>}
                        labelPlacement='start'
                        control={
                            <Switch checked={avgPickSwitch} onChange={() => setAvgPickSwitch(!avgPickSwitch)} />
                        } />
                </FormGroup>
                <FormGroup>
                    <FormControlLabel
                        label={<span style={{ fontSize: '14px' }}>Current ADP</span>}
                        labelPlacement='start'
                        control={
                            <Switch checked={adpSwitch} onChange={() => setAdpSwitch(!adpSwitch)} />
                        } />
                </FormGroup>
            </Box>

            <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ top: 20, right: 40, bottom: 0, left: 0 }} >
                    <CartesianGrid />
                    <XAxis scale="time" type="category" dataKey="x" name="date string" tickFormatter={formatXAxisLabel} />
                    <YAxis type="number" dataKey="y" name="pick" domain={scatterRange} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={customTooltipFormatter} />
                    <Scatter name="" data={scatterData} fill={POS_COLORS[playerData.pos]} />
                    <ReferenceLine
                        visibility={bestFitSwitch ? 'visible' : 'hidden'}
                        label=""
                        stroke={POS_COLORS[playerData.pos]}
                        segment={lineData}
                    />
                    <ReferenceLine
                        visibility={avgPickSwitch ? 'visible' : 'hidden'}
                        y={playerData.playerAvg}
                        stroke="green"
                        strokeDasharray="3 3"
                        label={avgPickSwitch ? playerData.avgStr : ''}
                    />
                    <ReferenceLine
                        visibility={adpSwitch ? 'visible' : 'hidden'}
                        y={playerData.playerAdp}
                        stroke="red"
                        strokeDasharray="3 3"
                        label={adpSwitch ? playerData.playerAdpStr : ''}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </>
    )

};