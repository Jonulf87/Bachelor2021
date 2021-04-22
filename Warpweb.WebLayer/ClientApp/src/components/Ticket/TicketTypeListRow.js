import { Button, TableCell, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';

export default function EventUserListRow({ id, descriptionName, basePrice, amountAvailable, amountToBuy, handleSelectedTickets }) {


    return (
        <TableRow>
            <TableCell>
                {descriptionName}
            </TableCell>
            <TableCell>
                {basePrice}
            </TableCell>
            <TableCell>
                {amountAvailable === 0 ?
                    <Typography>
                        Ingen tilgjengelig
                    </Typography>
                    :
                     amountAvailable 
                }
            </TableCell>
            <TableCell>
                <TextField
                    type="number"
                    variant="filled"
                    label="Pris"
                    value={amountToBuy}
                    onChange={(e) => handleSelectedTickets(e.target.value, id)}
                >
                </TextField>
            </TableCell>

        </TableRow>
    )
}
