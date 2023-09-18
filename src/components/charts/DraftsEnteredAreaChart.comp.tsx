import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomTooltip } from './CustomTooltip.comp';
import { ToggleButtonGroup, ToggleButton, Typography, Box } from '@mui/material';
import { formatAsMoney } from '../../utils/format.utils';

export function DraftsEnteredAreaChart(props) {

    const [toggleVal, setToggleVal] = useState<string>('quantity');

    const handleToggleChange = (e, value) => (value && value !== toggleVal) ? setToggleVal(value) : null;

    const formatXAxisLabel = (value) => props.data.find(item => value === item.numberDate)?.date ?? value;
    const formatYAxisLabel = (value) => toggleVal === 'quantity' ? value : formatAsMoney(value);

    const toggleButtons = (
        <ToggleButtonGroup
            size='small'
            color="primary"
            exclusive
            value={toggleVal}
            onChange={handleToggleChange}
        >
            <ToggleButton value="quantity">Quantity</ToggleButton>
            <ToggleButton value="entryFees">Entry Fees</ToggleButton>
        </ToggleButtonGroup>
    )

    return (
        <div style={{ height: `${props.height}` }}>
            <Box sx={{ width: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: .55 }}>
                    <Typography variant="h5">
                        Cumulative Draft Data
                    </Typography>
                </Box>
                <Box sx={{ width: .45, textAlign: 'right' }}>
                    {toggleButtons}
                </Box>
            </Box>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={props.data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="numberDate" scale="time" type='number' domain={['dataMin', 'dataMax']} tickFormatter={formatXAxisLabel} />
                    <YAxis
                        tickFormatter={formatYAxisLabel}
                        label={{ value: toggleVal === 'quantity' ? 'Quantity' : 'Entry Fees', angle: -90, position: 'insideLeft', offset: -5 }}
                    />

                    <Legend />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type='monotone'
                        dataKey={toggleVal === 'quantity' ? 'draftsRunningTotal' : 'feesRunningTotal'}
                        name={toggleVal === 'quantity' ? 'Cumulative Drafts Entered' : 'Cumulative Entry Fees'}
                        stroke='#8884d8'
                        fill='#8884d8'
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );

};