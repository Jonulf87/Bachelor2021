import React from 'react';
import useSeatMap from '../../hooks/useSeatMap';

export default function SeatMapSeat({ seatNumber }) {

    const { gridSize } = useSeatMap();

    return (
        <div className="seat" style={{
            float: "left", width: `${gridSize}px`, height: `${gridSize}px`, fontSize: "9px", textAlign: "center"
        }}>
            {seatNumber}
        </div>
    );
}
