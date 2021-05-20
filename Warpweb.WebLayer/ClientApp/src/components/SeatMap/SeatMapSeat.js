import React, { useState } from 'react';
import useSeatMap from '../../hooks/useSeatMap';
import { Alert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

export default function SeatMapSeat({ id, seatNumber, isReserved, rowId, ticketTypeIds, rowName }) {
    const { reserveSeat, getActiveTicket } = useSeatMap();
    const [alertOpen, setAlertOpen] = useState(false);

    const handleClick = () => {
        if (seatStatus() === 'seatAvailable') {
            if (reserveSeat(id)) {
                setAlertOpen(true);
            } else {
                setAlertOpen(false);
            }
        }
    };

    const seatStatus = () => {
        const activeTicket = getActiveTicket();

        if (activeTicket?.seatId === id) {
            return 'seatOccupiedByUser';
        } else if (isReserved) {
            return 'seatOccupied';
        } else if (activeTicket && ticketTypeIds.includes(activeTicket.ticketTypeId)) {
            return 'seatAvailable';
        } else {
            return 'seatUnavailable';
        }
    };

    return (
        <>
            <Snackbar
                open={alertOpen}
                autoHideDuration={5000}
                onClose={() => setAlertOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="success" color="success" variant="filled">
                    Du har reservert sete nummer {seatNumber} på rad {rowName}
                </Alert>
            </Snackbar>
            <div className={seatStatus() + ' publicSeat'} onClick={() => handleClick()}>
                {seatNumber}
            </div>
        </>
    );
}
