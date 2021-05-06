import React from 'react';
import useSeatMap from '../../hooks/useSeatMap';

export default function SeatMapSeat({ id, seatNumber, isReserved }) {

    const { reserveSeat } = useSeatMap();

    return (
        <div
            className={isReserved ? 'seatOccupied' : 'seatAvailable'}
            onClick={() => reserveSeat(id)}
        >
            {seatNumber}
        </div>
    )
}