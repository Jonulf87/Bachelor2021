import React, { useState } from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapAdminMenu(props) {

    let [seatNumber, setSeatNumber] = useState(0);


    return (
        <div className="addingMenu">

            <form onSubmit={ }>
                <label>
                    Antall seter på rad:
                    <input type="text" id="numberOfSeats" onChange={() => setSeatRow())} />
                </label>
                <input type="submit" onClick={() => setSeatRow(seatNumber) }/>
            </form>


        </div>

    );
}
