import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import MUIDataTable from 'mui-datatables';
import useAuth from '../../hooks/useAuth';
import PopupWindow from '../PopupWindow/PopupWindow';
import UserAdminRowDetails from './UserAdminRowDetails';

export default function UserAdminMain() {
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [getUsersIsReady, setGetUsersIsReady] = useState(false);
    const [userList, setUserList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [triggerUpdate, setTriggerUpdate] = useState(false);
    const { isAuthenticated, token, roles, isOrgAdmin } = useAuth();

    const updateList = () => {
        setTriggerUpdate((oldValue) => !oldValue);
    };

    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const getUsers = async () => {
            if (isAuthenticated) {
                const responsePolicies = await fetch('/api/security/policies', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'content-type': 'application/json',
                    },
                });
                const resultPolicies = await responsePolicies.json();
                setPolicies(resultPolicies);

                if (roles.some((a) => a === 'Admin')) {
                    const response = await fetch('/api/users/userslist', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setUserList(result);
                        setGetUsersIsReady(true);
                    } else if (response.status === 400) {
                        setUserList([]);
                        const errorsResult = await response.json();
                        setErrors(errorsResult);
                        setErrorDialogOpen(true);
                    } else {
                        setUserList([]);
                        const errorResult = await response.json();
                        setError(errorResult.message);
                        setErrorDialogOpen(true);
                    }
                } else if (isOrgAdmin || policies.some((a) => a === 4)) {
                    //Her skal kallet gå til kun organisasjonen
                    const response = await fetch('/api/users/userslist', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
                    if (response.ok) {
                        const result = await response.json();
                        setUserList(result);
                        setGetUsersIsReady(true);
                    } else if (response.status === 400) {
                        setUserList([]);
                        const errorsResult = await response.json();
                        setErrors(errorsResult);
                        setErrorDialogOpen(true);
                    } else if (response.status === 403) {
                        setUserList([]);
                        setError('Du har ikke tilgang!');
                        setErrorDialogOpen(true);
                    } else {
                        setUserList([]);
                        const errorResult = await response.json();
                        setError(errorResult.message);
                        setErrorDialogOpen(true);
                    }
                }
            }
        };
        getUsers();
    }, [isAuthenticated, triggerUpdate]);

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
            return (
                <UserAdminRowDetails
                    rowData={rowData}
                    rowMeta={rowMeta}
                    setError={setError}
                    setErrors={setErrors}
                    setErrorDialogOpen={setErrorDialogOpen}
                    updateList={updateList}
                />
            );
        },
        onRowClick: (rowData, rowMeta) => {
            if (rowsExpanded.indexOf(rowMeta.dataIndex) !== -1) {
                setRowsExpanded([]);
            } else {
                setRowsExpanded([rowMeta.dataIndex]);
            }
        },
    };

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
                                    Brukere
                                </Typography>
                            </Grid>
                        </Grid>
                    </>
                }
                data={userList}
                columns={columns}
                options={options}
            />
        </>
    );
}
