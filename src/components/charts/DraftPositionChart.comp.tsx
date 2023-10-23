import { useEffect, useState } from 'react';
import { Bar, CartesianGrid, ComposedChart, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CustomTooltip } from './CustomTooltip.comp';
import { ToggleButtonGroup, ToggleButton, Typography, Box } from '@mui/material';
import Switch from '@mui/material/Switch';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import InfoIcon from '@mui/icons-material/Info';
import { Tooltip as MUIToolTip } from '@mui/material';
import { TOOLTIPS } from '../../constants/tooltips.constants';

export function DraftPositionChart (props) {

    const [distributionToggle, setDistributionToggle] = useState<string>('frequency');
    const [expectedSwitch, setExpectedSwitch] = useState<boolean>(false);
    const [expectedOccurenceAvg, setExpectedOccurenceAvg] = useState<number>(null);
    const [expectedFeeAvg, setExpectedFeeAvg] = useState<number>(null);

    useEffect(() => {
        if (props.data && props.data.length > 0) {
            let sumDrafts = props.data.reduce((acc, item) => acc += item.frequency, 0);
            setExpectedOccurenceAvg(Math.round(sumDrafts / props.data.length));
            let sumFees = props.data.reduce((acc, item) => acc += item.entryFees, 0);
            setExpectedFeeAvg(Math.round(sumFees / props.data.length));
        }
    }, [props.data]);

    const handleDistributionToggleChange = (e, value) => (value && value !== distributionToggle) ? setDistributionToggle(value) : null;

    const distributionToggleButtons = (
        <ToggleButtonGroup
            size='small'
            color="primary"
            exclusive
            value={distributionToggle}
            onChange={handleDistributionToggleChange}
        >
            <ToggleButton value="frequency">Frequency</ToggleButton>
            <ToggleButton value="entryFees">Entry Fees</ToggleButton>
        </ToggleButtonGroup>
    )
   
    return (
        <div style={{height: `${props.height}` }} >
            <Box sx={{ width: 1,flexDirection: 'row', display: 'flex', justifyContent: 'space-between' }}>
                <Box sx={{ width: .5 }}>
                    <Typography variant="h5" sx={{ fontSize: { xs: '20px', md: '24px' } }}>
                        Draft Position Distribution
                        <MUIToolTip title={TOOLTIPS.SELECTED_TYPE_DATA} placement="top" arrow>
                            <InfoIcon sx={{ marginLeft: '5px', color: 'lightgrey', lineHeight: 1, verticalAlign: 'middle' }} />
                        </MUIToolTip>
                    </Typography>        
                </Box>
                <Box sx={{ width: .5, textAlign: 'right' }}>
                    {distributionToggleButtons}
                </Box>
            </Box>

            <Box sx={{ width: 1, flexDirection: 'row', display: 'flex', justifyContent: 'right', fontSize: '12px' }}>
                <FormGroup>
                    <FormControlLabel
                        label={<span style={{ fontSize: '14px' }}>Show Average</span>}
                        labelPlacement='start'
                        control={
                            <Switch checked={expectedSwitch} onChange={() => setExpectedSwitch(!expectedSwitch)} />
                        } />
                </FormGroup>
            </Box>

            <ResponsiveContainer width="100%" height="85%">
                <ComposedChart
                    width={500}
                    height={300}
                    data={props.data}
                    margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="draftPosition" label={{ value: 'Position', position: 'insideBottom', offset: -10 }} />
                    <YAxis label={{ value: distributionToggle === 'frequency' ? 'Frequency' : 'Entry Fees', angle: -90, position: 'insideLeft', offset: 10 }} />
                    
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey={distributionToggle === 'frequency' ? 'frequency' : 'entryFees'} fill='#82ca9d' >
                        <LabelList dataKey={distributionToggle === 'frequency' ? 'frequency' : 'entryFees'} position="top" />
                    </Bar>
                    {expectedSwitch && 
                        <ReferenceLine
                            visibility={expectedSwitch ? 'visible' : 'hidden'}
                            stroke="blue"
                            strokeDasharray="3 3"
                            label={{ position: 'left', value: distributionToggle === 'frequency' ? expectedOccurenceAvg : expectedFeeAvg}}
                            y={distributionToggle === 'frequency' ? expectedOccurenceAvg : expectedFeeAvg}
                        />
                    }
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
  
  };