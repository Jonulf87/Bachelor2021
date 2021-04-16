import React, { useState, useEffect } from 'react';
import { TableCell, TableRow, Typography, Button } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import { format, parseISO } from 'date-fns';


export default function CrewAdminRowDetails({ rowData, rowMeta }) {


    const [event, setEvent] = useState(null);
    const openEventId = rowData[0];

    const { isAuthenticated, token } = useAuth();





    useEffect(() => {
        const getEvent = async () => {
            if (isAuthenticated) {
                const responseEvent = await fetch(`/api/events/getmainevent/${openEventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultEvent = await responseEvent.json();
                setEvent(resultEvent);
            }
        }
        getEvent();
    }, [isAuthenticated])


    if (event === null) return (<TableRow><TableCell colSpan={4}><p>Lading...</p></TableCell></TableRow>);

    return (
        <>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Navn
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1" >
                        {event.name}
                    </Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Start
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1" >
                        {format(parseISO(event.startDate), 'dd.MM.yyyy')} {format(parseISO(event.startTime), 'HH:mm')}
                    </Typography>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell colSpan={1}>
                </TableCell>
                <TableCell colSpan={1}>
                    <Typography variant="subtitle1" >
                        Slutt
                    </Typography>
                </TableCell>
                <TableCell colSpan={2}>
                    <Typography variant="subtitle1" >
                        {format(parseISO(event.endDate), 'dd.MM.yyyy')} {format(parseISO(event.endTime), 'HH:mm')}
                    </Typography>
                </TableCell>
            </TableRow>

        </>
    )
}