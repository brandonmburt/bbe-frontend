import Chip from '@mui/material/Chip';
import { POS_COLORS } from '../../constants/colors.constants';

export function PlayerBadge(props) {

    const { pos, posRank } = props;

    // extract the position from the posRank string (e.g. 'rb1' --> 'RB' or 'wr1' --> 'WR')
    const position = posRank ? posRank.substring(0, 2).toUpperCase() : pos.toUpperCase();

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