import { Avatar } from '@mui/material';
import { EXPERIENCE_COLORS } from '../../constants/colors.constants';

export function ExperienceAvatar(props) {

    const { experience } = props;

    return experience === null ? null : (
        <Avatar sx={{
            bgcolor: EXPERIENCE_COLORS[experience],
            height: 15,
            width: 15,
            ml: '5px',
            fontSize: 10,
            fontWeight: 'bold'
        }}>{experience}</Avatar>
    );
}