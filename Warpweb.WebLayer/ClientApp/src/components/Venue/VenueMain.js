import React, { useState } from "react";
import authService from '../api-authorization/AuthorizeService';
import VenueInfo from './VenueInfo';
import VenueAdmin from './VenueAdmin';
import VenueTable from './VenueTable';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";




function createData(id, name, adress, area, maxCapacity) {
    return { id, name, adress, area, maxCapacity };
}

const dataRows = [
    createData(1, 'Ballhall arena', 'Sannergata 12, 0654 Oslo', '10000', '1337'),
    createData(2, 'Andaberg Camping', 'Qandaberg', '423', '52'),
    createData(3, 'Vikingskipet', 'Eillehammer', '9001', '24000'),
    createData(4, 'C35', 'Pilestredet', '9999', '0'),
];


export default function VenueMain() {
    const [rows, setRows] = useState(dataRows);
    const [row, setRow] = useState(rows[1]);  

    const handleClick = (e) => {
        const inId = parseInt(e);
        const newRow = rows.find(obj => {
            return obj.id === inId
        });
        console.log("newrow: " + JSON.stringify(newRow));
        setRow(newRow);
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <Typography variant="h2">Lokaler</Typography>
            </Grid> 
            <Grid item xs={6}>
                <VenueInfo venue={row}/>
            </Grid>
            <Grid item xs={6}>
                <VenueAdmin />
            </Grid>
            <Grid item xs={9}>
                <VenueTable
                rows={rows}
                onClick={handleClick}
                >
                    <VenueInfo/>
                </VenueTable>
            </Grid>          
        </Grid>
    );
}
