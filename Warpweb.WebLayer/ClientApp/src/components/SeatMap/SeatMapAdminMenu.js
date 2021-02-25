import React, { useState } from 'react';

import SeatMapRow from './SeatMapRow';

export default function SeatMapAdminMenu({ addRow }) {

    let [numberOfSeats, setNumberOfSeats] = useState("1");

    const submit = (e) => {
        e.preventDefault();
        if (numberOfSeats == "") return;
        addRow(numberOfSeats);
        setNumberOfSeats(1);
    }

    return (
        <div className="addingMenu border-bottom border-primary">
            <input type="text" id="DontCare" value={numberOfSeats} placeholder="ex. 10" onChange={(e) => setNumberOfSeats(e.target.value)} />
            <button type="submit" onClick={submit}>Submit</button>
        </div>
    )

}
