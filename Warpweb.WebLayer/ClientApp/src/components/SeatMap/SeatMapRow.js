import React from 'react';
import Draggable from 'react-draggable';

export default function SeatMapRow({seats, deleteRow}) {
    return (
        <Draggable bounds="parent" grid={[20, 20]}>
            <div className="seatRow border border-primary w-25 p-3"
                style={{
                    width: "200px",
                    height: "100px"
                }}>
            <p>Dette er en rad med {seats} seter</p>
            <button id="deleteDiv" onClick={() => deleteRow()}>Slett</button>
            </div>
            </Draggable>
    );
}

