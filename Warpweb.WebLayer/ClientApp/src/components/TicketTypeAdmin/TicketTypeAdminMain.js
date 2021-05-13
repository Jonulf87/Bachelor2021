import { Typography, Button, Grid, CircularProgress } from '@material-ui/core';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import CreateTicketType from './CreateTicketType';
import TicketTypeAdminRowDetails from './TicketTypeAdminRowDetails';

export default function TicketTypeAdminMain() {

    const [ticketTypesList, setTicketTypesList] = useState([]);
    const [updateList, setUpdateList] = useState(false);
    const [dialogCreateTicketTypeOpen, setDialogCreateTicketTypeOpen] = useState(false);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    const handleDialogCreateTicketTypeOpen = () => {
        setDialogCreateTicketTypeOpen(true);
    };

    const handleDialogCreateTicketTypeClose = () => {
        setDialogCreateTicketTypeOpen(false);
    };

    useEffect(() => {
        const getTicketTypes = async () => {
            if (isAuthenticated) {

                const responseTicketType = await fetch('/api/tickettypes/tickettypes', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });

                if (responseTicketType.ok) {
                    const resultTicketType = await responseTicketType.json();
                    setTicketTypesList(resultTicketType);
                }
                else {
                    setTicketTypesList([]);
                }
                setIsLoading(false);
            }
        }
        getTicketTypes();
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
            name: 'descriptionName',
            label: 'Navn '
        },
        {
            name: 'basePrice',
            label: 'Grunnpris'
        },
        {
            name: 'amountAvailable',
            label: 'Totalt antall tilgjengelig'
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
                <TicketTypeAdminRowDetails rowData={rowData} rowMeta={rowMeta} updateListTrigger={triggerUpdate} />
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


    if (isLoading) {
        return (<CircularProgress />);
    };


    return (
        <>
            <CreateTicketType dialogOpen={dialogCreateTicketTypeOpen} handleDialogClose={handleDialogCreateTicketTypeClose} triggerUpdate={triggerUpdate} />
            <MUIDataTable
                title={<>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: "15px" }, { marginLeft: "15px" }}>
                                Billettyper
                        </Typography>
                        </Grid>
                        <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="medium"
                            style={{ margin: "15px" }}
                            onClick={handleDialogCreateTicketTypeOpen}
                        >
                                Ny billett-type
                        </Button>
                        </Grid>
                    </Grid>
                </>}
                data={ticketTypesList}
                columns={columns}
                options={options}
            />
        </>
    )
}