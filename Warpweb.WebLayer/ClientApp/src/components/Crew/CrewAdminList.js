import { createMuiTheme, Grid, MuiThemeProvider, Table, TableBody, TableCell, TableRow, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import CrewPermissions from './CrewPermissions';

export default function OrganizerAdminList({ triggerUpdate, handleDialogOpen }) {

    const { isAuthenticated, token } = useAuth();

    const [crewList, setCrewList] = useState([]);
    const [crewLeader, setCrewLeader] = useState([])
    const [membersList, setMembersList] = useState([]);
    const [crewPermissions, setCrewPermissions] = useState([]);



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

    const addCrewMember = async (userId) => {

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
            label: 'Crew'
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
        viewColumns: false,
        sort: false,
        filter: false,
        filterType: 'dropdown',
        responsive: 'vertical',
        selectableRows: "none",
        selectableRowsOnClick: true,
        expandableRows: true,
        expandableRowsHeader: false,
        expandableRowsOnClick: true,
        isRowExpandable: (dataIndex, expandedRows) => {
            if (expandedRows.data.length >= 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <>
                    <TableRow>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                        </TableCell>
                        <TableCell colSpan={3} style={{ backgroundColor: "#becadb" }}>
                            <Typography variant="h6" >
                                Arbeidslagsleder
                            </Typography>

                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                Navn
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                E-post
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                Telefon
                            </Typography>
                        </TableCell>

                    </TableRow>

                    {crewLeader.map((leader) => (
                        <TableRow key={leader.id}>

                            <TableCell colSpan={1}>
                            </TableCell>

                            <TableCell colSpan={1}>
                                <Typography>{leader.name}</Typography>
                            </TableCell>

                            <TableCell colSpan={1}>
                                {leader.eMail}
                            </TableCell>

                            <TableCell colSpan={1}>
                                {leader.phone}
                            </TableCell>

                        </TableRow>

                    ))}

                    <TableRow>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                        </TableCell>
                        <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                            <Typography variant="h6" >
                                Arbeidslag
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                            <Button variant="contained" color="primary" onClick={handleDialogOpen}>Legg til medlem</Button>
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                Navn
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                E-post
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1}>
                            <Typography variant="subtitle1" >
                                Telefon
                            </Typography>
                        </TableCell>

                    </TableRow>

                    {membersList.map((member) => (
                        <TableRow key={member.id}>

                            <TableCell colSpan={1}>
                            </TableCell>

                            <TableCell colSpan={1}>
                                <Typography>{member.name} </Typography>
                            </TableCell>

                            <TableCell colSpan={1}>
                                {member.eMail}
                            </TableCell>

                            <TableCell colSpan={1}>
                                {member.phone}
                            </TableCell>

                        </TableRow>
                    ))}

                    <TableRow>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                        </TableCell>
                        <TableCell colSpan={3} style={{ backgroundColor: "#becadb" }}>
                            <Typography variant="h6" >
                                Rettigheter
                            </Typography>

                        </TableCell>
                    </TableRow>

                    <TableRow>

                        <TableCell colSpan={1}>
                        </TableCell>

                        <TableCell colSpan={2}>
                            <CrewPermissions crewId={rowData[0]} />
                        </TableCell>

                        <TableCell colSpan={1}>

                        </TableCell>

                    </TableRow>
                </>
            );
        },
        onRowExpansionChange: (curExpanded) => {

            const crewIdCurrentRow = crewList[curExpanded[0].dataIndex].id;

            const getCrewLeaderAndMembers = async () => {
                if (isAuthenticated) {
                    const responseCrew = await fetch(`/api/crews/crewmembers/${crewIdCurrentRow}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const resultCrew = await responseCrew.json();
                    setMembersList(resultCrew);

                    const responseLeader = await fetch(`/api/crews/crewleaders/${crewIdCurrentRow}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const resultLeader = await responseLeader.json();
                    setCrewLeader(resultLeader);
                }
            }

            getCrewLeaderAndMembers();
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