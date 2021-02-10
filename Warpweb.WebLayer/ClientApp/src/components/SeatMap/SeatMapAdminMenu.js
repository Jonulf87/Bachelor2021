import React, { useState } from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapAdminMenu(props) {

    let [seatNumber, setSeatNumber] = useState(0);

    return (
        <div className="addingMenu">

            <form>
                <label>
                    Antall seter på rad:
                    <input type="text" id="numberOfSeats" onChange={() => setSeatNumber(this.value)} />
                </label>
                <input type="submit" />
            </form>


        </div>

    );
}
