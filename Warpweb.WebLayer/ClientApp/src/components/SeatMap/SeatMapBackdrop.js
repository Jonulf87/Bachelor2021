import React, { useState } from 'react';

import SeatMapAdminMenu from './SeatMapAdminMenu';
import SeatMapFloor from './SeatMapFloor';

export default function SeatMapBackdrop() {

    

    return (
        <div className="border border-primary container ">
            <SeatMapAdminMenu addRow={addRow} />
        </div>
    );
}