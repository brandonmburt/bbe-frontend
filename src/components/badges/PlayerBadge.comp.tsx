import Chip from '@mui/material/Chip';
import { POS_COLORS } from '../../constants/colors.constants';

export function PlayerBadge(props) {

    const position = props.pos.toUpperCase();

    return (
        <>
            <Chip
                size='small'
                sx={{
                    backgroundColor: POS_COLORS[position],
                    color: 'white',
                    textAlign: 'center',
                    width: '55px',
                    fontWeight: 'bold',
                    borderRadius: '15px',
                }}
                label={props.posRank && props.posRank.length < 5 ? props.posRank : position}
            />
        </>
    );
}