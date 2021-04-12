import React, { useState, useEffect } from 'react';

import { Card, Divider, Typography, List, ListItem, ListItemText, ListSubheader, Toolbar, Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

function createData(id, fullName, phone, eMail, isLeader, comment){
    return {id, fullName, phone, eMail, isLeader, comment}
}

const rows = [
    createData(1, "Per Person", "12345678", "qwert@mail.com", false , ""),
    createData(1, "Jan Person", "12345678", "qwert@mail.com", true , ""),
    createData(1, "Per Person", "12345678", "hei@mail.com", false , "har bil"),
    createData(1, "Per Person", "12345678", "qwert@mail.com", false , "")
]

export default function CrewMmberList() {
    const [crewMembers, setCrewMembers] = useState(rows)
    
    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getCrewMembers = async () => {
            if (isAuthenticated) {
                const response = await fetch(`/api/crews/crewmember/${1}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });

                const result = await response.json();
                setCrewMembers(result);
            }
        }
        getCrewMembers();

    }, [isAuthenticated]);

    function CrewLeaderTable() {
        const leaders = crewMembers.filter(crewMembers => crewMembers.isLeader === true)

        return (
            <TableBody>
                    {leaders.map((crewLeader) => (
                        <TableRow>
                            <TableCell>
                                {crewLeader.fullName}
                            </TableCell>
                            <TableCell>
                                {crewLeader.phone}
                            </TableCell>
                            <TableCell>
                                {crewLeader.eMail}
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        )
    }

    function CrewMemberTable() {        
        const members = crewMembers.filter(crewMembers => crewMembers.isLeader === false)
        
        return (
            <TableBody>
                    {members.map((crewMember) => (
                        <TableRow>
                            <TableCell>
                                {crewMember.fullName}
                            </TableCell>
                            <TableCell>
                                {crewMember.phone}
                            </TableCell>
                            <TableCell>
                                {crewMember.eMail}
                            </TableCell>
                        </TableRow>
                    ))}
            </TableBody>
        )
    }

    return (
        <>
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
                                Tlf
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
                    Medlemmer
                </Typography>
            </Toolbar>
            <TableContainer>
                <Table>
                    <CrewMemberTable />
                </Table>
            </TableContainer>
        </>
    );
}