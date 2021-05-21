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
import { format, parseISO } from 'date-fns';
import 'date-fns';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            padding: theme.spacing(1),
            //maxWidth: '650px',
            width: '100%',
        },
        table: {
            width: '100%',
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
                            <Table aria-label="Billett tabell" className={classes.table}>
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
                                    {events.map((event, i) => (
                                        <>
                                            <TableRow key={i}>
                                                <TableCell align="left">{event.name}</TableCell>
                                                <TableCell align="left">{format(parseISO(event.start), 'dd.MM.yyyy HH:mm')}</TableCell>
                                                <TableCell align="left">{format(parseISO(event.end), 'dd.MM.yyyy HH:mm')}</TableCell>
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
                                        </>
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
