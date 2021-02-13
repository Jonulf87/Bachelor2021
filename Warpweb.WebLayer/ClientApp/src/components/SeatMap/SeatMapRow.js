import React from 'react';

export default function SeatMapRow({seats, deleteRow}) {
    return (
        <div className="seatRow border border-primary w-25 p-3">
            <p>Dette er en rad med {seats} seter</p>
            <button id="deleteDiv" onClick={() => deleteRow()}>Slett</button>
        </div>
    );
}

