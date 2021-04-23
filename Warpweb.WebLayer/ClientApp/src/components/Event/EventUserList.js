import React, { useState, useEffect } from 'react';
import { CircularProgress, Button, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { format, parseISO } from 'date-fns';
import EventUserListRow from './EventUserListRow';
import usePurchase from '../../hooks/usePurchase';


export default function EventUserList() {

    const [eventsList, setEventsList] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState();

    const { selectedMainEventId, setSelectedMainEventId } = usePurchase();

    useEffect(() => {
        const getEvents = async () => {

            const response = await fetch('/api/events/eventslist');
            const result = await response.json();
            setEventsList(result);
        }

        getEvents();

    }, []);



    useEffect(() => {
            setIsReady(false);
        const getEvent = async () => {
            if (selectedMainEventId !== 0 && selectedMainEventId !== null) {

                const eventResponse = await fetch(`/api/events/getmainevent/${selectedMainEventId}`, {
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                const eventResult = await eventResponse.json();
                setSelectedEvent(eventResult);
                console.log("selectedMainEventId: " + selectedMainEventId);
            }
            setIsReady(true);
            console.log(selectedMainEventId);
        }
        getEvent();
    }, [selectedMainEventId])

    const otherEvents = () => {
        setSelectedMainEventId(0);
    }


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
                        {selectedMainEventId > 0 ?
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
                                    <EventUserListRow {...event} key={event.id} />
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