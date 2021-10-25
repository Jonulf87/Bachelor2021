import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import { Button, MenuItem, Select, TextField, Checkbox, FormControlLabel, Paper, FormControl } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import useAuth from '../../hooks/useAuth';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: '100%',
        },
    },
}));

export default function RowToolsDialog({ open, handleClose, row }) {
    const classes = useStyles();
    const [name, setName] = useState('');
    const [numberOfSeats, setNumberOfSeats] = useState('');
    const [ticketTypesSelected, setTicketTypesSelected] = useState([]);

    const { updateRowData, ticketTypes } = useSeatMapAdmin();

    useEffect(() => {
        if (row) {
            setName(row.rowName);
            setNumberOfSeats(row.numberOfSeats);
            setTicketTypesSelected(row.ticketTypeIds);
        }
    }, [row]);

    const updateRowTicketTypes = (ticketTypeId) => {
        if (ticketTypesSelected.some((a) => a === ticketTypeId)) {
            setTicketTypesSelected((oldValue) => oldValue.filter((a) => a !== ticketTypeId));
        } else {
            setTicketTypesSelected((oldValue) => [...oldValue, ticketTypeId]);
        }
    };

    const submitForm = (e) => {
        e.preventDefault();
        updateRowData(row.rowName, name, numberOfSeats, ticketTypesSelected);
        handleClose();
    };

    if (row === null) {
        return null;
    }

    return (
        <Dialog onClose={handleClose} open={open}>
            <Paper variant="outlined" elevation={0} style={{ padding: '8px', width: '300px' }}>
                <form className={classes.root} onSubmit={submitForm}>
                    <TextField value={name} label="Radnavn" onChange={(e) => setName(e.target.value)} />
                    <TextField value={numberOfSeats} label="Antall seter" onChange={(e) => setNumberOfSeats(e.target.value)} />
                    {ticketTypes
                        .sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0))
                        .map((ticketType) => (
                            <FormControlLabel
                                key={ticketType.id}
                                control={
                                    <Checkbox
                                        inputProps={{ 'aria-label': ticketType.descriptionName }}
                                        checked={ticketTypesSelected.some((a) => a === ticketType.id)}
                                        onChange={() => updateRowTicketTypes(ticketType.id)}
                                        name={ticketType.descriptionName}
                                    />
                                }
                                label={ticketType.descriptionName}
                            />
                        ))}
                    <FormControl style={{ padding: '8px' }}>
                        <Button type="submit" variant="contained" color="primary" size="large">
                            Lagre
                        </Button>
                    </FormControl>
                </form>
            </Paper>
        </Dialog>
    );
}
