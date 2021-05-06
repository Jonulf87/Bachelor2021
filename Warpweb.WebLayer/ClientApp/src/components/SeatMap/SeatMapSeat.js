import React from 'react';

export default function SeatMapSeat({ id, seatNumber, isReserved }) {
    return (
        <div
            className={isReserved ? 'seatOccupied' : 'seatAvailable'}
        >
            {seatNumber}
        </div>
    )
}