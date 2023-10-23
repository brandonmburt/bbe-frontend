import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { Box, Container, CssBaseline, TextField, Button, Typography, TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import useLoginRedirect from '../../../hooks/useLoginRedirect';
import { selectLoggedIn, selectUserIsAdmin, addReplacementRule, selectReplacementRules, deleteReplacementRule } from '../../../redux/slices/user.slice';
import { ReplacementRule } from '../../../models/player.model';
import { convertTimestampToDate } from '../../../utils/date.utils';
import ClearIcon from '@mui/icons-material/Clear';

export function ReplacementRules() {
    useLoginRedirect();

    const dispatch = useAppDispatch();

    const isLoggedIn: boolean = useAppSelector(selectLoggedIn);
    const isAdmin: boolean = useAppSelector(selectUserIsAdmin);
    const replacementRules: ReplacementRule[] = useAppSelector(selectReplacementRules);

    const [firstNameMatch, setFirstNameMatch] = useState<string>(null);
    const [lastNameMatch, setLastNameMatch] = useState<string>(null);
    const [firstNameReplacement, setFirstNameReplacement] = useState<string>(null);
    const [lastNameReplacement, setLastNameReplacement] = useState<string>(null);

    const handleSubmit = () => {
        if (!disableSubmission()) {
            dispatch(addReplacementRule({
                fName: firstNameMatch,
                lName: lastNameMatch,
                fNameReplacement: firstNameReplacement,
                lNameReplacement: lastNameReplacement
            }));
            resetForm();
        } else {
            console.log('Error: unable to submit form');
        }
    };

    const resetForm = () => {
        setFirstNameMatch(null);
        setLastNameMatch(null);
        setFirstNameReplacement(null);
        setLastNameReplacement(null);
    }

    const disableSubmission = () => {
        return [firstNameMatch, lastNameMatch, firstNameReplacement, lastNameReplacement].some(v => {
            return v === null || v === '' || v.length > 50;
        });
    }

    const handleDelete = (id: string) => {
        dispatch(deleteReplacementRule({id}));
    }

    if (!isLoggedIn || !isAdmin) return null;
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography component="h1" variant="h5">
                    Replacement Rules
                </Typography>
                <Box sx={{ my: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                    
                    <Box sx={{ mt: 1, width: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <TextField sx={{ width: .48 }} id="first_name_match" label="First Name Match" variant="outlined" required onChange={(e) => setFirstNameMatch(e.target.value)} />
                            <TextField sx={{ width: .48 }} id="last_name_match" label="Last Name Match" variant="outlined" required onChange={(e) => setLastNameMatch(e.target.value)} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 2 }}>
                            <TextField sx={{ width: .48 }} id="first_name_replacement" label="First Name Replacement" variant="outlined" required onChange={(e) => setFirstNameReplacement(e.target.value)} />
                            <TextField sx={{ width: .48 }} id="last_name_replacement" label="Last Name Replacement" variant="outlined" required onChange={(e) => setLastNameReplacement(e.target.value)} />
                        </Box>
                    </Box>

                    <Box sx={{ width: 1 }}>
                        <Button
                            sx={{ width: 1 }}
                            variant='contained'
                            disabled={[firstNameMatch, lastNameMatch, firstNameReplacement, lastNameReplacement].some(v => {
                                return v === null || v === '' || v.length > 50;
                            })}
                            onClick={handleSubmit} >
                            {'Submit'}
                        </Button>
                    </Box>

                    {replacementRules && replacementRules.length > 0 &&
                        <Box sx={{ width: 1, mt: 5 }}>
                            <Table>
                                <TableHead sx={{whiteSpace: 'nowrap'}}>
                                    <TableRow>
                                        <TableCell size='small' colSpan={2} align='center'>Match Values</TableCell>
                                        <TableCell size='small' colSpan={2} align='center'>Replacement Values</TableCell>
                                        <TableCell size='small' colSpan={2}></TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell align='center'>First</TableCell>
                                        <TableCell align="center">Last</TableCell>
                                        <TableCell align='center'>First</TableCell>
                                        <TableCell align='center'>Last</TableCell>
                                        <TableCell align='center' sx={{  }}>Created On</TableCell>
                                        <TableCell align='center'>Delete</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ whiteSpace: 'nowrap' }}>
                                    {replacementRules.map((rule: ReplacementRule, index) => (
                                        <TableRow key={index}>
                                            <TableCell align='right'>{rule.firstNameMatch}</TableCell>
                                            <TableCell align="left">{rule.lastNameMatch}</TableCell>
                                            <TableCell align='right'>{rule.firstNameReplacement}</TableCell>
                                            <TableCell align='left'>{rule.lastNameReplacement}</TableCell>
                                            <TableCell align='center'>{convertTimestampToDate(rule.createdAt)}</TableCell>
                                            <TableCell align='center'>
                                                <Button sx={{ color: 'red', minWidth: '20px' }} onClick={() => handleDelete(rule.id)} disabled={false}>
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