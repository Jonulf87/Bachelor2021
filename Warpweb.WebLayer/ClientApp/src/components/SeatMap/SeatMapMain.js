import React, { useEffect } from 'react';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';
import useSeatMap from '../../hooks/useSeatMap';
import SeatMapTicket from './SeatMapTicket';
import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import useCurrentEvent from '../../hooks/useCurrentEvent';

const useStyles = makeStyles(() => ({
    paper: {
        width: 'fit-content',
        padding: '20px',
        paddingBottom: '20px'
    }
}));

export default function SeatMapMain() {

    const classes = useStyles();

    const { isAuthenticated } = useAuth();
    const { getSeatMap, getUserTicketsForUpcomingEvents, userUpcomingTickets, rows } = useSeatMap();
    const { currentEvent } = useCurrentEvent();

    useEffect(() => {

        getUserTicketsForUpcomingEvents();
    }, [isAuthenticated])

    return (
        <Paper
            className={classes.paper}
            elevation={3}
        >
            <Grid
                container
            >
                <Grid
                    item
                    xl={6}
                    xs={12}
                >

                    <Typography variant="h5">{currentEvent} - Setekart</Typography>
                    <SeatMapFloor />

                </Grid>
                <Grid
                    item
                    xl={6}
                    xs={12}
                >

                    <Typography variant="h5">Mine billetter </Typography>
                    {userUpcomingTickets && userUpcomingTickets.map((ticket) => (
                        <SeatMapTicket {...ticket} key={ticket.id} />

                    ))}

                </Grid>
            </Grid>
        </Paper>
    )
}