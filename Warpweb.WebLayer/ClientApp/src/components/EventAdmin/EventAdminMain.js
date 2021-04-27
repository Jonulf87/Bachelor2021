import { Grid, Typography, Button, Toolbar } from '@material-ui/core';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import CreateEvent from './CreateEvent';
import EventAdminRowDetails from './EventAdminRowDetails';

export default function EventAdminList() {

    const [eventList, setEventList] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [dialogCreateEventOpen, setDialogCreateEventOpen] = useState(false);
    const [rowsExpanded, setRowsExpanded] = useState([]);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    const handleDialogCreateEventOpen = () => {
        setDialogCreateEventOpen(true);
    };

    const handleDialogCreateEventClose = () => {
        setDialogCreateEventOpen(false);
    };

    useEffect(() => {
        const getEvents = async () => {
            if (isAuthenticated) {

                const response = await fetch('/api/events/orgadminmainevents', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const result = await response.json();
                    setEventList(result);
                }
                else {
                    setEventList([]);
                }
            }
        }

        getEvents();
    }, [isAuthenticated, updateList])



    const columns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                display: false,
                filter: false
            }
        },
        {
            name: 'name',
            label: ' '
        },
        {
            name: '',
            options: {
                filter: false
            }
        },
        {
            name: '',
            options: {
                filter: false
            }
        }
    ];

    const options = {
        rowsExpanded: rowsExpanded,
        viewColumns: false,
        sort: false,
        filter: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: 'none',
        selectableRowsOnClick: false,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <EventAdminRowDetails rowData={rowData} rowMeta={rowMeta} updateListTrigger={triggerUpdate} />
            )
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


    if (eventList.length === 0) {
        return (<p>Loading...</p>);
    };


    return (
        <>
            <CreateEvent dialogOpen={dialogCreateEventOpen} handleDialogClose={handleDialogCreateEventClose} triggerUpdate={triggerUpdate} />
            <MUIDataTable
                title={<>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: "15px" }, { marginLeft: '15px' }}>
                            Arrangementer
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            style={{ margin: "15px" }}
                            onClick={handleDialogCreateEventOpen}
                        >
                                Nytt arrangement
                        </Button>
                            </Grid>
                    </Grid>
                </>}
                data={eventList}
                columns={columns}
                options={options}
            />
        </>
    )
}