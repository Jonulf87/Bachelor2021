import React from 'react';
import SeatMapSeat from './SeatMapSeat';

export default function SeatMapRow({ id, rowName, xPos, yPos, isVertical, seats, ticketTypeIds }) {

    console.log(seats);

    return (
        <div
            style={{
                position: "absolute",
                top: `${yPos}px`,
                left: `${xPos}px`,
                border: '1px solid #333',
                height: '20px'
            }}
        >
            {seats && seats.sort((a, b) => (a.seatNumber > b.seatNumber) ? 1 : (a.seatNumber < b.seatNumber) ? -1 : 0).map(seat => (
                <SeatMapSeat key={seat.id} {...seat} />
                ))}
        </div>
            )
}