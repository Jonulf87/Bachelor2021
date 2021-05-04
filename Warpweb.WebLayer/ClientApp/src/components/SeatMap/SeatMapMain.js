import React, { useEffect } from 'react';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';
import useSeatMap from '../../hooks/useSeatMap';
import SeatMapTicket from './SeatMapTicket';

export default function SeatMapMain() {

    const { isAuthenticated } = useAuth();
    const { getSeatMap } = useSeatMap();

    useEffect(() => {
        getSeatMap();
    }, [isAuthenticated])

    return (
        <>
            <SeatMapFloor />
            <SeatMapTicket />
        </>
    )
}