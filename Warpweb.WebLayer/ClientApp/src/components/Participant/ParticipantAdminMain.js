import React, { useEffect, useState } from 'react';
import { Typography, Grid, CircularProgress } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';
import ParticipantAdminRowDetails from './ParticipantAdminRowDetails';

export default function ParticipantAdminMain() {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [getParticipantsIsReady, setGetParticipantsIsReady] = useState(false);
    const [participantsList, setParticipantsList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const { isAuthenticated, token } = useAuth();


    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getParticipants = async () => {
            if (isAuthenticated) {
                const responseParticipants = await fetch(`/api/users/participantslist`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                if (responseParticipants.ok) {
                    const resultParticipants = await responseParticipants.json();
                    setParticipantsList(resultParticipants);
                    setIsLoading(false);
                    setGetParticipantsIsReady(true);
                } else if (responseParticipants === 400) {
                    setParticipantsList([]);
                    const errorsResult = await responseParticipants.json();
                    setErrors(errorsResult);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await responseParticipants.json();
                    setError(errorResult.message);
                    setParticipantsList([]);
                    setErrorDialogOpen(true);
                }
            }
        };
        getParticipants();
    }, [isAuthenticated]);

    const columns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                display: false,
            },
        },
        {
            name: 'firstName',
            label: 'Fornavn',
        },
        {
            name: 'lastName',
            label: 'Etternavn',
        },
        {
            name: 'userName',
            label: 'Brukernavn',
        },
        {
            name: 'phoneNumber',
            label: 'Telefon',
        },
        {
            name: 'eMail',
            label: 'E-post',
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
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        setRowProps: (row, dataIndex, rowIndex) => {
            if (rowsExpanded.includes(dataIndex)) {
                return {
                    className: 'expandedRow',
                };
            }
            return null;
        },
        renderExpandableRow: (rowData, rowMeta) => {
            return
            <ParticipantAdminRowDetails
                rowData={rowData}
                rowMeta={rowMeta}
                setError={setError}
                setErrors={setErrors}
                setErrorDialogOpen={setErrorDialogOpen}
            />;
        },
        onRowClick: (rowData, rowMeta) => {
            if (rowsExpanded.indexOf(rowMeta.dataIndex) !== -1) {
                setRowsExpanded([]);
            } else {
                setRowsExpanded([rowMeta.dataIndex]);
            }
        },
    };

    if (isLoading) {
        return <CircularProgress />;
    }

    return (
        <>
            <PopupWindow
                open={errorDialogOpen}
                handleClose={handleErrorDialogClose}
                error={error}
                clearError={setError}
                errors={errors}
                clearErrors={setErrors}
            />
            <MUIDataTable
                title={
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Typography variant="h6" style={({ marginTop: '15px' }, { marginLeft: '15px' })}>
                                    Deltakere
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                }
                data={participantsList}
                columns={columns}
                options={options}
            />
        </>
    );
}
