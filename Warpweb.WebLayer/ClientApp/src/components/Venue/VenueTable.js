import React, { useState } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
//import { DataGrid } from '@material-ui/data-grid';
import Input from '@material-ui/core/Input';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
import TextField from "@material-ui/core/TextField";
import SearchIcon from '@material-ui/icons/Search';



const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            //maxWidth: 500,
            padding: 10,
            marginBottom: 10,
        },
        margin: {
            margin: theme.spacing(1),
          },
    }),
);

function getOrder(sortOrder) {
    return sortOrder === 'desc' ? 1 : -1;
}

//sorterer ikke tall korrekt. link under for mulig fiks
//https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
function sortRows(sortBy, sortOrder) {
    let order = getOrder(sortOrder);
    return function (a,b) {
        var result = (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
        return result * order;
    }
};

export default function VenueTable(props) {
    const [order, setOrder] = useState('asc');
    const [tableRows, setTableRows] = useState(props.rows);
    const [filteredRows, setFilteredRows] = useState(props.rows);
    const classes = useStyles();
    
    //search table function
    const handleChange = (e) => {
        const searchTerm = e.currentTarget.value;
        const newRows = tableRows.filter(obj => {
            return  obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                    obj.adress.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                    obj.area.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                    obj.maxCapacity.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        });
        setFilteredRows(newRows);
    };
    
    //sort table fucntion
    const handleSortClick = (e) => {       
        const inRows = filteredRows.sort(sortRows(e.target.id, order));
        const newOrder = (order === 'desc') ? 'asc' :  'desc';
        console.log("newrow: " + JSON.stringify(inRows));
        setOrder(newOrder);
        setFilteredRows(inRows);
    };

    //show info
    const handleClick = (e) => {
        const SelectedRow = e.currentTarget.value;
        props.onClick(SelectedRow);
    };

    return (

        <TableContainer className={classes.root} component={Paper}>
            <Typography gutterBottom variant="h5" component="h2">
                Lokaleoversikt
            </Typography>
            <TextField
            className={classes.margin}
            id="input-with-icon-textfield"
            placeholder="Søk i tabell"
            onChange={handleChange}
            InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon/>
                  </InputAdornment>
                ),
              }}
            />
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
                        <TableCell align="left">Handlinger</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredRows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell align="left">{row.id}</TableCell>
                            <TableCell align="left">{row.name}</TableCell>
                            <TableCell align="left">{row.adress}</TableCell>
                            <TableCell align="left">{row.area}</TableCell>
                            <TableCell align="left">{row.maxCapacity}</TableCell>
                            <TableCell align="left">
                                <Button
                                value={row.id}
                                variant="outlined"
                                onClick={handleClick}
                                >
                                    Mer info
                                </Button>
                                <Button
                                value={row.id}
                                variant="outlined"
                                >
                                    Endre
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}