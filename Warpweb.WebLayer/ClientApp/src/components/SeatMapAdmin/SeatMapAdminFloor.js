import React, { useState } from 'react';
import SeatMapAdminRow from './SeatMapAdminRow';
import RowToolsDialog from './RowToolsDialog';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

export default function SeatMapAdminFloor() {
    const [open, setOpen] = useState(false);
    const [rowInEditMode, setRowInEditMode] = useState(null);

    const { rows } = useSeatMapAdmin();

    const handleOpen = (rowName) => {
        setOpen(true);
        const row = rows.find((a) => a.rowName === rowName);
        setRowInEditMode(row);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div className="seatMapFloor">
                {rows && rows.map((row) => <SeatMapAdminRow key={row.rowName} {...row} handleOpen={handleOpen} />)}
            </div>
            <RowToolsDialog open={open} handleClose={handleClose} row={rowInEditMode} />
        </>
    );
}
