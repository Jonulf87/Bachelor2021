import React, { useEffect, useState } from 'react';
import { Button, Dialog, DialogTitle, makeStyles, Paper, TextField } from '@material-ui/core';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            width: '100%'
        }
    }
}))

export default function EditTicketType({ ticketTypeId, dialogEditTicketTypeOpen, handleDialogEditTicketTypeClose, updateListTrigger }) {

    const [ticketType, setTicketType] = useState("");

    const classes = useStyles();
    const { isAuthenticated, token } = useAuth();


    useEffect(() => {
        const getTicketType = async () => {
            if (isAuthenticated) {
                const responseTicketType = await fetch(`/api/tickettypes/type/${ticketTypeId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultTicketType = await responseTicketType.json();
                setTicketType(resultTicketType);
            }
        }
        getTicketType();

    }, [isAuthenticated])

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const response = await fetch('api/tickettypes/updatetickettype', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'PUT',
                body: JSON.stringify(ticketType)
            });
            if (response.ok) {
                updateListTrigger();
            }
            handleDialogEditTicketTypeClose();
        }
    }

    return (
        <Dialog
            open={dialogEditTicketTypeOpen}
            onClose={handleDialogEditTicketTypeClose}
        >
            <Paper>
                <DialogTitle>
                    Endre billettype
                </DialogTitle>
                <form
                    className={classes.root}
                    onSubmit={submitForm}
                >
                    <TextField
                        variant='outlined'
                        id='ticketTypeName'
                        label='Billettype'
                        required
                        value={ticketType.descriptionName}
                        onChange={(e) => setTicketType(oldValues => ({ ...oldValues, descriptionName: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='basePrice'
                        label='Grunnpris'
                        required
                        value={ticketType.basePrice}
                        onChange={(e) => setTicketType(oldValues => ({ ...oldValues, basePrice: e.target.value }))}
                    />
                    <TextField
                        variant='outlined'
                        id='amountAvailable'
                        label='Antall'
                        required
                        value={ticketType.amountAvailable}
                        onChange={(e) => setTicketType(oldValues => ({ ...oldValues, amountAvailable: e.target.value }))}
                    />
                    <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                    >
                        Lagre
                    </Button>
                </form>
            </Paper>
        </Dialog>
    )
}