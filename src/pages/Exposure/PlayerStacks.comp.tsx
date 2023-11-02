import { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Box, Typography, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { formatAsMoney } from '../../utils/format.utils';
import { TeamBadge } from '../../components/badges/TeamBadge.comp';
import { PlayerBadge } from '../../components/badges/PlayerBadge.comp';
import { PlayerStack } from '../../models/exposure.model';
import { DOMES } from '../../constants/domes.constants';
import StadiumIcon from '@mui/icons-material/Stadium';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../../components/ToolTip.comp';

const TOGGLE_INFO = [
    ['teammates', 'Teammates'],
    ['nonTeammates', 'Non-Teammates'],
    ['playoffs', 'Playoffs'],
];

const TABLE_COLS: string[] = [
    'Team',
    'Player',
    'Position',
    'Stacks',
    'Fees',
];

export function PlayerStacks(props) {

    const { stacks, playoffMatchupsMap, team } = props;
    const [toggleButton, setToggleButton] = useState<string>('teammates');

    const handleToggleButtonChange = (e, value) => (value && value !== toggleButton) ? setToggleButton(value) : null;

    const getFilteredStacks = (): PlayerStack[] => {
        if (!stacks) return [];
        switch (toggleButton) {
            case 'teammates':
                return stacks.filter(x => x.team === team);
            case 'nonTeammates':
                return stacks.filter(x => x.team !== team);
            case 'playoffs':
                return stacks.filter(x => x.playoffMatchupWeek);
            default:
                return [];
        }
    }

    const generateGameInfoCell = (stack: PlayerStack) => {
        return (<>
            <span style={{ fontSize: '12px', fontWeight: 'bold' }}>W{stack.playoffMatchupWeek} </span>
            <TeamBadge mr={0} team={playoffMatchupsMap.get(stack.team).away} />
            <span style={{ fontSize: '12px' }}> @ </span>
            <TeamBadge mr={0} team={playoffMatchupsMap.get(stack.team).home} />
            {DOMES[playoffMatchupsMap.get(stack.team).home] &&
                <ToolTip title={TOOLTIPS.DOME_GAME} content={
                    <StadiumIcon sx={{ height: '20px', color: 'grey', verticalAlign: 'top' }}/>
                }/>
            }
        </>);
    }
    
    if (!playoffMatchupsMap || !stacks || !team) return (<></>);
    return (
        <Box sx={{ mt: 5, width: 1 }}>
            <Grid container spacing={{ xs: 2, sm: 4 }}>

                <Grid xs={12} md={5} sx={{ py: 0 }} >
                    <Typography sx={{ fontSize: { xs: '20px', md: '24px' } }}>
                        Player Stacks
                    </Typography>
                </Grid>
                <Grid xs={12} md={7} sx={{ py: 0, textAlign: { xs: 'left', md: 'right' } }}>
                    <ToggleButtonGroup size='small' color="primary" exclusive value={toggleButton} onChange={handleToggleButtonChange}>
                        {TOGGLE_INFO.map(([value, label]) => <ToggleButton key={value} value={value} sx={{fontSize: '11px'}}>{label}</ToggleButton> )}
                    </ToggleButtonGroup>
                </Grid>
            
                <Grid xs={12}>
                    <TableContainer style={{ maxHeight: '300px', overflowY: 'auto' }}>
                        <Table size='small'>
                            <TableHead>
                                <TableRow style={{ top: 0, position: 'sticky', backgroundColor: '#FFFFFF' }}>
                                    {TABLE_COLS.map((col, i) => <TableCell key={'header'+i} align="center">{col}</TableCell> )}
                                    {toggleButton !== 'teammates' && <TableCell align="left">Playoff Matchup</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {stacks && getFilteredStacks().map((data, i) => {
                                    return (
                                        <TableRow key={'row'+i} >
                                            <TableCell align="center"><TeamBadge inGrid={true} team={data.team} /></TableCell>
                                            <TableCell align="center">{data.name}</TableCell>
                                            <TableCell align="center"><PlayerBadge pos={data.position} /></TableCell>
                                            <TableCell align="center">{data.timesDrafted}</TableCell>
                                            <TableCell align="center">{formatAsMoney(data.entryFees)}</TableCell>
                                            {toggleButton !== 'teammates' &&
                                                <TableCell sx={{ whiteSpace: 'nowrap' }} align="left">
                                                    {data.playoffMatchupWeek && generateGameInfoCell(data)}
                                                </TableCell>
                                            }
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>

            </Grid>
        </Box>
    );
}