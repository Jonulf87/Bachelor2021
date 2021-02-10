import React from 'react';
import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';

export default function SeatMapBackdrop() {
    return (
        <div>
            <SeatMapAdminMenu />
            <SeatMapFloor />
        </div>

    );
}