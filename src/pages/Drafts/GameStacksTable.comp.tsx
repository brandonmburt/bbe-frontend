import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { TeamBadge } from '../../components/badges/TeamBadge.comp';
import { DOMES } from '../../constants/domes.constants';
import StadiumIcon from '@mui/icons-material/Stadium';
import { TOOLTIPS } from '../../constants/tooltips.constants';
import { ToolTip } from '../../components/ToolTip.comp';

export function GameStacksTable(props) {

    if (!props.playoffStacks) return (<></>);

    const { playoffStacks } = props;

    return (
        <TableContainer sx={{ textAlign: 'center' }}>
            <Table size='small'>
                <TableHead>
                    <TableRow sx={{ textAlign: 'center' }}>
                        <TableCell></TableCell>
                        <TableCell>Away</TableCell>
                        <TableCell>Home</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ textAlign: 'center' }}>

                    {playoffStacks && [15, 16, 17].map((week, index) => {
                        return (
                            <React.Fragment key={week+index}>
                                <TableRow sx={{ bgcolor: '#FAF9F6' }}>
                                    <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'left' }}>Week {week}</TableCell>
                                </TableRow>
                                {playoffStacks.has(week) && playoffStacks.get(week).length > 0 && playoffStacks.get(week).map(({ home, away }, i) => {
                                    return (
                                        <TableRow key={i}>
                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                <TeamBadge mr={0} team={away[0].team} />
                                                <span style={{ fontSize: '12px' }}> @ </span>
                                                <TeamBadge mr={0} team={home[0].team} />
                                                {DOMES[home[0].team] &&
                                                    <ToolTip title={TOOLTIPS.DOME_GAME} content={
                                                        <StadiumIcon sx={{ height: '20px', color: 'grey', verticalAlign: 'top' }}/>
                                                    } />
                                                }
                                            </TableCell>
                                            <TableCell>{away.map(p => p.name).join(', ')}</TableCell>
                                            <TableCell>{home.map(p => p.name).join(', ')}</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </React.Fragment>
                        )
                    })}

                </TableBody>
            </Table>
        </TableContainer>
    );
}