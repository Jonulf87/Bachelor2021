import React from 'react';

export default function SeatMapSeat({ seatNumber, gridSize, rowName }) {

    return (
        <div className="seat" style={{
            float: "left", width: `${gridSize}px`, height: `${gridSize}px`, fontSize: "9px", textAlign: "center"
        }}>
            {seatNumber}
        </div>
    );
}
