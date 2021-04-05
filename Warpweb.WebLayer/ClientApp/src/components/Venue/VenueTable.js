import React, { useState, useEffect } from "react";
import { makeStyles, createStyles } from '@material-ui/core/styles';
import {
    IconButton, Input, InputAdornment, InputLabel, FormControl, Typography, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Paper, Button, TextField,
    Collapse, Box
} from '@material-ui/core';
import VenueInfo from './VenueInfo';
import useAuth from "../../hooks/useAuth";
import CreateVenue from "./CreateVenue";
import MUIDataTable, { ExpandButton } from 'mui-datatables';



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

export default function VenueTable() {
    const [isReady, setIsReady] = useState(false);
    

    const { isAuthenticated, token } = useAuth();

    const [venueList, setVenueList] = useState([]);
    //fetch venues
    useEffect(() => {
        const getVenues = async () => {
            if (isAuthenticated) {
                const respone = await fetch('/api/venues/venueslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const result = await respone.json();
                setVenueList(result);
                setIsReady(true);
            }
        }

        getVenues();

    }, []);

    const classes = useStyles();


    const columns = [
        {
            name: 'name',
            label: 'Navn'
        },
        {
            name: 'address',
            label: 'Addresse'
        },
    ];

    const options = {
        filter: true,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: 'none',
        expandableRows: true,
        expandableRowsHeder: false,
        expandableRowsObClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            //Eksempel på hvordan sperre to rader fra å åpne
            //if (dataIndex === 3 || dataIndex === 4) return false;

            //forhindre expande av any rad når 4 rader allerede åpne. Men tillater lukking av de åpne
            if (expandedRows.data.length >= 4 && expandedRows.data.filter(data => data.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        rowsExpanded: [0],
        renderExpandableRow: (rowData, rowMeta) => {
            const colSpan = rowData.length + 1;
            return (
                <TableRow>
                    <TableCell colSpan={colSpan}>
                        {JSON.stringify(rowData)}
                    </TableCell>
                </TableRow>
            );
        },
        //Denne ser ut til å kunne trigge noe ved  åpning. Bruke til å hente roller?
        onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => console.log(`curExpanded:   ${ curExpanded }  allExpanded: ${allExpanded}  rowsExpanded: ${rowsExpanded}`)
    };

    const components = {
        ExpandedButton: function (props) {
            if (props.dataIndex === 3 || props.dataIndex === 4) return <div style={{ width: '24px' }} />;
            return <ExpandButton {...props} />
        }
    };

    return (
        <>
            <MUIDataTable
                title={'Lokaler'}
                data={venueList}
                columns={columns}
                options={options}
                components={components}
                />
        </>
    );
}