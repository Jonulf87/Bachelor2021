import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import { MenuItem, Select, TextField, Checkbox, FormControlLabel } from '@material-ui/core';

export default function RowToolsDialog({ open, handleClose, row, ticketTypeList }) {

    const [ticketTypeSelected, setTicketTypeSelected] = useState("");


    //Flytte opp ett nivå


    if (row === null) {
        return null;
    }

    return (
        <Dialog
            onClose={handleClose}
            open={open}
        >
            <div>
                <TextField value={row.rowName} label="Radnavn" />
                <TextField value={row.seats.length} label="Antall seter" />
                {ticketTypeList.sort((a, b) => a.name > b.name ? 1 : ((b.name > a.name) ? -1 : 0)).map((ticketType) => (
                    <FormControlLabel
                        key={ticketType.id}
                        control={<Checkbox
                            checked={row.ticketTypeIds.some(a => a === ticketType.id)}
                            name={ticketType.descriptionName} />}
                        label={ticketType.descriptionName}

                    />
                ))}
            </div>
        </Dialog>
    )
}