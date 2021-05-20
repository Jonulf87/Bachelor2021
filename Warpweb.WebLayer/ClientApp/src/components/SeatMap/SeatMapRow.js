import React from 'react';
import SeatMapSeat from './SeatMapSeat';

export default function SeatMapRow({ id, rowName, xPos, yPos, isVertical, seats, ticketTypeIds }) {
    return (
        <div
            style={{
                position: 'absolute',
                top: `${yPos}px`,
                left: `${xPos}px`,
                height: '20px',
                width: `${seats.count * 20}px`,
            }}
        >
            {seats &&
                seats
                    .sort((a, b) => (a.seatNumber > b.seatNumber ? 1 : a.seatNumber < b.seatNumber ? -1 : 0))
                    .map((seat) => <SeatMapSeat key={seat.id} {...seat} rowName={rowName} ticketTypeIds={ticketTypeIds} />)}
        </div>
    );
}
