import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
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

//function createData(id, name, location, sqMeters, maxCapacity) {
//    return { id, name, location, sqMeters, maxCapacity };
//}

//const rows = [
//    createData(1, 'Vallhall arena', 'Oslo', '10000', '1337'),
//    createData(2, 'Randaberg Camping', 'Randaberg', '423', '52'),
//    createData(3, 'Vikingskipet', 'Lillehammer', '9001', '24000'),
//    createData(4, 'P35', 'Pilestredet', '10000', '0'),
//];


export default function VenueTable(props) {
    const classes = useStyles();
    const [rows, setRows] = useState(props.venues);

    const handleClick = {};

    return (

        <TableContainer className={classes.root} component={Paper}>
            <Typography gutterBottom variant="h5" component="h2">
                Lokaleoversikt
            </Typography>
            <Table className={classes.table} aria-label="Lokaletabell">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Id</TableCell>
                        <TableCell align="left">Navn</TableCell>
                        <TableCell align="left">Sted</TableCell>
                        <TableCell align="left">Kvadratmeter</TableCell>
                        <TableCell align="left">Maks kapasitet</TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.location}</TableCell>
                            <TableCell align="left">{row.sqMeters}</TableCell>
                            <TableCell align="left">{row.maxCapacity}</TableCell>
                            <TableCell align="left">
                                <Button variant="contained" onClick={handleClick}>Mer info</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}