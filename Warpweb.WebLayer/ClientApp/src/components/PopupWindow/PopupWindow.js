import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


export default function PopupWindow(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open])

    const handleClose = () => {
        setOpen(false);
        props.onClose();
    };

    return (
        <div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-describedby="alert-dialog-description"
            >
                {props.title && <DialogTitle id="alert-dialog-title">{props.title}</DialogTitle>}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ color: 'black', font: 'bold', fontSize: 'large', textAlign: 'center' }}>
                        {props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleClose}
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