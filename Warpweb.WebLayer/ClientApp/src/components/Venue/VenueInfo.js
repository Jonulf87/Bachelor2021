import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
    }),
);

export default function VenueInfo(props) {
    const classes = useStyles();

    const [venue, setVenue] = useState(props.venues[1]);

    return (
        <TableContainer className={classes.root} component={Paper}>
                <Table className={classes.table} aria-label="Lokaletabell">
                    <TableBody>
                        <TableRow>
                            <TableCell align="right">Navn</TableCell>
                            <TableCell>{venue.name}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">Sted</TableCell>
                            <TableCell>{venue.location}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">Areal</TableCell>
                            <TableCell>{venue.sqMeters}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">Maks kapasitet</TableCell>
                            <TableCell>{venue.maxCapacity}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
        </TableContainer>

    );
}
