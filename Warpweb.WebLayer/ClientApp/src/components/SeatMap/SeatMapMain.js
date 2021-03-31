import React, { useState } from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';

export default function SeatMapMain() {

    const [rows, setRows] = useState([]);

    const updateRowPosition = (name, xPos, yPos) => {
        const row = rows.find(r => r.rowName === name);
        row.xPos = xPos;
        row.yPos = yPos;
        setRows(oldValue => [...oldValue.filter(r => r.rowName !== name), row])
    }


    const addRow = (row) => {
        setRows(oldValue => [...oldValue, row])
    }

    return (
        <>
            <SeatMapFloor rows={rows} updateRowPosition={updateRowPosition} />
            <SeatMapAdminMenu addRow={addRow} />
        </>

    );
}
