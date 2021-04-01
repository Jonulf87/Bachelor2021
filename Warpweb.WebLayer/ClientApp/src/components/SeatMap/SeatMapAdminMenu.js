import { Button, TextField } from '@material-ui/core';
import React, { useState } from 'react';

export default function SeatMapAdminMenu({ addRow, submit }) {

    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [rowName, setRowName] = useState("");

    const addRowSubmit = (e) => {
        if (numberOfSeats == "") return;

        const seats = [];

        for (var i = 1; i <= numberOfSeats; i++) {
            seats.push({
                seatNumber: i
            })
        }

        addRow({
            numberOfSeats: numberOfSeats,
            xPos: 0,
            yPos: 0,
            isVertical: false,
            rowName: rowName,
            seats: seats
        });
        setNumberOfSeats("");
    }

    return (
        <div className="addingMenu">
            <form>
                <TextField type="number" value={numberOfSeats} placeholder="10" onChange={(e) => setNumberOfSeats(e.target.value)} />
                <TextField required type="text" value={rowName} placeholder="Navn" onChange={(e) => setRowName(e.target.value)} /> {/*required*/}
                <Button variant="contained" color="primary" onClick={addRowSubmit}>Legg til rad </Button>
                <Button variant="contained" color="secondary" onClick={submit} >Lagre</Button>
            </form>
        </div>
    )

}
