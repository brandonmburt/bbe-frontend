import { useState, useEffect } from 'react';
import { Box, FormControlLabel, FormGroup, Switch, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ToolTip } from '../../components/ToolTip.comp';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import InfoIcon from '@mui/icons-material/Info';

const TOGGLE_INFO = [
    ['all', 'All'],
    ['rookies', 'Rookies'],
    ['sophomores', 'Sophomores'],
];

export function FilterOptions(props) {

    const { resurrectionToggle, isResurrectionEnabled } = props;

    const [toggleButton, setToggleButton] = useState<string>(TOGGLE_INFO[0][0]);

    const handleToggleButtonChange = (e, v) => (v && v !== toggleButton) ? setToggleButton(v) : null;

    useEffect(() => {
        props.setShowRookies(toggleButton === 'rookies');
        props.setShowSophomores(toggleButton === 'sophomores');
    }, [toggleButton]);

    return (
        <Box sx={{ width: 1, display: 'flex', justifyContent: 'space-between', fontSize: '12px', flexWrap: 'wrap', mb: 1 }}>

            <ToggleButtonGroup size='small' color="primary" exclusive value={toggleButton} onChange={handleToggleButtonChange} sx={{ mt:1 }}>
                {TOGGLE_INFO.map(([value, label]) => <ToggleButton key={value} value={value} sx={{fontSize: '11px'}}>{label}</ToggleButton> )}
            </ToggleButtonGroup>
            
            {isResurrectionEnabled &&
                <Box sx={{ flexDirection: 'row', display: 'flex', mt: 1 }}>
                    <FormGroup>
                        <FormControlLabel
                            sx={{ ml: 0 }}
                            label={<span style={{ fontSize: '14px' }}>Resurrection Data</span>}
                            labelPlacement='start'
                            control={
                                <Switch checked={resurrectionToggle} onChange={() => props.setResurrectionToggle(!resurrectionToggle)} />
                            } />
                    </FormGroup>
                    <ToolTip title={TOOLTIPS.RESURRECTION} content={
                        <InfoIcon sx={{ ml: '5px', mt: '7px', color: 'lightgrey' }} />
                    }/>
                </Box>
            }
        </Box>
    );
}