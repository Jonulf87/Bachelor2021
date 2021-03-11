import React, { useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import { DataGrid } from '@material-ui/data-grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
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

function getOrder(sortOrder) {
    return sortOrder === 'desc' ? 1 : -1;
}

function sortRows(sortBy, sortOrder) {
    let order = getOrder(sortOrder);
    return function (a,b) {
        var result = (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
        return result * order;
    }
};

export default function VenueTable(props) {
    const[order,setOrder] = useState('asc');
    
    const rows = props.rows;
    const classes = useStyles();
    

    const handleSortClick = (e) => {       
        const inRows = rows.sort(sortRows(e.target.id, order)); // sorting array
        const newOrder = (order === 'desc') ? 'asc' :  'desc';
        setOrder(newOrder);
        props.setRows(inRows);
    };


    //sending venue 
    const handleClick = (e) => {
        const SelectedRow = e.currentTarget.value - 1;
        props.onClick(SelectedRow);
    };

    return (

        <TableContainer className={classes.root} component={Paper}>
            <Typography gutterBottom variant="h5" component="h2">
                Lokaleoversikt
            </Typography>
            <Table className={classes.table} aria-label="Lokaletabell">
                <TableHead>
                    <TableRow>
                        <TableCell align="left" >
                            <TableSortLabel id="id" onClick={handleSortClick}>
                                Id
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left">
                            <TableSortLabel id='name' onClick={handleSortClick}>
                                Navn
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left">
                            <TableSortLabel id="adress" onClick={handleSortClick}>
                                Sted
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left"><TableSortLabel id="area" onClick={handleSortClick}>
                                Areal
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left">
                            <TableSortLabel id="maxCapacity" onClick={handleSortClick}>
                                Maks kapasitet
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="left"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.adress}</TableCell>
                            <TableCell align="left">{row.area}</TableCell>
                            <TableCell align="left">{row.maxCapacity}</TableCell>
                            <TableCell align="left">
                                <Button
                                value={row.id}
                                variant="contained"
                                onClick={handleClick}>
                                    Mer info om {row.name}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}