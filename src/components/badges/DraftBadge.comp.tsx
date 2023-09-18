import Chip from '@mui/material/Chip';
import { DRAFT_COLORS } from '../../constants/colors.constants';
import SportsFootballIcon from '@mui/icons-material/SportsFootball';

export function DraftBadge(props) {

    let badges: string[] = ['NFL', 'BB'];
    if (props.type === 'Tournament') badges.push('T', 'G');
    else if (props.type === 'Weekly Winner') badges.push('WW', 'G');

    return (
        <>
            {props.type && badges.map(badge => {
                return (
                    <Chip
                        key = {badge}
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
                            badge !== 'NFL' ? badge :
                            <SportsFootballIcon sx={{ height: '13px', width: '13px', marginTop: '3px' }} />
                        } />
                );
            })}
        </>
    );
}