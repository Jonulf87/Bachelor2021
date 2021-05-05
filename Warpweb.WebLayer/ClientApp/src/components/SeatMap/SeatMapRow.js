import React from 'react';

export default function SeatMapRow({ id, rowName, xPos, yPos, isVertical, seats, ticketTypeIds }) {

    return (
        <div
            style={{
                position: "absolute",
                top: `${yPos}px`,
                left: `${xPos}px`,
                border: '1px solid #333'
            }}
        >
            Howdy how!!!!
        </div>
            )
}