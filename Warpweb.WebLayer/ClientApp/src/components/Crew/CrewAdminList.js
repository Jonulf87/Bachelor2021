import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import CrewAdminRowDetails from './CrewAdminRowDetails';
import { Button, TextField } from '@material-ui/core';
import MUIDataTable from 'mui-datatables';

export default function OrganizerAdminList() {

    const [crewList, setCrewList] = useState([]);
    const [crewName, setCrewName] = useState("");
    const [updateList, setUpdateList] = useState(false);
    const [rowsExpanded, setRowsExpanded] = useState([]);

    const { isAuthenticated, token } = useAuth();

    const triggerUpdate = () => {
        setUpdateList(oldValue => !oldValue);
    }

    useEffect(() => {
        const getCrews = async () => {
            if (isAuthenticated) {

                const response = await fetch('/api/crews/allcrews', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setCrewList(result);
            }
        }

        getCrews();
    }, [isAuthenticated, updateList])

    const addCrew = async () => {
        if (isAuthenticated) {
            await fetch(`/api/crews/createcrew/${crewName}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST'
            });
            triggerUpdate();
        }
    }

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
            label: 'Arbeidslag'
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
        selectableRows: "none",
        selectableRowsOnClick: false,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: false,
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <CrewAdminRowDetails rowData={rowData} rowMeta={rowMeta} />
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


    if (!crewList) {
        return (<p>Loading...</p>);
    };

    return (
        <>
            <MUIDataTable
                title={<>
                    <TextField variant="outlined"
                        id="crewName"
                        label="Arbeidslag"
                        style={{ margin: 8 }}
                        required
                        value={crewName}
                        onChange={(e) => setCrewName(e.target.value)}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        style={{ margin: "15px" }}
                        onClick={addCrew}
                    >
                        Opprett arbeidslag
                    </Button>
                </>}
                data={crewList}
                columns={columns}
                options={options}
            />
        </>
    )
}