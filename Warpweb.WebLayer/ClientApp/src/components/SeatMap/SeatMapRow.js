import React from 'react';

export default function SeatMapRow({ seats }) {
    return (
        <div className="seatRow">
            <p>Dette er en rad med { seats } seter</p>
        </div>

    );
}

