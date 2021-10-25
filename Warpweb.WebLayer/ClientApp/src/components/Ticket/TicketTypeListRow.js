import { Button, TableCell, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import usePurchase from '../../hooks/usePurchase';

export default function EventUserListRow({ id, descriptionName, basePrice, amountAvailable, amountToBuy }) {
    const { addTicketType } = usePurchase();

    return (
        <TableRow>
            <TableCell>{descriptionName}</TableCell>
            <TableCell>{basePrice}</TableCell>
            <TableCell>{amountAvailable < 1 ? <Typography>Ingen tilgjengelig</Typography> : amountAvailable}</TableCell>
            <TableCell>
                <Button variant="contained" color="primary" onClick={() => addTicketType(id, descriptionName)}>
                    Legg til billett
                </Button>
            </TableCell>
        </TableRow>
    );
}
