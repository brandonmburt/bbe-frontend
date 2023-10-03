import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatAsMoney } from '../../utils/format.utils';
import { TeamBadge } from '../badges/TeamBadge.comp';
import { PlayerBadge } from '../badges/PlayerBadge.comp';

export function SelectedPlayerTable(props) {

    const tableCols: string[] = [
        'Team',
        'Position Rank',
        'Times Drafted',
        'Entry Fees',
        'Avg Pick',
        'Current ADP',
        'CLV'
    ];

    const tableData = [
        <TeamBadge inGrid={true} team={props.team} />,
        <PlayerBadge pos={props.pos} posRank={props.posRank} />,
        props.timesDrafted,
        formatAsMoney(props.sumEntryFees),
        props.playerAvg,
        props.playerAdp,
        (props.playerAvg - props.playerAdp).toFixed(1)
    ];

    const tableWidth = (100/tableCols.length).toString() + '%';
    
    return (
        <TableContainer sx={{ pt: 2, pb: 3 }}>
            <Table>
                <TableHead>
                    <TableRow>
                        {tableCols.map((col, i) => {
                            return (
                                <TableCell key={'header'+i} style={{ width: tableWidth }} align="center">{col}</TableCell>
                            )
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        {tableData.map((data, i) => {
                            return (
                                <TableCell key={'data'+i} style={{ borderBottom: 'none' }} align="center">{data}</TableCell>
                            )
                        })}
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
}