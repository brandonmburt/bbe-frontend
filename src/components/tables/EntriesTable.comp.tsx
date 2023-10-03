import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatAsMoney } from '../../utils/format.utils';
import { DraftBadge } from '../badges/DraftBadge.comp';

export function EntriesTable(props) {

    if (!props.entryBreakdown) return (<></>);

    const { sitAndGos, tournaments, weeklyWinners } = props.entryBreakdown;
    let arr = [
        ['Sit & Go', sitAndGos],
        ['Tournament', tournaments],
        ['Weekly Winner', weeklyWinners],
    ];

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow sx={{textAlign: 'center'}}>
                        <TableCell>Type</TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Fast Drafts</TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Slow Drafts</TableCell>
                        <TableCell sx={{textAlign: 'right'}}>Entry Fees</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {arr.map(([type, obj], i) => (
                        <TableRow key={i}>
                            <TableCell sx={{ whiteSpace: 'nowrap' }}>{type}s <DraftBadge type={type} /></TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{obj.fastDrafts}</TableCell>
                            <TableCell sx={{textAlign: 'center'}}>{obj.slowDrafts}</TableCell>
                            <TableCell sx={{textAlign: 'right'}}>{formatAsMoney(obj.fees)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}