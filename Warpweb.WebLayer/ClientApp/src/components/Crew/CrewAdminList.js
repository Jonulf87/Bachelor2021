import { createMuiTheme, Grid, MuiThemeProvider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';

export default function OrganizerAdminList({ triggerUpdate }) {

    const useStyles = makeStyles((theme) => ({
        grid: {
            position: "static"
        }
    }
    ));

    const { isAuthenticated, token } = useAuth();

    const [crewList, setCrewList] = useState([]);
    const [membersList, setMembersList] = useState([]);



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
            label: 'Crew'
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
            if (expandedRows.data.length >= 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        //rowsExpanded: [0],
        renderExpandableRow: (rowData, rowMeta) => {



            return (
                <>
                    <TableRow>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell colSpan={3}>
                            <Typography variant="h4" >
                                Kontaktperson
                            </Typography>

                        </TableCell>
                    </TableRow>
                    <TableRow>

                        <TableCell colSpan={1}>
                        </TableCell>

                        <TableCell>
                            <Typography>Navn: </Typography>
                        </TableCell>

                        <TableCell colSpan={2}>
                            {membersList.name}
                        </TableCell>

                    </TableRow>

                    <TableRow >

                        <TableCell colSpan={1}>
                        </TableCell>

                        <TableCell>
                            <Typography>E-post: </Typography>
                        </TableCell>

                        <TableCell colSpan={2}>
                            {membersList.eMail}
                        </TableCell>

                    </TableRow>

                    <TableRow>

                        <TableCell colSpan={1}>
                        </TableCell>

                        <TableCell>
                            <Typography>Telefon: </Typography>
                        </TableCell>

                        <TableCell colSpan={2}>
                            {membersList.phone}
                        </TableCell>

                    </TableRow>

                    
                </>
            );
        },
        onRowExpansionChange: (curExpanded) => {

            const crewIdCurrentRow = crewList[curExpanded[0].dataIndex].id;
            
            const getContact = async () => {
                if (isAuthenticated) {
                    const response = await fetch(`/api/crews/crewmembers/${crewIdCurrentRow}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const result = await response.json();
                    setMembersList(result);
                }
            }
            getContact();

        }
        
    };


    if (!crewList) {
        return (<p>Loading...</p>);
    };


    return (
        <>

            <MUIDataTable
                title={"Crews"}
                data={crewList}
                columns={columns}
                options={options}
            //components={components}
            />

        </>
    )
}