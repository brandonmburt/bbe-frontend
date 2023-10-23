import Chip from '@mui/material/Chip';
import { TEAM_COLORS } from '../../constants/colors.constants';
import { TEAMS } from '../../constants/teams.constants';
import Tooltip from '@mui/material/Tooltip';

export function TeamBadge(props) {

    const teamColors = !props.team || props.team === '' ? TEAM_COLORS['NA'] : TEAM_COLORS[props.team];

    const sxData = {
        fontSize: props.inGrid ? 'inherit' : '10px',
        backgroundColor: teamColors.primary,
        color: teamColors.text,
        textAlign: 'center',
        width: props.inGrid ? '55px' : '40px',
        height: props.inGrid ? '24px' : '20px',
        fontWeight: 'bold',
        boxShadow: `inset ${teamColors.secondary} 0px -2px`,
        mr: `${props.mr ?? '0'}`,
        borderRadius: '15px',
    };

    return (
        <>
            {teamColors && sxData &&
                <Tooltip arrow placement='top' title={TEAMS[props.team] ?? ''}>
                    <Chip
                        size='small'
                        sx={sxData}
                        label={!props.team || props.team === '' ? 'N/A' : props.team}
                    />
                </Tooltip>
            }
        </>
    );
}