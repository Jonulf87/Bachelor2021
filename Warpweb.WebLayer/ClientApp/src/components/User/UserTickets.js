import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    Button,
    Card,
    CardContent,
    CircularProgress,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@material-ui/core';
import useAuth from '../../hooks/useAuth';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import { Redirect, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(1),
            margin: 20,
            maxWidth: 650,
        },
    }),
);

export default function TicketList() {
    const [events, setEvents] = useState([]);
    const { isAuthenticated, token } = useAuth();
    const [isReady, setIsReady] = useState(false);
    const { setSelectedEvent } = useCurrentEvent();
    const history = useHistory();

    const classes = useStyles();

    const handleClick = (eventId) => {
        setSelectedEvent(eventId, () => history.push('/userseatmap'));
    };

    useEffect(() => {
        const getUserEvents = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/events/eventsparticipation', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const result = await response.json();
                    setEvents(result);
                    setIsReady(true);
                } else {
                    setEvents([]);
                }
            }
        };

        getUserEvents();
    }, [isAuthenticated]);

    return (
        <Card className={classes.root} variant="outlined">
            <CardContent>
                {isReady && (
                    <>
                        <TableContainer>
                            <Typography gutterBottom variant="h6" component="h2" gutterBottom>
                                Dine billetter:
                            </Typography>
                            <Table aria-label="Billett tabell">
                                <TableHead>
                                    <TableRow>
                                        <TableCell align="left">Navn</TableCell>
                                        <TableCell align="left">Start</TableCell>
                                        <TableCell align="left">Slutt</TableCell>
                                        <TableCell align="left">Sted</TableCell>
                                        <TableCell align="left">Detaljer</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {events.map((event) => (
                                        <TableRow key={event.name}>
                                            <TableCell align="left">{event.name}</TableCell>
                                            <TableCell align="left">{event.start}</TableCell>
                                            <TableCell align="left">{event.end}</TableCell>
                                            <TableCell align="left">{event.venue}</TableCell>
                                            <TableCell align="left">
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleClick(event.id)}
                                                >
                                                    Se billetter
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </>
                )}

                {!isReady && <CircularProgress />}
            </CardContent>
        </Card>
    );
}
