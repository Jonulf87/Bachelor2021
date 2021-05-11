import { Typography, Grid, CircularProgress } from '@material-ui/core';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';
import ParticipantAdminRowDetails from './ParticipantAdminRowDetails';

export default function ParticipantAdminMain() {

    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [participantList, setParticipantList] = useState([]);
    const [updateList, setUpdateList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    }

    useEffect(() => {
        const getParticipants = async () => {
            if (isAuthenticated) {

                const responseParticipants = await fetch(`/api/users/participantslist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                if (responseParticipants.ok) {
                    const resultParticipants = await responseParticipants.json();
                    setParticipantList(resultParticipants);
                    setIsLoading(false);
                }
                else {
                    const errorResult = await responseParticipants.json();
                    setError(errorResult.message);
                    setParticipantList([]);
                    setErrorDialogOpen(true);
                }
            }
        }
        getParticipants();
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
            name: 'firstName',
            label: 'Fornavn '
        },
        {
            name: 'lastName',
            label: 'Etternavn'
        },
        {
            name: 'userName',
            label: 'Brukernavn'
        },
        {
            name: 'eMail',
            label: 'Epost'
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
                <ParticipantAdminRowDetails rowData={rowData} rowMeta={rowMeta} updateListTrigger={triggerUpdate} />
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
            <PopupWindow open={errorDialogOpen} handleClose={handleErrorDialogClose} error={error} clearError={setError} errors={errors} clearErrors={setErrors} />
            <MUIDataTable
                title={<>
                    <Grid container>
                        <Grid item xs={12}>
                            <Typography variant="h6" style={{ marginTop: "15px" }, { marginLeft: "15px" }}>
                                Deltakere
                        </Typography>
                        </Grid>
                    </Grid>
                </>}
                data={participantList}
                columns={columns}
                options={options}
            />
        </>

    );
}