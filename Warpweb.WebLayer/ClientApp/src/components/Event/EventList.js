import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import authService from '../api-authorization/AuthorizeService';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            marginBottom: 20,
        },
    }),
);

export default function EventList() {

    let [isReady, setIsReady] = useState(false);
    let [eventsList, setEventsList] = useState([]);

    useEffect(() => {
        const getEvents = async () => {

            const authenticationResult = await authService.isAuthenticated();

            if (authenticationResult) {
                const accessToken = await authService.getAccessToken();

                const response = await fetch('/api/events/EventsList', {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                const result = await response.json();
                setEventsList(result);

                setIsReady(true);
            }
        }

        getEvents();

    }, []);

    function getEventsFromList() {

        return (

            <TableContainer className={classes.root} component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Navn</TableCell>
                            <TableCell align="left">Starttid</TableCell>
                            <TableCell align="left">Slutttid</TableCell>
                            <TableCell align="left"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {eventsList.map((event) => (
                            <TableRow key={event.id}>
                                <TableCell align="left">{event.name}</TableCell>
                                <TableCell align="left">{event.startTime}</TableCell>
                                <TableCell align="left">{event.endTime}</TableCell>
                                <TableCell align="left">
                                    <Button variant="contained">Mer info</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        )
    };

    const classes = useStyles();

    return (
        <>
            {isReady && (<>
                <Typography>
                    <strong> Arrangementsoversikt</strong>
                </Typography>
                {getEventsFromList()}
            </>
            )}

            {!isReady && (<p>Laster arrangementsoversikt...</p>)}

        </>

    );
}