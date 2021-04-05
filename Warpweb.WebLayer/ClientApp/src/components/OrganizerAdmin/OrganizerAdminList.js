import { createMuiTheme, Grid, MuiThemeProvider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function OrganizerAdminList({ triggerUpdate }) {

    const { isAuthenticated, token } = useAuth();
    const [organizerDataList, setOrganizerDataList] = useState([]);
    const [organizerContact, setOrganizerContact] = useState("");
    //const classes = useStyles();

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
        console.log(organizerDataList);
    }, [isAuthenticated, triggerUpdate])

    const columns = [
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
        filter: true,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: "none",
        selectableRowsOnClick: true,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            //Må ha muithemeoverride for å fungere. se topp og warptag.
            //if (dataIndex === 3 || dataIndex === 4) return false;

            // Prevent expand/collapse of any row if there are 4 rows expanded already (but allow those already expanded to be collapsed)
            if (expandedRows.data.length >= 4 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        //rowsExpanded: [0],
        renderExpandableRow: (rowData, rowMeta) => {

            console.log(rowData);
            const getContact = async () => {
                if (isAuthenticated) {
                    const response = await fetch('/api/tenants/getcontact', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const result = await response.json();
                    console.log(result);
                    setOrganizerContact(result);
                }
            }
            getContact();

            console.log(organizerContact);
            return (
                <Grid
                    container
                    spacing={2}
                >
                    <Grid
                        item
                        xs={6}
                    >

                        <p><strong>Fullt navn:&nbsp;</strong>{organizerContact.firstName}&nbsp;{organizerContact.lastName}</p>


                        <p><strong>E-post:&nbsp;</strong>{organizerContact.eMail}</p>


                        <p><strong>Telefon:&nbsp;</strong>{organizerContact.phoneNumber}</p>

                    </Grid>
                    <Grid
                        item
                        xs={6}
                    >
                    </Grid>
                </Grid>

            );
        },
        onRowExpansionChange: () => {
        }
        //onRowExpansionChange: (curExpanded, allExpanded, rowsExpanded) => console.log(curExpanded, allExpanded, rowsExpanded)
    };

    //Koden under skjuler knappene for å utvide på index 3 og 4. Må ha MUI theme override og wrappes i det for å fungere.
    //const components = {
    //    ExpandButton: function (props) {
    //        if (props.dataIndex === 3 || props.dataIndex === 4) return <div style={{ width: '24px' }} />;
    //        return <ExpandButton {...props} />;
    //    }
    //};

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