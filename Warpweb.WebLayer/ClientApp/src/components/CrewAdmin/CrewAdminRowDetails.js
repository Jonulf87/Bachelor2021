import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Typography, Button, IconButton } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import CrewPermissions from './CrewPermissions';
import DeleteIcon from '@material-ui/icons/Delete';
import PopupWindow from '../PopupWindow/PopupWindow';

export default function CrewAdminRowDetails({ rowData, rowMeta }) {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [crewLeaders, setCrewLeaders] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [dialogLeaderOpen, setDialogLeaderOpen] = useState(false);
    const [dialogMemberOpen, setDialogMemberOpen] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const openCrewId = rowData[0];

    const { isAuthenticated, token } = useAuth();

    const excludedLeaders = crewLeaders.map((leader) => leader.id);
    const excludedMembers = membersList.map((member) => member.id).concat(excludedLeaders);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const updateList = () => {
        setTriggerUpdate((oldvalue) => !oldvalue);
    };

    const removeMember = async (userId) => {
        if (isAuthenticated) {
            const dataToBeSent = {
                userId: userId,
                crewId: openCrewId,
            };
            const response = await fetch(`/api/crews/removecrewmember`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(dataToBeSent),
            });
            if (response.ok) {
                updateList();
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    useEffect(() => {
        const getCrewLeadersAndMembers = async () => {
            if (isAuthenticated) {
                const responseCrew = await fetch(`/api/crews/crewmembers/${openCrewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (responseCrew.ok) {
                    const resultCrew = await responseCrew.json();
                    setMembersList(resultCrew);
                } else {
                    const errorResult = await responseCrew.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }

                const responseLeader = await fetch(`/api/crews/crewleaders/${openCrewId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (responseLeader.ok) {
                    const resultLeader = await responseLeader.json();
                    setCrewLeaders(resultLeader);
                } else {
                    const errorResult = await responseLeader.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };
        getCrewLeadersAndMembers();
    }, [isAuthenticated, triggerUpdate]);

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
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(userId),
            });
            if (response.ok) {
                updateList();
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    const addCrewMember = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/crews/addcrewmember/${openCrewId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(userId),
            });
            if (response.ok) {
                updateList();
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />
            <>
                <TableRow>
                    <TableCell colSpan={2} style={{ backgroundColor: '#becadb' }}></TableCell>
                    <TableCell colSpan={2} style={{ backgroundColor: '#becadb' }}>
                        <Typography variant="h6">Arbeidslagsleder</Typography>
                    </TableCell>
                    <TableCell colSpan={1} style={{ backgroundColor: '#becadb' }}>
                        <Button variant="contained" color="primary" onClick={handleDialogLeaderOpen}>
                            Velg arbeidslagleder
                        </Button>
                        <UserPicker
                            dialogOpen={dialogLeaderOpen}
                            handleDialogClose={handleDialogLeaderClose}
                            setUserId={addCrewLeader}
                            excludedUsers={excludedLeaders}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={1}></TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Navn</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">E-post</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Telefon</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Kommentar</Typography>
                    </TableCell>
                </TableRow>

                {crewLeaders.map((leader) => (
                    <TableRow key={leader.id}>
                        <TableCell colSpan={1}>
                            <IconButton aria-label="Slett leder" size="medium" onClick={(e) => removeMember(leader.id)}>
                                <DeleteIcon
                                    style={{
                                        cursor: 'pointer',
                                        color: '#DD0000',
                                        fontSize: '28px',
                                    }}
                                />
                            </IconButton>
                        </TableCell>

                        <TableCell colSpan={1}>
                            <Typography>{leader.name}</Typography>
                        </TableCell>

                        <TableCell colSpan={1}>{leader.eMail}</TableCell>

                        <TableCell colSpan={1}>{leader.phone}</TableCell>

                        <TableCell colSpan={1}>{leader.comment}</TableCell>
                    </TableRow>
                ))}

                <TableRow>
                    <TableCell colSpan={2} style={{ backgroundColor: '#becadb' }}></TableCell>
                    <TableCell colSpan={2} style={{ backgroundColor: '#becadb' }}>
                        <Typography variant="h6">Arbeidslag</Typography>
                    </TableCell>
                    <TableCell colSpan={1} style={{ backgroundColor: '#becadb' }}>
                        <Button variant="contained" color="primary" onClick={handleDialogMemberOpen}>
                            Legg til medlem
                        </Button>
                        <UserPicker
                            dialogOpen={dialogMemberOpen}
                            handleDialogClose={handleDialogMemberClose}
                            setUserId={addCrewMember}
                            excludedUsers={excludedMembers}
                        />
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell colSpan={1}></TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Navn</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">E-post</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Telefon</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography variant="subtitle1">Kommentar</Typography>
                    </TableCell>
                </TableRow>

                {membersList.map((member) => (
                    <TableRow key={member.id}>
                        <TableCell colSpan={1}>
                            <IconButton aria-label="Slett medlem" size="medium" onClick={(e) => removeMember(member.id)}>
                                <DeleteIcon
                                    style={{
                                        cursor: 'pointer',
                                        color: '#DD0000',
                                        fontSize: '28px',
                                    }}
                                />
                            </IconButton>
                        </TableCell>

                        <TableCell colSpan={1}>
                            <Typography>{member.name} </Typography>
                        </TableCell>

                        <TableCell colSpan={1}>{member.eMail}</TableCell>

                        <TableCell colSpan={1}>{member.phone}</TableCell>

                        <TableCell colSpan={1}>{member.comment}</TableCell>
                    </TableRow>
                ))}

                <TableRow>
                    <TableCell colSpan={1} style={{ backgroundColor: '#becadb' }}></TableCell>
                    <TableCell colSpan={4} style={{ backgroundColor: '#becadb' }}>
                        <Typography variant="h6">Rettigheter</Typography>
                    </TableCell>
                </TableRow>

                <TableRow>
                    <TableCell colSpan={1}></TableCell>

                    <TableCell colSpan={2}>
                        <CrewPermissions crewId={rowData[0]} />
                    </TableCell>

                    <TableCell colSpan={2}></TableCell>
                </TableRow>
            </>
        </>
    );
}
