import React from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapFloor({ rows, updateRowPosition }) {


    return (
        <div style={{
            width: "600px",
            height: "600px",
            position: "relative",
            backgroundColor: "#ccc",
            boxSizing: "border-box"
        }}>
            {rows.map(row => (<SeatMapRow key={row.rowName} {...row} updateRowPosition={updateRowPosition} />))}
        </div>
    );
}





