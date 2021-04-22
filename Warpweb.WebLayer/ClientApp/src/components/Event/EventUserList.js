import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Card, CardContent, Typography, Accordion, AccordionSummary, AccordionDetails,
    CircularProgress, Divider, Grid, Button, Table, TableHead, TableRow, TableCell, TableBody
} from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import EventUserListRow from './EventUserListRow';

const useStyles = makeStyles((theme) =>
    createStyles({

        accordionWrapper: {
            width: '100%',
            '&> :nth-child(even)': {
                '&> div:first-child': {
                    backgroundColor: 'lightgray'
                },

            },
            '&> :nth-child(odd)': {
                '&> div:first-child': {
                    backgroundColor: 'white'
                },
            },
        },
    }),
);

export default function EventUserList({ eventIdParam }) {

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState(eventIdParam);
    const [selectedEvent, setSelectedEvent] = useState("");

    const { setCurrentEvent, setCurrentEventChangeCompleteTrigger } = useCurrentEvent();

    const { isAuthenticated, token, refreshToken } = useAuth();


    useEffect(() => {
        const getEvents = async () => {

            const response = await fetch('/api/events/eventslist');
            const result = await response.json();
            setEventsList(result);
            console.log(result);
        }

        getEvents();

    }, []);

    const handleSelectedEvent = (eventId) => {
        setIsReady(false);
        setSelectedEventId(eventId);
    }

    useEffect(() => {
        const getEvent = async () => {
            setIsReady(false);
            if (selectedEventId !== 0) {

                const eventResponse = await fetch(`/api/events/getmainevent/${selectedEventId}`, {
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const eventResult = await eventResponse.json();
                setSelectedEvent(eventResult);
                console.log(selectedEventId);
            }
            setIsReady(true);
            console.log(selectedEventId);
        }
        getEvent();
    }, [selectedEventId])

    const otherEvents = () => {
        setSelectedEventId(0);
    }

    const classes = useStyles();

    return (
        <>
            {isReady ?
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                Hva
                        </TableCell>
                            <TableCell>
                                Hvor
                        </TableCell>
                            <TableCell>
                                Når
                        </TableCell>
                            <TableCell>
                                Hvem
                            </TableCell>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedEventId > 0 ?
                            (<TableRow>
                                <TableCell>
                                    {selectedEvent.name}
                                </TableCell>
                                <TableCell>
                                    {selectedEvent.venueName}
                                </TableCell>
                                <TableCell>
                                    {format(parseISO(selectedEvent.startDate), 'dd.MMM')} - {format(parseISO(selectedEvent.endDate), 'dd.MMM')}
                                </TableCell>
                                <TableCell>
                                    {selectedEvent.organizerName}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={otherEvents}
                                    >
                                        Andre arrangementer
                                    </Button>
                                </TableCell>

                            </TableRow>)
                            :
                            (<>
                                {eventsList.map((event) => (
                                    <EventUserListRow {...event} key={event.id} selectEvent={handleSelectedEvent} />
                                ))
                                }
                            </>)
                        }
                    </TableBody>

                </Table>
                : <CircularProgress />}
        </>
    );
}