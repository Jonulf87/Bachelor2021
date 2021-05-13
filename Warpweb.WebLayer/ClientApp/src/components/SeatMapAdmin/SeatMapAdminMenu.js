import { Button, Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import useSeatMapAdmin from '../../hooks/useSeatMapAdmin';

export default function SeatMapAdminMenu() {
    const { addRow, rowName, setRowName, numberOfSeats, setNumberOfSeats, error, submitRows } = useSeatMapAdmin();

    return (
        <div className="addingMenu">
            <form>
                <Grid container spacing={2} direction="row" justify="flex-start">
                    <Grid item xs={3}>
                        <TextField
                            type="number"
                            value={numberOfSeats}
                            label="Antall seter på rad"
                            placeholder="10"
                            onChange={(e) => setNumberOfSeats(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            required
                            type="text"
                            value={rowName}
                            label="Navn på rad"
                            placeholder="Navn"
                            onChange={(e) => setRowName(e.target.value)}
                            error={Boolean(error)}
                            helperText={error}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={addRow}>
                            Legg til rad{' '}
                        </Button>
                    </Grid>

                    <Grid item xs={6}>
                        <Button variant="contained" color="secondary" onClick={submitRows}>
                            Lagre
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </div>
    );
}
