import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    IconButton, Input, InputAdornment, InputLabel, FormControl, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Button, TextField,
    Collapse, Box
} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';
import VenueInfo from './VenueInfo';
import useAuth from "../../hooks/useAuth";
import CreateVenue from "./CreateVenue";



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
    return function (a, b) {
        var result = (a[sortBy] < b[sortBy]) ? -1 : (a[sortBy] > b[sortBy]) ? 1 : 0;
        return result * order;
    }
};

export default function VenueTable(props) {
    const [order, setOrder] = useState('asc');
    const [venueList, setVenueList] = useState([]);
    const [tableColumns, setTableColumns] = useState([]);
    const [filteredRows, setFilteredRows] = useState(venueList);
    const [isReady, setIsReady] = useState(false);
    const [open, setOpen] = useState(0);
    const [openCreate, setOpenCreate] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const classes = useStyles();

    useEffect(() => {
        //fetching venues
        const getVenues = async () => {
            if (isAuthenticated) {
                const respone = await fetch('/api/venues/venueslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await respone.json();
                setVenueList(result);
                setTableColumns(Object.keys(result[0]))
                setIsReady(true);
            }
        }

        getVenues();

    }, []);

    //search table function
    const handleChange = (e) => {
        const searchTerm = e.currentTarget.value;
        const newRows = venueList.filter(obj => {
            return obj.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                obj.adress.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                obj.area.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1 ||
                obj.maxCapacity.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
        });
        setFilteredRows(newRows);
    };

    //sort table fucntion
    const handleSortClick = (e) => {
        const inRows = filteredRows.sort(sortRows(e.target.id, order));
        const newOrder = (order === 'desc') ? 'asc' : 'desc';
        setOrder(newOrder);
        setFilteredRows(inRows);
    };

    //show info
    const handleClick = (e) => {
        const inId = parseInt(e.currentTarget.value);
        const SelectedVenue = (inId === open) ? 0 : inId;
        setOpen(SelectedVenue);
    };

    return (

        <>
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
                            <SearchIcon />
                        </InputAdornment>
                    ),
                }}
            />
            <Button variant="contained" color="primary" onClick={() => setOpenCreate(!openCreate)} disableElevation>
                Legg til
            </Button>
            <Collapse in={openCreate} unmountOnExit>
                <Box margin={1}>
                    <CreateVenue />
                </Box>
            </Collapse>
            <Table className={classes.table} aria-label="Lokaletabell">
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
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
                    </TableRow>
                </TableHead>
                <TableBody>
                {venueList.map((venuesList) => (
                    <>
                        <TableRow key={venuesList.id}>
                            <TableCell>
                                <IconButton aria-label="" size="small" onClick={handleClick} value={venuesList.id}>
                                    {(open === venuesList.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                </IconButton>
                            </TableCell>
                            <TableCell align="left">{venuesList.id}</TableCell>
                            <TableCell align="left">{venuesList.name}</TableCell>
                        </TableRow>
                        <TableRow key={venuesList.id * -1}>
                            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={3}>
                                <Collapse in={venuesList.id === open} timeout="auto" unmountOnExit>
                                    <Box p={{ xs: 1, sm: 2, md: 2 }}>
                                        <VenueInfo venue={venuesList.id} />
                                    </Box>
                                </Collapse>
                            </TableCell>
                        </TableRow>
                    </>
                ))}
            </TableBody>
            </Table>
        </>
    )
}