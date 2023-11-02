import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomTooltip } from './CustomTooltip.comp';
import { POS_COLORS } from '../../constants/colors.constants';
import { Box, Typography } from '@mui/material';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../ToolTip.comp';

export function PickTendenciesAreaChart(props) {

    const formatYAxisLabel = (value) => value * 100 + '%';

    return (
        <Box style={{ height: `${props.height}` }} >
            <Box sx={{ width: 1, flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: 1 }}>
                    <Typography variant="h5" sx={{ marginBottom: { xs: '10px', sm: '20px' }, fontSize: { xs: '20px', md: '24px' } }}>
                        Pick Tendencies By Round
                        <ToolTip title={TOOLTIPS.SELECTED_TYPE_DATA} infoIcon={true} />
                    </Typography>
                </Box>
            </Box>

            <ResponsiveContainer width="100%" height="95%">
                <AreaChart
                    data={props.data}
                    stackOffset="expand"
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="round" />
                    <YAxis label={{ value: 'Percentage', angle: -90, position: 'insideLeft', offset: 5 }} tickFormatter={formatYAxisLabel} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area type="monotone" dataKey="QB" stackId="1" stroke={POS_COLORS.qb} fill={POS_COLORS.qb} />
                    <Area type="monotone" dataKey="RB" stackId="1" stroke={POS_COLORS.rb} fill={POS_COLORS.rb} />
                    <Area type="monotone" dataKey="WR" stackId="1" stroke={POS_COLORS.wr} fill={POS_COLORS.wr} />
                    <Area type="monotone" dataKey="TE" stackId="1" stroke={POS_COLORS.te} fill={POS_COLORS.te} />
                </AreaChart>
            </ResponsiveContainer>
        </Box>
    );

};