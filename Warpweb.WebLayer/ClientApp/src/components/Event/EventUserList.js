import React, { useState, useEffect } from 'react';
import {
    CircularProgress,
    Button,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Divider,
    Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { format, parseISO } from 'date-fns';
import EventUserListRow from './EventUserListRow';
import usePurchase from '../../hooks/usePurchase';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({
    spanButton: {
        cursor: 'pointer',
        color: 'blue',
    },
}));

export default function EventUserList() {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();
    const classes = useStyles();

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    const { selectedMainEventId, setSelectedMainEventId, setShoppingCart } = usePurchase();

    useEffect(() => {
        const getEvents = async () => {
            const response = await fetch('/api/events/upcomingevents');

            if (response.ok) {
                const result = await response.json();
                setEventsList(result);
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        };

        getEvents();
    }, []);

    useEffect(() => {
        setIsReady(false);
        const getEvent = async () => {
            if (selectedMainEventId !== 0 && selectedMainEventId !== null) {
                const eventResponse = await fetch(`/api/events/getmainevent/${selectedMainEventId}`, {
                    headers: {
                        'content-type': 'application/json',
                    },
                });
                if (eventResponse.ok) {
                    const eventResult = await eventResponse.json();
                    setSelectedEvent(eventResult);
                } else if (eventResponse.status === 400) {
                    const errorResult = await eventResponse.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await eventResponse.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
            setIsReady(true);
        };
        getEvent();
    }, [selectedMainEventId]);

    const otherEvents = () => {
        setShoppingCart([]);
        setSelectedMainEventId(0);
        setSelectedEvent(null);
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
            {isReady ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Hva</TableCell>
                            <TableCell>Hvor</TableCell>
                            <TableCell>Når</TableCell>
                            <TableCell colSpan="2">Hvem</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedEvent ? (
                            <>
                                <TableRow>
                                    <TableCell>{selectedEvent.name}</TableCell>
                                    <TableCell>{selectedEvent.venueName}</TableCell>
                                    <TableCell>
                                        {format(parseISO(selectedEvent.startDateTime), 'dd.MMM')} -{' '}
                                        {format(parseISO(selectedEvent.endDateTime), 'dd.MMM')}
                                    </TableCell>
                                    <TableCell>{selectedEvent.organizerName}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={4}>
                                        <Typography variant="caption">
                                            Var det ikke dette arrangementet du tenkte å kjøpe billett til?{' '}
                                            <span>
                                                <Button variant="outlined" onClick={otherEvents}>
                                                    Trykk her
                                                </Button>
                                            </span>{' '}
                                            for å se andre kommende arrangementer
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </>
                        ) : (
                            <>
                                {eventsList
                                    .sort((a, b) => (a.startDateTime > b.startDateTime ? 1 : a.startDateTime < b.startDateTime ? -1 : 0))
                                    .map((event) => (
                                        <EventUserListRow {...event} key={event.id} />
                                    ))}
                            </>
                        )}
                    </TableBody>
                </Table>
            ) : (
                <CircularProgress />
            )}
        </>
    );
}
