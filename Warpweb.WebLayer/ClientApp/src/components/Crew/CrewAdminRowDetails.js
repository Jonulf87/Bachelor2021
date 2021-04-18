import React, { useState, useEffect } from 'react';
import {  TableCell, TableRow, Typography, Button } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import CrewPermissions from './CrewPermissions';

export default function CrewAdminRowDetails({ rowData, rowMeta }) {

    const [crewLeaders, setCrewLeaders] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [dialogLeaderOpen, setDialogLeaderOpen] = useState(false);
    const [dialogMemberOpen, setDialogMemberOpen] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const openCrewId = rowData[0];

    const { isAuthenticated, token } = useAuth();

    const excludedLeaders = crewLeaders.map(leader => leader.id);
    const excludedMembers = membersList.map(member => member.id).concat(excludedLeaders);

    const updateList = () => {
        setTriggerUpdate(oldvalue => !oldvalue);
    }

    useEffect(() => {
        const getCrewLeadersAndMembers = async () => {
            if (isAuthenticated) {
                const responseCrew = await fetch(`/api/crews/crewmembers/${openCrewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const resultCrew = await responseCrew.json();
                setMembersList(resultCrew);

                const responseLeader = await fetch(`/api/crews/crewleaders/${openCrewId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const resultLeader = await responseLeader.json();
                setCrewLeaders(resultLeader);
            }
        }
        getCrewLeadersAndMembers();
    }, [isAuthenticated, triggerUpdate])

    const handleDialogLeaderOpen = () => {
        setDialogLeaderOpen(true);
    };

    const handleDialogLeaderClose = () => {
        setDialogLeaderOpen(false);
    };

    const handleDialogMemberOpen = () => {
        setDialogMemberOpen(true);
    };

    const handleDialogMemberClose = () => {
        setDialogMemberOpen(false);
    };

    const addCrewLeader = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/crews/addcrewleader/${openCrewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            if (response.status !== 200) {
                return "Something went wrong"
            }
            updateList();
        }
    };

    const addCrewMember = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/crews/addcrewmember/${openCrewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            if (response.status !== 200) {
                return "Something went wrong"
            }
            updateList();
        }
    }

    return (
        <>
            <TableRow>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                </TableCell>
                <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                    <Typography variant="h6" >
                        Arbeidslagsleder
                            </Typography>
                </TableCell>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                    <Button variant="contained" color="primary" onClick={handleDialogLeaderOpen}>Velg arbeidslagleder</Button>
                    <UserPicker dialogOpen={dialogLeaderOpen} handleDialogClose={handleDialogLeaderClose} setUserId={addCrewLeader} excludedUsers={excludedLeaders} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Navn
                            </Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        E-post
                            </Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Telefon
                            </Typography>
                </TableCell>

            </TableRow>

            {crewLeaders.map((leader) => (
                <TableRow key={leader.id}>

                    <TableCell colSpan={1}>
                    </TableCell>

                    <TableCell colSpan={1}>
                        <Typography>{leader.name}</Typography>
                    </TableCell>

                    <TableCell colSpan={1}>
                        {leader.eMail}
                    </TableCell>

                    <TableCell colSpan={1}>
                        {leader.phone}
                    </TableCell>

                </TableRow>

            ))}

            <TableRow>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                </TableCell>
                <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                    <Typography variant="h6" >
                        Arbeidslag
                            </Typography>
                </TableCell>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                    <Button variant="contained" color="primary" onClick={handleDialogMemberOpen}>Legg til medlem</Button>
                    <UserPicker dialogOpen={dialogMemberOpen} handleDialogClose={handleDialogMemberClose} setUserId={addCrewMember} excludedUsers={excludedMembers} />
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Navn
                            </Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        E-post
                            </Typography>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Telefon
                            </Typography>
                </TableCell>

            </TableRow>

            {membersList.map((member) => (
                <TableRow key={member.id}>

                    <TableCell colSpan={1}>
                    </TableCell>

                    <TableCell colSpan={1}>
                        <Typography>{member.name} </Typography>
                    </TableCell>

                    <TableCell colSpan={1}>
                        {member.eMail}
                    </TableCell>

                    <TableCell colSpan={1}>
                        {member.phone}
                    </TableCell>

                </TableRow>
            ))}

            <TableRow>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                </TableCell>
                <TableCell colSpan={3} style={{ backgroundColor: "#becadb" }}>
                    <Typography variant="h6" >
                        Rettigheter
                            </Typography>

                </TableCell>
            </TableRow>

            <TableRow>

                <TableCell colSpan={1}>
                </TableCell>

                <TableCell colSpan={2}>
                    <CrewPermissions crewId={rowData[0]} />
                </TableCell>

                <TableCell colSpan={1}>

                </TableCell>

            </TableRow>
        </>
    )
}