import { useAppSelector } from '../../../redux/hooks';
import { Box, Container, CssBaseline, Typography, TableBody, Table, TableCell, TableHead, TableRow } from '@mui/material';
import useLoginRedirect from '../../../hooks/useLoginRedirect';
import useAdminRedirect from '../../../hooks/useAdminRedirect';
import { selectUsers } from '../../../redux/slices/admin.slice';
import { RegisteredUser } from '../../../models/admin.model';
import { convertTimestampToDate } from '../../../utils/date.utils';

export function RegisteredUsers() {
    useLoginRedirect();
    useAdminRedirect();

    const users: RegisteredUser[] = useAppSelector(selectUsers);

    const tableHeaders: string[] = ['First Name', 'Last Name', 'Email', 'Created At', 'Last Login', 'Role'];

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box sx={{ my: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >
                <Typography component="h1" variant="h5">
                    Registered Users
                </Typography>
                <Box sx={{ my: 5, display: 'flex', flexDirection: 'column', alignItems: 'center' }} >

                    {users && users.length > 0 &&
                        <Box sx={{ width: 1, mt: 5 }}>
                            <Table>
                                <TableHead sx={{whiteSpace: 'nowrap'}}>
                                    <TableRow>
                                        {tableHeaders.map((header, i) => <TableCell key={i} align='center'>{header}</TableCell>)}
                                    </TableRow>
                                </TableHead>
                                <TableBody sx={{ whiteSpace: 'nowrap' }}>
                                    {users.map((user: RegisteredUser, i) => (
                                        <TableRow key={i}>
                                            <TableCell align='center'>{user.firstName}</TableCell>
                                            <TableCell align='center'>{user.lastName}</TableCell>
                                            <TableCell align='center'>{user.email}</TableCell>
                                            <TableCell align='center'>{convertTimestampToDate(user.createdAt)}</TableCell>
                                            <TableCell align='center'>{convertTimestampToDate(user.lastLogin)}</TableCell>
                                            <TableCell align='center'>{user.role}</TableCell>
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