import React, { useState, useEffect } from "react";
import { Grid, GridItem, CircularProgress, Toolbar, Typography, Button } from '@material-ui/core';
import VenueAdminRowDetails from './VenueAdminRowDetails';
import useAuth from "../../hooks/useAuth";
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import CreateVenue from "./CreateVenue";
import PopupWindow from "../PopupWindow/PopupWindow";


export default function VenueMain() {

    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [venueList, setVenueList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [dialogCreateVenueOpen, setDialogCreateVenueOpen] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    const handleDialogCreateVenueOpen = () => {
        setDialogCreateVenueOpen(true);
    }

    const handleDialogCreateVenueClose = () => {
        setDialogCreateVenueOpen(false);
    }

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    }

    useEffect(() => {
        const getVenues = async () => {
            if (isAuthenticated) {
                const responseVenues = await fetch('/api/venues/organizervenueslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });

                if (responseVenues.ok) {
                    const resultVenues = await responseVenues.json();
                    setVenueList(resultVenues);
                }
                else if (responseVenues.status === 400) {
                    setVenueList([]);
                    const errorResult = await responseVenues.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                }
                else {
                    setVenueList([]);
                    const errorResult = await responseVenues.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        }
        getVenues();
    }, [isAuthenticated, updateList]);

    const columns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                display: false,
            }
        },
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
        rowsExpanded: rowsExpanded,
        filter: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: 'none',
        selectableRowsOnClick: false,
        expandableRows: true,
        expandableRowsHeder: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <VenueAdminRowDetails rowData={rowData} rowMeta={rowMeta} />
            );
        },
        onRowClick: (rowData, rowMeta) => {
            if (rowsExpanded.indexOf(rowMeta.dataIndex) !== -1) {
                setRowsExpanded([]);
            }
            else {
                setRowsExpanded([rowMeta.dataIndex])
            }
        }
    };


    return (
        <>
            <PopupWindow open={errorDialogOpen} handleClose={handleErrorDialogClose} error={error} clearError={setError} errors={errors} clearErrors={setErrors} />
            <CreateVenue handleDialogCreateVenueClose={handleDialogCreateVenueClose} dialogCreateVenueOpen={dialogCreateVenueOpen} triggerUpdate={triggerUpdate} />
            <MUIDataTable
                title={
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={{ marginTop: '15px' }, {marginLeft: '15px' }}>
                                    Lokaler
                            </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="medium"
                                    style={{ margin: '15px' }}
                                    onClick={handleDialogCreateVenueOpen}
                                >
                                    Nytt lokale
                            </Button>
                            </Grid>
                        </Grid>
                    </>
                }
                data={venueList}
                columns={columns}
                options={options}
            />
        </>
    );
}