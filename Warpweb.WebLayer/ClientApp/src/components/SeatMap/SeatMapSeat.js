import React from 'react';

export default function SeatMapSeat({ seatNumber, gridSize }) {

    return (
        <div className="seat" style={{
            float: "left", width: `${gridSize}px`, height: `${gridSize}px`
        }}>
        </div>
    );
}
