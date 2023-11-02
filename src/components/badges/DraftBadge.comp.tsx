import Chip from '@mui/material/Chip';
import { DRAFT_COLORS } from '../../constants/colors.constants';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';
import TimerIcon from '@mui/icons-material/Timer';
import BoltIcon from '@mui/icons-material/Bolt';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../ToolTip.comp';

export function DraftBadge(props) {

    let badges: string[] = ['NFL', 'BB'];
    if (props.type === 'Tournament') badges.push('T', 'G');
    else if (props.type === 'Weekly Winner') badges.push('WW', 'G');

    if (props.draftType && props.draftType.toLowerCase() === 'slow') badges.push('SLOW');
    else if (props.draftType && props.draftType.toLowerCase() === 'instant') badges.push('INSTANT');

    return (
        <>
            {props.type && badges.map(badge => {
                return (
                    <ToolTip key={badge} title={TOOLTIPS[badge+'_DRAFT'] ?? ''} content={
                        <Chip
                            size='small'
                            sx={{
                                backgroundColor: DRAFT_COLORS[badge],
                                color: 'white',
                                textAlign: 'center',
                                width: '18px',
                                height: '18px',
                                fontWeight: 'bold',
                                fontSize: '10px',
                                borderRadius: '50%',
                                marginRight: '3px',
                                '& .MuiChip-label': {
                                    padding: 0,
                                },
                            }}
                            label={
                                badge === 'NFL' ? <SportsFootballIcon sx={{ height: '13px', width: '13px', marginTop: '3px' }} /> :
                                badge === 'SLOW' ? <TimerIcon sx={{ height: '13px', width: '13px', marginTop: '3px' }} /> :
                                badge === 'INSTANT' ? <BoltIcon sx={{ height: '13px', width: '13px', marginTop: '3px' }} /> :
                                badge
                            } />
                    } />
                    
                );
            })}
        </>
    );
}