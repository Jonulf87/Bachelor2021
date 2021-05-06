import React, { useEffect } from 'react';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';
import useSeatMap from '../../hooks/useSeatMap';
import SeatMapTicket from './SeatMapTicket';
import usePurchase from '../../hooks/usePurchase';
import { Paper } from '@material-ui/core';

export default function SeatMapMain() {

    const { isAuthenticated } = useAuth();
    const { getSeatMap, getUserTicketsForUpcomingEvents, userUpcomingTickets } = useSeatMap();

    useEffect(() => {
        getSeatMap();
        getUserTicketsForUpcomingEvents();
    }, [isAuthenticated])

    return (
        <>
            <SeatMapFloor />
            <Paper>
                {userUpcomingTickets && userUpcomingTickets.map((ticket) => (
                    <SeatMapTicket {...ticket} />

                ))}
            </Paper>
        </>
    )
}