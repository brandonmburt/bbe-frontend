import { Container, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { BYE_WEEKS } from '../constants/byes.constants';
import React from 'react';
import { TeamBadge } from './badges/TeamBadge.comp';

export default function ByeWeeks() {

    const byeMap: Map<number, { teams: string[] }> = new Map();
    
    for (let team in BYE_WEEKS) {
        const week = BYE_WEEKS[team];
        if (byeMap.has(week)) {
            byeMap.get(week).teams.push(team);
        } else {
            byeMap.set(week, { teams: [team] });
        }
    }

    const weeks: number[] = Array.from(byeMap.keys()).sort((a, b) => a - b);

    return (
        <Container component="main" maxWidth="xs">
            <TableContainer sx={{ textAlign: 'center' }}>
                <Table size='small'>
                    <TableBody sx={{ textAlign: 'center' }}>

                    {weeks.map((week, index) => {
                        return (
                            <React.Fragment key={week}>
                                <TableRow sx={{ bgcolor: '#FAF9F6' }}>
                                    <TableCell colSpan={3} sx={{ fontWeight: 'bold', textAlign: 'left' }}>Week {week}</TableCell>
                                </TableRow>
                                <TableRow key={index} sx={{ bgcolor: '#FFFFFF' }}>
                                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                        {byeMap.get(week).teams.map((team, i) => {
                                            return (
                                                <TeamBadge key={team+i} team={team}/>    
                                            )
                                        })}
                                    </TableCell>
                                </TableRow>
                            </React.Fragment>
                        )
                    })}

                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );

}