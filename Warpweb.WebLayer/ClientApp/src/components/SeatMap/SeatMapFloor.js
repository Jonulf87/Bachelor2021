import React from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapFloor({ rows, deleteRow }) {

    function getRows() {
        return rows.map((row, index) => <SeatMapRow seats={row} deleteRow={() => deleteRow(index) } />);
    };

    if (rows.length <= 0) {
        return <p>No rows of seats created yet.</p>
    }
    
    return (
        <div style={{
            width: "100vh",
            height: "10vh",
            position: "relative"
        }}>
            {getRows()}
        </div>

    );
}


