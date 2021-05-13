import { Button, Container, Dialog, DialogTitle, FormControl, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';

const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(1),
            width: "100%",
            marginLeft: 0
        }
    },
}));

export default function CreateTicketType({ dialogOpen, handleDialogClose, triggerUpdate }) {

    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    }

    const [name, setName] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [amountAvailable, setAmountAvailable] = useState('');

    const { isAuthenticated, token } = useAuth();

    const classes = useStyles();

    const dataToBeSent = {
        'descriptionName': name,
        'basePrice': basePrice,
        'amountAvailable': amountAvailable
    }

    const submitForm = async (e) => {
        e.preventDefault();
        if (isAuthenticated) {
            const  response = await fetch('/api/tickettypes/createtickettype', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(dataToBeSent)
            });

            if (response.ok) {
                triggerUpdate();
                setName('');
                setBasePrice('');
                setAmountAvailable('');
                handleDialogClose();
            }
            else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            }
            else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    }

    return (
        <Dialog
            open={dialogOpen}
            onClose={handleDialogClose}
            className={classes.root}
        >

            <PopupWindow open={errorDialogOpen} handleClose={handleErrorDialogClose} error={error} clearError={setError} errors={errors} clearErrors={setErrors} />

            <Container
                style={{ padding: '10px' }}
            >
                <DialogTitle>
                    Ny billettype
                </DialogTitle>

                <form
                    onSubmit={submitForm}
                    
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
                        
                </form>
            </Container>
        </Dialog>
    )
}