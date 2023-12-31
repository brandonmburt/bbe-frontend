import { Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { formatAsMoney } from '../../utils/format.utils';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalculateIcon from '@mui/icons-material/Calculate';

export function SummaryTable(props) {

    if (!props.totalDraftsEntered || !props.totalEntryFees) return (<></>);
    return (
        <>
        <TableContainer>
            <Table>
                <TableBody>
                    <TableRow>
                        <TableCell><TrendingUpIcon sx={{ fontSize: '40px', color: 'navy' }} /></TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Drafts</TableCell>
                        <TableCell sx={{textAlign: 'right'}}>{props.totalDraftsEntered}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><AttachMoneyIcon sx={{ fontSize: '40px', color: 'darkgreen' }} /></TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Entry Fees</TableCell>
                        <TableCell sx={{textAlign: 'right'}}>{formatAsMoney(props.totalEntryFees)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell><CalculateIcon sx={{ fontSize: '40px', color: 'firebrick' }} /></TableCell>
                        <TableCell sx={{textAlign: 'center'}}>Avg Entry Fee</TableCell>
                        <TableCell sx={{textAlign: 'right'}}>{formatAsMoney(props.totalEntryFees/props.totalDraftsEntered)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    </>
    );
}