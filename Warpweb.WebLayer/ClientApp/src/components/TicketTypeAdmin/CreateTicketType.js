import { Dialog, DialogTitle, FormControl, makeStyles, Paper, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { Button, Form } from 'reactstrap/lib';
import useAuth from '../../hooks/useAuth';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            padding: theme.spacing(1),
            widht: "100%"
        }
    },
}));

export default function CreateTicketType({ dialogOpen, handleDialogClose, triggerUpdate }) {

    const classes = useStyles();

    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [amountAvailable, setAmountAvailable] = useState('');

    const { isAuthenticated, token } = useAuth();

    const dataToBeSent = {
        'descriptionName': name,
        'basePrice': basePrice,
        'amountAvailable': amountAvailable
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            await fetch('/api/tickettypes/createtickettype', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(dataToBeSent)
            });
            triggerUpdate();
            setName('');
            setBasePrice('');
            setAmountAvailable('');
            handleDialogClose();
        }
    }

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
        >
            <Paper
                variant="outlined"
                elevation={0}
                style={{ padding: '10px' }}
            >
                <DialogTitle>
                    Ny billettype
                </DialogTitle>
                <Form
                    onSubmit={submitForm}
                    className={classes.root}
                >
                    <TextField
                        id="name"
                        label="Billettype"
                        required
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <TextField
                        id="basePrice"
                        label="Grunnpris"
                        required
                        fullWidth
                        type="number"
                        value={basePrice}
                        onChange={(e) => setBasePrice(e.target.value)}
                    />

                    <TextField
                        id="amountAvailable"
                        label="Antall"
                        required
                        fullWidth
                        type="number"
                        value={amountAvailable}
                        onChange={(e) => setAmountAvailable(e.target.value)}
                    />

                    <FormControl style={{ padding: '8px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            type="submit"
                        >
                            Lagre
                        </Button>
                    </FormControl>
                        
                </Form>
            </Paper>
        </Dialog>
    )
}