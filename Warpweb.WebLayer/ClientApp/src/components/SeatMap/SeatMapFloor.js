import React, { useState } from 'react';
import SeatMapRow from './SeatMapRow';
import RowToolsDialog from './RowToolsDialog';
import useSeatMap from '../../hooks/useSeatMap';

export default function SeatMapFloor({    ticketTypeList }) {

    const [open, setOpen] = useState(false);
    const [rowInEditMode, setRowInEditMode] = useState(null);

    const { rows } = useSeatMap();

    const handleOpen = (rowName) => {
        setOpen(true);
        const row = rows.find(a => a.rowName === rowName)
        setRowInEditMode(row);
    };

    const handleClose = () => {
        setOpen(false);
    };


    return (
        <>
            <div style={{
                width: "600px",
                height: "600px",
                position: "relative",
                backgroundColor: "#ccc",
                boxSizing: "border-box"
            }}>
                {rows && rows.map(row => (<SeatMapRow key={row.rowName} {...row}  handleOpen={handleOpen} />))}
            </div>
            <RowToolsDialog open={open} handleClose={handleClose} row={rowInEditMode} />
        </>
    );
}





