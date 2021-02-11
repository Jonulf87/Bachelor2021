import React, { useState } from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapAdminMenu({ setSeatNumber }) {

    let [numberOfSeats, setNumberOfSeats] = useState("");

    return (
        <div className="addingMenu" >

            <form onSubmit={(e) => {
                e.preventDefault();
                setSeatNumber(numberOfSeats);
                setNumberOfSeats("");
            }}>
                <label>
                    Antall seter på rad:
                    <input type="text" id="numberOfSeats" value={numberOfSeats} onChange={(e) => setNumberOfSeats(e.target.value)} />
                </label>
                <input type="submit"  />
            </form>


        </div>

    );
}
