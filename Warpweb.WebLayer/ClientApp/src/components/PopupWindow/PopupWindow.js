import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography } from '@material-ui/core';

export default function PopupWindow({ open, handleClose, error, clearError, errors, clearErrors, loginErrors }) {
    const [internalErrorsArray, setInternalErrorsArray] = useState([]);

    const endDialog = () => {
        if (error !== null && error !== undefined) {
            clearError('');
            setInternalErrorsArray([]);
        } else if (errors !== null && errors !== undefined) {
            clearErrors([]);
            setInternalErrorsArray([]);
        }

        handleClose(false);
    };

    useEffect(() => {
        if (errors?.length > 0) {
            const keys = Object.keys(errors);
            const tempErrorsArray = [];

            keys.map((key) => errors[key].map((error) => tempErrorsArray.push(error)));
            setInternalErrorsArray(tempErrorsArray);
        } else if (loginErrors?.length > 0) {
            setInternalErrorsArray(loginErrors);
        }
    }, [errors, loginErrors]);

    return (
        <div>
            <Dialog open={open} onClose={endDialog} aria-describedby="error-dialog">
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
                    <Button onClick={endDialog} variant="contained" color="primary" size="large">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
