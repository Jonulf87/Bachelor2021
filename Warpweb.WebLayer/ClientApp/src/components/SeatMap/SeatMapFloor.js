import React from 'react';
import useSeatMap from '../../hooks/useSeatMap';
import SeatMapRow from './SeatMapRow';

export default function SeatMapFloor() {
    const { rows } = useSeatMap();
    return <div className="seatMapFloor">{rows && rows.map((row) => <SeatMapRow {...row} key={row.id} />)}</div>;
}
