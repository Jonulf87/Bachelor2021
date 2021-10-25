import React, { useEffect } from 'react';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';
import useSeatMap from '../../hooks/useSeatMap';
import SeatMapTicket from './SeatMapTicket';
import { Box, Container, Grid, Paper, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useCurrentEvent from '../../hooks/useCurrentEvent';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles(() => ({
    paper: {
        width: 'fit-content',
        padding: '20px',
        paddingBottom: '20px',
    },
}));

export default function SeatMapMain() {
    const classes = useStyles();

    const { isAuthenticated } = useAuth();
    const {
        getSeatMap,
        getUserTicketsForUpcomingEvents,
        userUpcomingTickets,
        rows,
        errors,
        error,
        setError,
        setErrors,
        errorDialogOpen,
        handleErrorDialogClose,
    } = useSeatMap();
    const { currentEvent } = useCurrentEvent();

    useEffect(() => {
        getSeatMap();
        getUserTicketsForUpcomingEvents();
    }, [isAuthenticated]);

    return <>
        <PopupWindow
            open={errorDialogOpen}
            handleClose={handleErrorDialogClose}
            error={error}
            clearError={setError}
            errors={errors}
            clearErrors={setErrors}
        />
        <Paper className={classes.paper} elevation={3}>
            <Grid container justifyContent="center" direction="column" alignItems="center" spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h5">{currentEvent} - Setekart</Typography>
                </Grid>
                <Grid item xs={12}>
                    <SeatMapFloor />
                </Grid>
                <Grid item container xs={12} direction="row" justifyContent="flex-start" alignItems="center">
                    <Grid item xs={3} style={{ display: 'flex' }}>
                        <div style={{ backgroundColor: 'chartreuse', width: '20px', height: '20px' }}></div>
                        <span style={{ marginLeft: '5px' }}>Ledig</span>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex' }}>
                        <div style={{ backgroundColor: 'crimson', width: '20px', height: '20px' }}></div>
                        <span style={{ marginLeft: '5px' }}>Opptatt</span>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex' }}>
                        <div style={{ backgroundColor: 'dimgray', width: '20px', height: '20px' }}></div>
                        <span style={{ marginLeft: '5px' }}>Utilgjengelig</span>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex' }}>
                        <div style={{ backgroundColor: 'cornflowerblue', width: '20px', height: '20px' }}></div>
                        <span style={{ marginLeft: '5px' }}>Valgt</span>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="h5">Mine billetter </Typography>
                    {userUpcomingTickets && userUpcomingTickets.map((ticket) => <SeatMapTicket {...ticket} key={ticket.id} />)}
                </Grid>
            </Grid>
        </Paper>
    </>;
}
