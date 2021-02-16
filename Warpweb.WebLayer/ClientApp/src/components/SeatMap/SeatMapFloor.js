import React from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapFloor({ rows, deleteRow }) {

    function getRows() {
        return rows.map((row, index) => <SeatMapRow seats={row} deleteRow={() => deleteRow(index) } />);
    };

    if (rows.length <= 0) {
        return <p>There is no spoon</p>
    }
    
    return (
        <div style={{
            width: "100%",
            height: "500px",
            position: "relative"
        }}>
            {getRows()}
        </div>

    );
}


