import { Box, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from '@mui/material';
import { PlayerBadge } from '../../components/badges/PlayerBadge.comp';

export function UniquePlayers(props) {

    if (!props.snapshot) return (<></>);

    const posCounts = props.snapshot.uniquePlayers;

    const positions = ['QB', 'RB', 'WR', 'TE'];
    const counts = [posCounts.qbs, posCounts.rbs, posCounts.wrs, posCounts.tes];

    return (
        <>
            <Box sx={{ width: { xs: '250px', lg: 1} }}>
                <TableContainer>
                    <Table size='small'>
                        <TableBody>
                            <TableRow>
                                {counts.map((count, i) => {
                                    return <TableCell key={i} sx={{textAlign: 'center', border: 'none', p: 0, pb: 0 }}>{count}</TableCell>
                                })}
                            </TableRow>
                            <TableRow>
                                {positions.map((position, i) => {
                                        return <TableCell key={i} sx={{textAlign: 'center', border: 'none', p: 0, pt: 0}}><PlayerBadge pos={position} /></TableCell>
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                    <Typography variant='overline' sx={{ textAlign: 'center', mt: .5, mb: 1, lineHeight: 1, display: 'block' }}>Unique Players</Typography>
                </TableContainer>
            </Box>
        </>
    );
}