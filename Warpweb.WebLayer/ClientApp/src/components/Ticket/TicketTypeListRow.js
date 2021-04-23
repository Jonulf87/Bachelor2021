import { Button, TableCell, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import usePurchase from '../../hooks/usePurchase';

export default function EventUserListRow({ id, descriptionName, basePrice, amountAvailable, amountToBuy }) {

    const { handleSelectedTickets } = usePurchase();

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
                    label="Antall"
                    value={amountToBuy}
                    onChange={(e) => handleSelectedTickets(e.target.value, id)}
                >
                </TextField>
            </TableCell>

        </TableRow>
    )
}
