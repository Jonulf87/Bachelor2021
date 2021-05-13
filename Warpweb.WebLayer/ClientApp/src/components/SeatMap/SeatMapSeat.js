import React from 'react';
import useSeatMap from '../../hooks/useSeatMap';

export default function SeatMapSeat({ id, seatNumber, isReserved, rowId, ticketTypeIds }) {

    const { reserveSeat, getActiveTicket } = useSeatMap();

    const handleClick = () => {
        if (seatStatus() === 'seatAvailable') {
            reserveSeat(id);
        }
    }

    const seatStatus = () => {
        const activeTicket = getActiveTicket();


        if (activeTicket?.seatId === id) {
            return 'seatOccupiedByUser';
        }
        else if (isReserved) {
            return 'seatOccupied';
        }
        else if (activeTicket && ticketTypeIds.includes(activeTicket.ticketTypeId)) {
            return 'seatAvailable';
        }
        else {
            return 'seatUnavailable';
        }
    }

    return (
        <div
            className={seatStatus() + ' publicSeat'}
            onClick={() => handleClick()}
        >
            {seatNumber}
        </div>
    )
}