import { Button } from '@material-ui/core';
import React, { useState } from 'react';

export default function SeatMapAdminMenu({ addRow }) {

    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [rowName, setRowName] = useState("");

    const addRowSubmit = (e) => {
        if (numberOfSeats == "") return;
        addRow({
            numberOfSeats: numberOfSeats,
            xPos: 0,
            yPos: 0,
            isVertical: false,
            rowName: rowName
        });
        setNumberOfSeats("");
    }

    return (
        <div className="addingMenu">
            <input type="number" value={numberOfSeats} placeholder="10" onChange={(e) => setNumberOfSeats(e.target.value)} />
            <input required type="text" value={rowName} placeholder="Navn" onChange={(e) => setRowName(e.target.value)} /> {/*required*/}
            <Button onClick={addRowSubmit}>Legg til rad </Button>
        </div>
    )

}
