import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Typography, Button } from '@mui/material';
import useAuth from '../../hooks/useAuth';
import { format, parseISO } from 'date-fns';
import EditEvent from './EditEvent';
import useCurrentEvent from '../../hooks/useCurrentEvent';

export default function EventAdminRowDetails({ rowData, rowMeta, updateListTrigger }) {
    const [event, setEvent] = useState(null);
    const openEventId = rowData[0];
    const [dialogEditEventOpen, setDialogEditEventOpen] = useState(false);
    const [triggerUpdate, setTriggerUpdate] = useState(false);

    const { isAuthenticated, token } = useAuth();
    const { setSelectedEvent } = useCurrentEvent();

    const handleDialogEditEventClose = () => {
        setDialogEditEventOpen(false);
    };

    const handleDialogEditEventOpen = () => {
        setDialogEditEventOpen(true);
    };

    const updateList = () => {
        setTriggerUpdate((oldvalue) => !oldvalue);
        updateListTrigger();
    };

    useEffect(() => {
        const getEvent = async () => {
            if (isAuthenticated) {
                const responseEvent = await fetch(`/api/events/getmainevent/${openEventId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const resultEvent = await responseEvent.json();
                setEvent(resultEvent);
            }
        };
        getEvent();
    }, [isAuthenticated, triggerUpdate]);

    if (event === null)
        return (
            <TableRow>
                <TableCell colSpan={4}>
                    <p>Lading...</p>
                </TableCell>
            </TableRow>
        );

    return (
        <>
            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Navn
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        {event.name}
                    </Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Start
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1">{format(parseISO(event.startDateTime), 'dd.MM.yyyy HH:mm')}</Typography>
                </TableCell>
            </TableRow>

            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Slutt
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1">{format(parseISO(event.endDateTime), 'dd.MM.yyyy HH:mm')}</Typography>
                </TableCell>
            </TableRow>
            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell
                    colSpan={1}
                    style={{
                        maxWidth: 'fit-content',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Lokale
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1">{event.venueName}</Typography>
                </TableCell>
            </TableRow>
            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell
                    colSpan={1}
                    style={{
                        maxWidth: 'fit-content',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Arrangør
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1">{event.organizerName}</Typography>
                </TableCell>
            </TableRow>
            <TableRow className="expandedRowDetail">
                <TableCell colSpan={1}></TableCell>
                <TableCell
                    colSpan={1}
                    style={{
                        maxWidth: 'fit-content',
                    }}
                >
                    <Typography
                        variant="subtitle1"
                        style={{
                            maxWidth: 'fit-content',
                        }}
                    >
                        Nettside
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1">{event.organizerWebPage}</Typography>
                </TableCell>
            </TableRow>
            <TableRow className="expandedRow">
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}>
                    <Button variant="contained" color="primary" size="large" onClick={handleDialogEditEventOpen}>
                        Endre arrangement
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        onClick={() => setSelectedEvent(openEventId)}
                        style={{
                            marginLeft: '10px',
                        }}
                    >
                        Sett som aktiv
                    </Button>
                </TableCell>
                <TableCell colSpan={1}></TableCell>
                <TableCell colSpan={1}></TableCell>
            </TableRow>
            <EditEvent
                eventId={openEventId}
                dialogEditEventOpen={dialogEditEventOpen}
                handleDialogEditEventClose={handleDialogEditEventClose}
                updateListTrigger={updateList}
            />
        </>
    );
}
