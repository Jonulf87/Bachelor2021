import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Typography, Toolbar, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Container} from '@material-ui/core';

export default function CrewMemberList({ crewMembers, crewLeaders }) {

    const { isAuthenticated, token } = useAuth();

    function CrewLeaderTable() {
        return (
            <TableBody>
                    {crewLeaders.map((leader) => (
                        <TableRow key={leader.id}>
                            <TableCell>
                                {leader.name}
                            </TableCell>
                            <TableCell>
                                {leader.phone}
                            </TableCell>
                            <TableCell>
                                {leader.eMail}
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        )
    }

    function CrewMemberTable() {        
        return (
            <TableBody>
                    {crewMembers.map((member) => (
                        <TableRow key={member.id}>
                            <TableCell>
                                {member.name}
                            </TableCell>
                            <TableCell>
                                {member.phone}
                            </TableCell>
                            <TableCell>
                                {member.eMail}
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        )
    }

    return (
        <>
            <Container>
                <Toolbar>
                <Typography variant="h6" component="h3" noWrap>
                    Ledere
                </Typography>
            </Toolbar>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    Navn
                                </TableCell>
                                <TableCell>
                                    Telefon
                                </TableCell>
                                <TableCell>
                                    e-post
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <CrewLeaderTable />
                    </Table>
                </TableContainer>
                <Toolbar>
                    <Typography variant="h6" component="h3" noWrap>
                        Lag
                    </Typography>
                </Toolbar>
                <TableContainer>
                    <Table>
                        <CrewMemberTable/>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
}