import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { formatAsMoney } from '../../utils/format.utils';
import { TeamBadge } from '../badges/TeamBadge.comp';
import React from 'react';

export function RosterTable(props) {

    if (!props.selectedTeamData) return (<></>);

    const { selectedTeamData } = props;

    const tableCols: string[] = ['Draft Size', 'Entry Fee', 'Total CLV'];
    const tableData = [
        selectedTeamData?.draftSize,
        formatAsMoney(selectedTeamData?.entryFee),
        selectedTeamData?.totalCLV.toFixed(1),
    ];
    if (selectedTeamData?.entryType !== 'Sit & Go') {
        tableCols.push('Tournament Size', 'Tournament Prizes');
        tableData.push(selectedTeamData?.tournamentSize.toLocaleString());
        tableData.push(formatAsMoney(selectedTeamData?.tournamentPrizes));
    }

    const tableWidth = (100/tableCols.length).toString() + '%';

    return (
        <>
            <TableContainer sx={{ pt: 1, pb: 3 }}>
                <Table size='small' style={{fontSize: '10px'}}>
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
            <TableContainer>
                <Table size='small'>
                    <TableHead>
                        <TableRow sx={{textAlign: 'center'}}>
                            <TableCell></TableCell>
                            <TableCell>Pick</TableCell>
                            <TableCell>ADP</TableCell>
                            <TableCell>CLV</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {['QB', 'RB', 'WR', 'TE'].map((position, index) => {
                            return (
                                <React.Fragment key={position + index}>
                                    <TableRow sx={{ bgcolor: '#FAF9F6'}} >
                                        <TableCell colSpan={4} sx={{fontWeight: 'bold', textAlign: 'left'}}>{position}</TableCell>
                                    </TableRow>
                                    {selectedTeamData.selections.filter(({ pos }) => pos === position).map(({ pickNum, name, currAdp, clv, id, pos, team }, index) => {
                                        return (
                                            <TableRow key={position+index}>
                                                <TableCell><TeamBadge mr={'15px'} team={team}/>{name}</TableCell>
                                                <TableCell>{pickNum}</TableCell>
                                                <TableCell>{currAdp}</TableCell>
                                                <TableCell>{clv.toFixed(1)}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </React.Fragment>
                            )
                        })}

                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}