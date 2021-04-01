import React, { useEffect, useState } from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';

export default function SeatMapMain() {

    const [rows, setRows] = useState([]);
    const { isAuthenticated, token } = useAuth();

    const updateRowPosition = (name, xPos, yPos) => {
        const row = rows.find(r => r.rowName === name);
        row.xPos = xPos;
        row.yPos = yPos;
        setRows(oldValue => [...oldValue.filter(r => r.rowName !== name), row])
    }


    const addRow = (row) => {
        setRows(oldValue => [...oldValue, row])
    }


    const submitRows = async () => {
        if (isAuthenticated) {
            const response = await fetch('/api/seatmap/storeseatmap', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(rows)
            });
            const result = response.json();
            console.log(result);
        }
    }


    return (
        <>
            <SeatMapFloor rows={rows} updateRowPosition={updateRowPosition} />
            <SeatMapAdminMenu addRow={addRow} submit={submitRows} />
        </>

    );
}
