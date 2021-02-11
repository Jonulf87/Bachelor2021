import React, { useState } from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';

export default function SeatMapBackdrop() {

    let [seatNumber, setSeatNumber] = useState(1) 

    return (
        <div>
            <SeatMapAdminMenu setSeatNumber={setSeatNumber} />
            <SeatMapFloor seats={seatNumber} />
        </div>

    );
}