import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { Box, Container, CssBaseline, TextField, Button, Typography, TableBody, Table, TableCell, TableHead, TableRow, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import useLoginRedirect from '../../../hooks/useLoginRedirect';
import useAdminRedirect from '../../../hooks/useAdminRedirect';
import { addRookieDefinition, deleteRookieDefinition, selectRookieDefinitions } from '../../../redux/slices/admin.slice';
import { RookieDefinition } from '../../../models/player.model';
import { convertTimestampToDate } from '../../../utils/date.utils';
import ClearIcon from '@mui/icons-material/Clear';
import { TEAMS } from '../../../constants/teams.constants';
import { TeamBadge } from '../../../components/badges/TeamBadge.comp';
import { PlayerBadge } from '../../../components/badges/PlayerBadge.comp';

export function Rookies() {
    useLoginRedirect();
    useAdminRedirect();

    const dispatch = useAppDispatch();

    const rookies: RookieDefinition[] = useAppSelector(selectRookieDefinitions);

    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [team, setTeam] = useState<string>('');
    const [position, setPosition] = useState<string>('');
    const [season, setSeason] = useState<number>(2023);

    const teamArr: string[][] = [];
    for (let key in TEAMS) teamArr.push([key, TEAMS[key]]);

    const positions: string[] = ['QB', 'RB', 'WR', 'TE'];
    const seasons: number[] = [2023, 2024];

    const handleSubmit = () => {
        if (!disableSubmission()) {
            dispatch(addRookieDefinition({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                team: team.trim(),
                position: position.trim(),
                season,
            }));
            resetForm();
        } else {
            console.log('Error: unable to submit form');
        }
    };

    const resetForm = () => {
        setFirstName('');
        setLastName('');
        setTeam('');
        setPosition('');
        setSeason(2023);
    }

    const disableSubmission = () => {
        if (!seasons.includes(season)) return true;
        return [firstName, lastName, team, position].some(val => {
            return val === null || val === '' || val.length > 50;
        });
    }

    const handleDelete = (id: string) => {
        dispatch(deleteRookieDefinition({id}));
    }

    const tableHeaders: string[] = ['First Name', 'Last Name', 'Team', 'Position', 'Season', 'Created On', 'Delete'];

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography component="h1" variant="h5">
                    Rookie Definitions
                </Typography>
                <Box sx={{ my: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    
                    <Box sx={{ mt: 1, width: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField sx={{ width: .48 }} id="first_name" label="First Name" value={firstName} variant="outlined" required onChange={(e) => setFirstName(e.target.value)} />
                            <TextField sx={{ width: .48 }} id="last_name" label="Last Name" value={lastName} variant="outlined" required onChange={(e) => setLastName(e.target.value)} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                            <FormControl sx={{ width: .48 }} variant="outlined" required>
                                <InputLabel>Team</InputLabel>
                                <Select
                                    id="team"
                                    label="Team"
                                    variant="outlined"
                                    required
                                    value={team}
                                    onChange={(e) => setTeam(e.target.value)}
                                >
                                    {teamArr.map(([abbreviation, label], i) => <MenuItem key={i} value={abbreviation}>{label}</MenuItem> )}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ width: .48 }} variant="outlined" required>
                                <InputLabel>Position</InputLabel>
                                <Select
                                    id="position"
                                    label="Position"
                                    variant="outlined"
                                    required
                                    value={position}
                                    onChange={(e) => setPosition(e.target.value)}
                                >
                                    {positions.map((pos, i) => <MenuItem key={i} value={pos}>{pos}</MenuItem> )}
                                </Select>
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                            <FormControl sx={{ width: .48 }} variant="outlined" required>
                                <InputLabel>Season</InputLabel>
                                <Select
                                    id="season"
                                    label="Season"
                                    variant="outlined"
                                    required
                                    value={season}
                                    onChange={(e) => setSeason(+e.target.value)}
                                >
                                    {seasons.map((season, i) => <MenuItem key={i} value={season}>{season}</MenuItem> )}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>

                    <Box sx={{ width: 1 }}>
                        <Button
                            sx={{ width: 1 }}
                            variant='contained'
                            disabled={disableSubmission()}
                            onClick={handleSubmit} >
                            {'Submit'}
                        </Button>
                    </Box>

                    {rookies && rookies.length > 0 &&
                        <Box sx={{ width: 1, mt: 5 }}>
                            <Table size='small'>
                                <TableHead sx={{whiteSpace: 'nowrap'}}>
                                    <TableRow>
                                        {tableHeaders.map((header, i) => <TableCell key={i} align='center'>{header}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ whiteSpace: 'nowrap' }}>
                                    {rookies.map((rookie: RookieDefinition, i) => (
                                        <TableRow key={i}>
                                            <TableCell align='center'>{rookie.firstName}</TableCell>
                                            <TableCell align="center">{rookie.lastName}</TableCell>
                                            <TableCell align='center'><TeamBadge inGrid team={rookie.team}/></TableCell>
                                            <TableCell align='center'><PlayerBadge pos={rookie.position} /></TableCell>
                                            <TableCell align='center'>{rookie.season}</TableCell>
                                            <TableCell align='center'>{convertTimestampToDate(rookie.createdAt)}</TableCell>
                                            <TableCell align='center'>
                                                <Button sx={{ color: 'red', minWidth: '20px' }} onClick={() => handleDelete(rookie.id)} disabled={false}>
                                                    <ClearIcon />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    }
                </Box>
            </Box>
        </Container>
    );
}