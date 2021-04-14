import { createMuiTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import OrganizerAdminRowDetails from './OrganizerAdminRowDetails';

export default function OrganizerAdminList({ triggerUpdate}) {

    const [organizerDataList, setOrganizerDataList] = useState([]);
    const [rowsExpanded, setRowsExpanded] = useState([]); //Håndterer selv åpning av rader. Tillater autocollaspe av forrige rad ved åpning av ny rad

    const { isAuthenticated, token } = useAuth();


    const useStyles = makeStyles((theme) => ({
        grid: {
            position: "static"
        }
    }
    ));
    const classes = useStyles();


    const theme = createMuiTheme({
        overrides: {
            MUIDataTableSelectCell: {
                expandDisabled: {
                    // Soft hide the button.
                    visibility: 'hidden',
                },
            },
        },
    });

    useEffect(() => {
        const getOrganizers = async () => {
            if (isAuthenticated) {

                const response = await fetch('/api/tenants/gettenants', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const result = await response.json();
                setOrganizerDataList(result);
            }
        }
        getOrganizers();
    }, [isAuthenticated, triggerUpdate])



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
            label: 'Beskrivelse'
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



    if (!organizerDataList) {
        return (<p>Loading...</p>);
    };


    return (
        <>

            <MUIDataTable
                title={"Organisasjoner"}
                data={organizerDataList}
                columns={columns}
                options={options}
            //components={components}
            />

        </>
    )
}