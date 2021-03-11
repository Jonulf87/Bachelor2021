import React from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import { DataGrid } from '@material-ui/data-grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper';

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
    const venue = props.venue;

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
                            <TableCell>{venue.adress}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align="right">Areal</TableCell>
                            <TableCell>{venue.area}</TableCell>
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
