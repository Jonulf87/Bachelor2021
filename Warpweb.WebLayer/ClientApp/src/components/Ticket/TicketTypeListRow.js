import { Button, TableCell, TableRow, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import usePurchase from '../../hooks/usePurchase';

export default function EventUserListRow({ id, descriptionName, basePrice, amountAvailable, amountToBuy }) {

    const { handleSelectedTickets, amountError } = usePurchase();
    const [helperText, setHelperText] = useState("");

    useEffect(() => {
        const handleHelperText = () => {
            if (amountError) {
                setHelperText("Du kan ikke velge mindre enn 0 billetter.");
            }
            else {
                setHelperText("");
            }
        }
        handleHelperText();

    }, [amountError])

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
                    error={amountError}
                    helperText={helperText}
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
