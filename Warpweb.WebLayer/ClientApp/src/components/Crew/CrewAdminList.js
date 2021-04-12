import { createMuiTheme, Grid, MuiThemeProvider, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MUIDataTable, { ExpandButton } from 'mui-datatables';
import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import CrewPermissions from './CrewPermissions';

export default function OrganizerAdminList({ triggerUpdate }) {

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
            if (expandedRows.data.length >= 1 && expandedRows.data.filter(d => d.dataIndex === dataIndex).length === 0) return false;
            return true;
        },
        renderExpandableRow: (rowData, rowMeta) => {
            return (
                <>
                    <TableRow>
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell colSpan={3}>
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
                        <TableCell colSpan={1}>
                        </TableCell>
                        <TableCell colSpan={3}>
                            <Typography variant="h6" >
                                Arbeidslag
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

                    <CrewPermissions crewId={rowData[0]} />
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