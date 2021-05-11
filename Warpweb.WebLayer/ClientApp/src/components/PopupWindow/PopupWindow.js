import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';


export default function PopupWindow({ open, handleClose, error, clearError, errors, clearErrors }) {

    const [internalErrorsArray, setInternalErrorsArray] = useState([]);

    const endDialog = () => {
        if (error !== null) {
            clearError("");
            setInternalErrorsArray([]);
        }
        else if (errors !== null) {
            clearErrors([]);
            setInternalErrorsArray([]);
        }

        handleClose(false);
    }

    useEffect(() => {

        if (errors !== null) {
            const keys = Object.keys(errors);
            const tempErrorsArray = [];

            keys.map(key => errors[key].map(error => tempErrorsArray.push(error)))
            setInternalErrorsArray(tempErrorsArray);
        }
    }, [errors])

    return (
        <div>
            <Dialog
                open={open}
                onClose={endDialog}
                aria-describedby="error-dialog"
            >
                <DialogTitle id="error-dialog">Det skjedde en feil!</DialogTitle>
                {error && (
                    <DialogContent>
                        <DialogContentText
                            component="div"
                            id="alert-dialog-description"
                            style={{ color: 'black', font: 'bold', fontSize: 'large', textAlign: 'center' }}
                        >
                            {error}
                        </DialogContentText>
                    </DialogContent>
                )}
                {internalErrorsArray.length > 0 && (
                    <DialogContent>
                        <DialogContentText
                            component="div"
                            id="alert-dialog-description"
                            style={{ color: 'black', font: 'bold', fontSize: 'large' }}
                        >
                            {internalErrorsArray.map((error, i) => (
                                <Typography key={i}>{error}</Typography>
                            ))}
                        </DialogContentText>
                    </DialogContent>
                )}
                <DialogActions>
                    <Button
                        onClick={endDialog}
                        variant="contained"
                        color="primary"
                        size="large">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}