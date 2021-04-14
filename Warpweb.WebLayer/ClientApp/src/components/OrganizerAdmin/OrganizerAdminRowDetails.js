﻿import React, { useEffect, useState } from 'react';
import { Button, IconButton, TableCell, TableRow, Typography } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import DeleteIcon from '@material-ui/icons/Delete';


export default function OrganizerAdminRowDetails({ rowData, rowMeta }) {

    const [orgAdmins, setOrgAdmins] = useState([]);
    const [orgContact, setOrgContact] = useState([]);
    const [dialogContactOpen, setDialogContactOpen] = useState(false);
    const [dialogAdminOpen, setDialogAdminOpen] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const openOrgId = rowData[0];

    const { isAuthenticated, token } = useAuth();

    const excludedContact = orgContact.map(contact => contact.id);
    const excludedAdmins = orgAdmins.map(admin => admin.id).concat(excludedContact);

    const updateList = () => {
        setTriggerUpdate(oldvalue => !oldvalue);
    }

    const handleDialogContactOpen = () => {
        setDialogContactOpen(true);
    };

    const handleDialogContactClose = () => {
        setDialogContactOpen(false);
    };

    const handleDialogAdminOpen = () => {
        setDialogAdminOpen(true);
    };

    const handleDialogAdminClose = () => {
        setDialogAdminOpen(false);
    };

    useEffect(() => {
        const getAdminsAndContactAtOrg = async () => {
            if (isAuthenticated) {
                const responseContact = await fetch(`/api/tenants/getadmins/${openOrgId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultContact = await responseContact.json();
                setOrgAdmins(resultContact);

                const responseAdmin = await fetch(`/api/tenants/getcontact/${openOrgId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultAdmin = await responseAdmin.json();
                setOrgContact(resultAdmin);
            }
        }
        getAdminsAndContactAtOrg();

    }, [isAuthenticated, triggerUpdate]);

    const addOrgContact = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/tenants/setorgcontact/${openOrgId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            updateList();
        }
    }

    const addOrgAdmin = async (userId) => {
        if (isAuthenticated) {
            await fetch(`/api/tenants/setadmin/${openOrgId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            updateList();
        }
    }

    const removeAdmin = async (userId) => {
        if (isAuthenticated) {
            await fetch(`/api/tenants/removeadmin/${openOrgId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            updateList();
        }
    }

    return (
        <>
            <TableRow>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                </TableCell>
                <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                    <Typography variant="h4" >
                        Kontaktperson
                            </Typography>
                </TableCell>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                    <Button
                        variant="contained"
                        size="large"
                        color="primary"
                        onClick={handleDialogContactOpen}
                    >
                        Velg kontakt
                    </Button>
                    <UserPicker dialogOpen={dialogContactOpen} handleDialogClose={handleDialogContactClose} setUserId={addOrgContact} excludedUsers={excludedContact} />
                </TableCell>
            </TableRow>
            {orgContact.map((contact) => (
                <>
                    <TableRow key={contact.contactName}>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell>
                            <Typography>Navn: </Typography>
                        </TableCell>
                        <TableCell colSpan={2}>
                            {contact.contactName}
                        </TableCell>
                    </TableRow>

                    <TableRow >
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell>
                            <Typography>E-post: </Typography>
                        </TableCell>
                        <TableCell colSpan={2}>
                            {contact.contactMail}
                        </TableCell>
                    </TableRow>

                    <TableRow>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell>
                            <Typography>Telefon: </Typography>
                        </TableCell>
                        <TableCell colSpan={2}>
                            {contact.contactPhone}
                        </TableCell>
                    </TableRow>
                </>
            ))}

            <TableRow>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                </TableCell>
                <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                    <Typography variant="h4" >Admins</Typography>
                </TableCell>
                <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={handleDialogAdminOpen}
                    >
                        Legg til admin
                    </Button>
                    <UserPicker dialogOpen={dialogAdminOpen} handleDialogClose={handleDialogAdminClose} setUserId={addOrgAdmin} excludedUsers={excludedAdmins} />
                </TableCell>
            </TableRow>

            {orgAdmins.map(admin => (
                <TableRow key={admin.name}>
                    <TableCell colSpan={1}>
                        <IconButton
                            onClick={(e) =>  removeAdmin(admin.id) }
                        >
                            <DeleteIcon
                                style={{
                                    cursor: "pointer",
                                    color: "#DD0000",
                                    fontSize: "28px"
                                }}
                            />
                        </IconButton>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography>{admin.name}</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography>{admin.eMail}</Typography>
                    </TableCell>
                    <TableCell colSpan={1}>
                        <Typography>{admin.phoneNumber}</Typography>
                    </TableCell>
                </TableRow>
            ))}
        </>
    )
};