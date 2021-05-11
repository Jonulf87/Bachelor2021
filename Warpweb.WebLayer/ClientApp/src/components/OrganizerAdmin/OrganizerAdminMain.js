import { Button, CircularProgress, Grid, GridItem, Toolbar, Typography } from '@material-ui/core';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import OrganizerAdminRowDetails from './OrganizerAdminRowDetails';
import CreateOrganizer from './CreateOrganizer';

export default function OrganizerAdminMain() {

    const [organizerList, setOrganizerList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [dialogCreateOrganizerOpen, setDialogCreateOrganizerOpen] = useState(false);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    const handleDialogCreateOrganizerOpen = () => {
        setDialogCreateOrganizerOpen(true);
    };

    const handleDialogCreateOrganizerClose = () => {
        setDialogCreateOrganizerOpen(false);
    };


    useEffect(() => {
        const getOrganizers = async () => {
            if (isAuthenticated) {

                const responseOrganizers = await fetch('/api/tenants/gettenants', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });

                if (responseOrganizers.ok) {
                    const resultOrganizers = await responseOrganizers.json();
                    setOrganizerList(resultOrganizers);
                }
                else {
                    setOrganizerList([]);
                }
            }
        }
        getOrganizers();
    }, [isAuthenticated, updateList])



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
            label: 'Organisasjon'
        },
        {
            name: 'orgNumber',
            label: 'Orgnummer'
        },
        {
            name: 'description',
            label: 'Beskrivelse',
            options: {
                sort: false
            }
        }
    ];

    const options = {
        rowsExpanded: rowsExpanded,
        filter: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: "none",
        selectableRowsOnClick: false,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <OrganizerAdminRowDetails rowData={rowData} rowMeta={rowMeta} />
            );
        },
        onRowClick: (rowData, rowMeta) => {
            if (rowsExpanded.indexOf(rowMeta.dataIndex) !== -1) {
                setRowsExpanded([]);
            }
            else {
                setRowsExpanded([rowMeta.dataIndex]);
            }
        }
    };

    if (!organizerList) {
        return (<CircularProgress />);
    };

    return (
        <>
            <CreateOrganizer handleDialogCreateOrganizerClose={handleDialogCreateOrganizerClose} dialogCreateOrganizerOpen={dialogCreateOrganizerOpen} triggerUpdate={triggerUpdate} />
            <MUIDataTable
                title={<>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: '15px' }, {marginLeft: '15px' }}>
                                Organisasjoner
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                variant="contained"
                                color="primary"
                                size="medium"
                                style={{ margin: '15px' }}
                                onClick={handleDialogCreateOrganizerOpen}
                            >
                                Ny Organisasjon
                        </Button>
                        </Grid>
                    </Grid>
                </>}
                data={organizerList}
                columns={columns}
                options={options}
            />

        </>
    )
}