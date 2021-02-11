import React from 'react';
import SeatMapRow from './SeatMapRow';

export default function SeatMapFloor({ seats }) {
    return (
        <div>
            <SeatMapRow seats={seats}/>
        </div>

    );
}


