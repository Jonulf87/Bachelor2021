import { Button, Grid, TextField } from '@material-ui/core';
import { Form } from 'reactstrap';
import React, { useState } from 'react';

export default function SeatMapAdminMenu({ addRow, submit, rowNameAlreadyExists }) {

    const [numberOfSeats, setNumberOfSeats] = useState("");
    const [rowName, setRowName] = useState("");
    const [error, setError] = useState();

    const addRowSubmit = (e) => {
        if (numberOfSeats == "") return;
        if (rowName == "") return;
        if (rowNameAlreadyExists(rowName)) {
            setError("Rad med dette navnet eksisterer allerde.");
            return;
        }
        setError(null);
        const seats = [];

        for (var i = 1; i <= numberOfSeats; i++) {
            seats.push({
                seatNumber: i
            })
        }

        addRow({
            numberOfSeats: numberOfSeats,
            xPos: 0,
            yPos: 0,
            isVertical: false,
            rowName: rowName,
            seats: seats,
            ticketTypeIds: []
        });
        setNumberOfSeats("");
    }

    return (

        <div className="addingMenu">

            <Form>
                <Grid
                    container
                    spacing={2}
                    direction="row"
                    justify="flex-start"
                >
                    <Grid
                        item
                        xs={3}
                    >

                        <TextField
                            type="number"
                            value={numberOfSeats}
                            label="Antall seter på rad"
                            placeholder="10"
                            onChange={(e) => setNumberOfSeats(e.target.value)}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={3}
                    >

                        <TextField
                            required
                            type="text"
                            value={rowName}
                            label="Navn på rad"
                            placeholder="Navn"
                            onChange={(e) => setRowName(e.target.value)}
                            error={error}
                            helperText={error}
                        />
                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                        <Button variant="contained" color="primary" onClick={addRowSubmit}>Legg til rad </Button>
                    </Grid>

                    <Grid
                        item
                        xs={6}
                    >
                        <Button variant="contained" color="secondary" onClick={submit} >Lagre</Button>
                    </Grid>
                </Grid>
            </Form>
        </div>

    )

}
