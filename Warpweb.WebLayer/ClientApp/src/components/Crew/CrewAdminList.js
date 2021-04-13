import { createMuiTheme, Grid, MuiThemeProvider, Table, TableBody, TableCell, TableRow, Typography, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import UserPicker from '../User/UserPicker';
import CrewPermissions from './CrewPermissions';

export default function OrganizerAdminList() {

    const [crewList, setCrewList] = useState([]);
    const [openCrewId, setOpenCrewId] = useState("");
    const [crewLeaders, setCrewLeaders] = useState([]);
    const [membersList, setMembersList] = useState([]);
    const [dialogLeaderOpen, setDialogLeaderOpen] = useState(false);
    const [dialogMemberOpen, setDialogMemberOpen] = useState(false);


    const { isAuthenticated, token } = useAuth();

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
    }, [isAuthenticated])

    const getCrewLeadersAndMembers = async (crewId) => {
        if (isAuthenticated) {
            const responseCrew = await fetch(`/api/crews/crewmembers/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const resultCrew = await responseCrew.json();
            setMembersList(resultCrew);

            const responseLeader = await fetch(`/api/crews/crewleaders/${crewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const resultLeader = await responseLeader.json();
            setCrewLeaders(resultLeader);
        }
    }

    const addCrewLeader = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/crews/addcrewleader/${openCrewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            if (response.status !== 200) {
                return "Something went wrong"
            }
        }
    };


    const addCrewMember = async (userId) => {
        if (isAuthenticated) {
            const response = await fetch(`/api/crews/addcrewmember/${openCrewId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify(userId)
            });
            if (response.status !== 200) {
                return "Something went wrong"
            }
        }
    }

    const handleDialogLeaderOpen = () => {
        setDialogLeaderOpen(true);
    };

    const handleDialogLeaderClose = () => {
        setDialogLeaderOpen(false);
    };

    const handleDialogMemberOpen = () => {
        setDialogMemberOpen(true);
    };

    const handleDialogMemberClose = () => {
        setDialogMemberOpen(false);
    };

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
                    {setOpenCrewId(rowData[0])}
                    <TableRow>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                        </TableCell>
                        <TableCell colSpan={2} style={{ backgroundColor: "#becadb" }}>
                            <Typography variant="h6" >
                                Arbeidslagsleder
                            </Typography>
                        </TableCell>
                        <TableCell colSpan={1} style={{ backgroundColor: "#becadb" }}>
                            <Button variant="contained" color="primary" onClick={handleDialogLeaderOpen}>Velg arbeidslagleder</Button>
                            <UserPicker dialogOpen={dialogLeaderOpen} handleDialogClose={handleDialogLeaderClose} setUserId={addCrewLeader} />
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

                    {crewLeaders.map((leader) => (
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
                            <Button variant="contained" color="primary" onClick={handleDialogMemberOpen}>Legg til medlem</Button>
                            <UserPicker dialogOpen={dialogMemberOpen} handleDialogClose={handleDialogMemberClose} setUserId={addCrewMember} />
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

            getCrewLeadersAndMembers(crewList[curExpanded[0].dataIndex].id);
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