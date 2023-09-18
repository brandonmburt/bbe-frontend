import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { POS_COLORS } from '../../constants/colors.constants';
import { formatAsMoney } from '../../utils/format.utils';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string | number;
}

const generatePickTendenciesTooltip = (round, qb, rb, wr, te) => {
    const sum = qb + rb + wr + te;
    return (
        <Typography component={'div'} style={{ backgroundColor: '#FAF9F6', padding: '10px' }} variant="body2">
            <Box>
                <Typography component={'div'} variant="body2" color="text.secondary">
                    Round: <span style={{ color: 'black' }}>{round}</span>
                </Typography>
            </Box>
            {[['QB', qb], ['RB', rb], ['WR', wr], ['TE', te]].map(([pos, val], index) => {
                return (
                    <Box key={index}>
                        <Typography component={'div'} variant="body2" sx={{ color: POS_COLORS[pos] }} >
                            {pos}: {(val / sum * 100).toFixed(1)}%
                        </Typography>
                    </Box>
                )
            })}
        </Typography>
    );
}

export const CustomTooltip = ({ active, payload, label }: CustomTooltipProps, labels: string[]): any => {
    if (active && payload && payload.length) {
        const { dataKey, payload: obj } = payload[0];
        let contentArr = [];
        if (dataKey === 'frequency') {
            contentArr = [
                ['Position', obj['draftPosition'] ?? ''],
                ['Frequency', (obj['frequency'] ?? '').toString()],
            ];
        } else if (dataKey === 'entryFees') {
            contentArr = [
                ['Position', obj['draftPosition'] ?? ''],
                ['Entry Fees', formatAsMoney((obj['entryFees'] ?? '').toString())],
            ];
        } else if (dataKey === 'draftsRunningTotal') {
            contentArr = [
                ['Date', obj['date'] ?? ''],
                ['Cumulative Drafts', (obj['draftsRunningTotal'] ?? '').toString()],
            ];
        } else if (dataKey === 'feesRunningTotal') {
            contentArr = [
                ['Date', obj['date'] ?? ''],
                ['Cumulative Fees', formatAsMoney((obj['feesRunningTotal'] ?? '').toString())],
            ];
        } else if (['QB', 'WR', 'RB', 'TE'].includes(dataKey)) {
            return generatePickTendenciesTooltip(obj['round'], obj['QB'], obj['RB'], obj['WR'], obj['TE']);
        }
        return (
            <Typography component={'div'} style={{ backgroundColor: '#FAF9F6', padding: '10px' }} variant="body2">
                {contentArr.map((item, index) => {
                    return (
                        <Box key={index}>
                            <Typography component={'div'} variant="body2" color="text.secondary">
                                {item[0]}: <span style={{ color: 'black' }}>{item[1]}</span>
                            </Typography>
                        </Box>
                    );
                })}
            </Typography>
        );
    }

    return null;
};