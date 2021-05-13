import React from 'react';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

export default function SeatMapAdminSeat({ seatNumber }) {
    const { gridSize } = useSeatMapAdmin();

    return (
        <div
            className="seat"
            style={{
                float: 'left',
                width: `${gridSize}px`,
                height: `${gridSize}px`,
                fontSize: '9px',
                textAlign: 'center',
            }}
        >
            {seatNumber}
        </div>
    );
}
