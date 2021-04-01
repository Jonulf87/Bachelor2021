import React, { useEffect, useState } from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';
import useAuth from '../../hooks/useAuth';
import { Grid } from '@material-ui/core';

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
            <Grid
                container
                spacing={2}

            >
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                    <SeatMapFloor rows={rows} updateRowPosition={updateRowPosition} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    lg={6}
                >
                    <SeatMapAdminMenu addRow={addRow} submit={submitRows} />
                </Grid>
            </Grid>
        </>

    );
}
