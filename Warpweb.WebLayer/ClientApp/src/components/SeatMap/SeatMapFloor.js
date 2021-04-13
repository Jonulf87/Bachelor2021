import React, { useState } from 'react';
import SeatMapRow from './SeatMapRow';
import RowToolsDialog from './RowToolsDialog';

export default function SeatMapFloor({ rows, updateRowPosition, setSeatInfo, ticketTypeList }) {

    const [open, setOpen] = useState(false);
    const [rowInEditMode, setRowInEditMode] = useState(null);

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
                {rows.map(row => (<SeatMapRow key={row.rowName} {...row} updateRowPosition={updateRowPosition} handleOpen={handleOpen} />))}
            </div>
            <RowToolsDialog open={open} handleClose={handleClose} row={rowInEditMode} ticketTypeList={ticketTypeList} />
        </>
    );
}





