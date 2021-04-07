import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import { makeStyles } from '@material-ui/core/styles';


export default function PopupWindow(props) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open])

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Dialog 
                PaperProps={{
                    style: {
                        minHeight: "20vh",
                        minWidth: "35vw"
                    }
                }}
                open={open}
                onClose={handleClose}
                aria-describedby="alert-dialog-description"
            >
                <DialogContent >
                    <DialogContentText id="alert-dialog-description" style={{ color: 'black', font: 'bold', fontSize: 'large', textAlign: 'center' }}>
                        {props.text}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}
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