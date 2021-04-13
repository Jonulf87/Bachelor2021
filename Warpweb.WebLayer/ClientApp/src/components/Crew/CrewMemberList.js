import React, { useState, useEffect } from 'react';

import { Card, Divider, Typography, List, ListItem, ListItemText, ListSubheader, Toolbar, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow, 
    Container} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

export default function CrewMemberList({ id }) {

    const [crewMembers, setCrewMembers] = useState([]);
    const [crewLeaders, setCrewLeaders] = useState([]);

    
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        console.log(id);
        const getCrewLeaderAndMembers = async () => {
            if (isAuthenticated) {
                const responseCrew = await fetch(`/api/crews/crewmembers/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const resultCrew = await responseCrew.json();
                setCrewMembers(resultCrew);

                const responseLeader = await fetch(`/api/crews/crewleaders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const resultLeader = await responseLeader.json();
                setCrewLeaders(resultLeader);
            }
        }
        getCrewLeaderAndMembers();

    }, [isAuthenticated]);

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