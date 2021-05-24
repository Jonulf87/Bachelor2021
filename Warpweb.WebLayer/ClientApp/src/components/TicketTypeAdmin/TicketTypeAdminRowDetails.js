import { CircularProgress, TableCell, TableRow, Button, IconButton } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import DeleteIcon from '@material-ui/icons/Delete';
import EditTicketType from './EditTicketType';

export default function TicketTypeAdminRowDetails({ rowData, rowMeta, updateListTrigger, ticketTypes }) {
    const [ticketType, setTicketType] = useState(null);
    const ticketTypeId = rowData[0];
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const [dialogEditTicketTypeOpen, setDialogEditTicketTypeOpen] = useState(false);

    const handleDialogEditTicketTypeOpen = () => {
        setDialogEditTicketTypeOpen(true);
    };

    const handleDialogEditTicketTypeClose = () => {
        setDialogEditTicketTypeOpen(false);
    };

    const { isAuthenticated, token } = useAuth();

    const updateList = () => {
        setTriggerUpdate((oldvalue) => !oldvalue);
        updateListTrigger();
    };

    useEffect(() => {
        const getTicketType = async () => {
            if (isAuthenticated) {
                const responseTicketType = await fetch(`/api/tickettypes/type/${ticketTypeId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const resultTicketType = await responseTicketType.json();
                setTicketType(resultTicketType);
            }
        };
        getTicketType();
    }, [isAuthenticated, triggerUpdate]);

    const deleteTicketType = async (ticketType) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/tickettypes/deletetickettype`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'DELETE',
                body: JSON.stringify(ticketType),
            });
            updateList();
        }
    };

    if (ticketType === null)
        return (
            <TableRow>
                <TableCell colSpan={4}>
                    <CircularProgress />
                </TableCell>
            </TableRow>
        );

    return (
        <>
            <TableRow>
                <TableCell colSpan={1}>
                    <IconButton aria-label="delete" onClick={(e) => deleteTicketType(ticketType)}>
                        <DeleteIcon
                            style={{
                                cursor: 'pointer',
                                color: '#DD0000',
                                fontSize: '28px',
                            }}
                        />
                    </IconButton>
                </TableCell>
                <TableCell colSpan={2}>
                    <Button variant="contained" color="primary" size="large" onClick={handleDialogEditTicketTypeOpen}>
                        Endre billettype
                    </Button>
                </TableCell>
            </TableRow>
            <EditTicketType
                ticketTypeId={ticketTypeId}
                dialogEditTicketTypeOpen={dialogEditTicketTypeOpen}
                handleDialogEditTicketTypeClose={handleDialogEditTicketTypeClose}
                updateListTrigger={updateListTrigger}
                ticketTypes={ticketTypes}
            />
        </>
    );
}
