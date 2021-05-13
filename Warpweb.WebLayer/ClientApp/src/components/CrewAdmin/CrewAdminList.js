import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import CrewAdminRowDetails from './CrewAdminRowDetails';
import { Button, TextField } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';
import { Check } from '@material-ui/icons';
import PopupWindow from '../PopupWindow/PopupWindow';

export default function CrewAdminList() {
    //Statevariabler for error popup vindu
    const [error, setError] = useState();
    const [errors, setErrors] = useState([]);
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    const [crewList, setCrewList] = useState([]);
    const [crewName, setCrewName] = useState('');
    const [crewNameError, setCrewNameError] = useState(false);
    const [crewNameErrorSpec, setCrewNameErrorSpec] = useState('');
    const [updateList, setUpdateList] = useState(false);
    const [rowsExpanded, setRowsExpanded] = useState([]);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList((oldValue) => !oldValue);
    };

    //Metode for error popup vindu
    const handleErrorDialogClose = () => {
        setErrorDialogOpen(false);
    };

    useEffect(() => {
        const checkCrewName = () => {
            if (crewList.some((a) => a.name === crewName)) {
                setCrewNameError(true);
                setCrewNameErrorSpec('Du kan ikke bruke samme navn som et annet arbeidslag');
            } else {
                setCrewNameError(false);
                setCrewNameErrorSpec('');
            }
        };
        checkCrewName();
    }, [crewName]);

    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {
                const response = await fetch('/api/crews/allcrews', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const result = await response.json();
                    setCrewList(result);
                } else if (response.status === 400) {
                    const errorResult = await response.json();
                    setErrors(errorResult.errors);
                    setErrorDialogOpen(true);
                } else {
                    const errorResult = await response.json();
                    setError(errorResult.message);
                    setErrorDialogOpen(true);
                }
            }
        };

        getCrews();
    }, [isAuthenticated, updateList]);

    const addCrew = async () => {
        if (isAuthenticated && crewName !== '') {
            const response = await fetch(`/api/crews/createcrew/${crewName}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'content-type': 'application/json',
                },
                method: 'POST',
            });
            if (response.ok) {
                triggerUpdate();
            } else if (response.status === 400) {
                const errorResult = await response.json();
                setErrors(errorResult.errors);
                setErrorDialogOpen(true);
            } else {
                const errorResult = await response.json();
                setError(errorResult.message);
                setErrorDialogOpen(true);
            }
        }
    };

    const columns = [
        {
            name: 'id',
            label: 'Id',
            options: {
                display: false,
                filter: false,
            },
        },
        {
            name: 'name',
            label: 'Arbeidslag',
        },
        {
            name: '',
            options: {
                filter: false,
            },
        },
        {
            name: '',
            options: {
                filter: false,
            },
        },
        {
            name: '',
            options: {
                filter: false,
            },
        },
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
            return <CrewAdminRowDetails rowData={rowData} rowMeta={rowMeta} />;
        },
        onRowClick: (rowData, rowMeta) => {
            if (rowsExpanded.indexOf(rowMeta.dataIndex) !== -1) {
                setRowsExpanded([]);
            } else {
                setRowsExpanded([rowMeta.dataIndex]);
            }
        },
    };

    if (!crewList) {
        return <p>Loading...</p>;
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
                        <TextField
                            name="crewName"
                            label="Arbeidslag"
                            style={{ margin: 8 }}
                            required
                            value={crewName}
                            onChange={(e) => setCrewName(e.target.value)}
                            error={crewNameError}
                            helperText={crewNameErrorSpec}
                        />

                        <Button variant="contained" color="primary" size="large" style={{ margin: '15px' }} onClick={addCrew}>
                            Opprett arbeidslag
                        </Button>
                    </>
                }
                data={crewList}
                columns={columns}
                options={options}
            />
        </>
    );
}
