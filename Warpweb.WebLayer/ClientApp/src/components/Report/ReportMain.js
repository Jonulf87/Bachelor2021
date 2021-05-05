import React, { useState, useEffect } from 'react';
import { Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@material-ui/core';
import { PDFDownloadLink } from '@react-pdf/renderer';
import UsersReport from './UsersReport';
import GendersReport from './GendersReport';
import AllergicsReport from './AllergicsReport';
import TicketTypesReport from './TicketTypesReport';
import useAuth from '../../hooks/useAuth';

export default function ReportMain() {

    const [userData, setUserData] = useState([]);
    const [genderData, setGenderData] = useState([]);
    const [allergicsData, setAllergicsData] = useState([]);
    const [ticketTypesData, setTicketTypesData] = useState([]);

    const { isAuthenticated, token } = useAuth();

    useEffect(() => {
        const getReports = async () => {
            if (isAuthenticated) {

                const responseUsers = await fetch('/api/users/userslist', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultUsers = await responseUsers.json();
                setUserData(resultUsers);

                const responseGender = await fetch('/api/reports/participantsgenderreport', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultGender = await responseGender.json();
                setGenderData(resultGender);

                const responseAllergics = await fetch('/api/reports/allergiesreport', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultAllergics = await responseAllergics.json();
                setAllergicsData(resultAllergics);

                const responseTicketTypes = await fetch('/api/reports/tickettypesreport', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': 'application/json'
                    }
                });
                const resultTicketTypes = await responseTicketTypes.json();
                setTicketTypesData(resultTicketTypes);
            }
        }
        getReports();

    }, [isAuthenticated]);

    return (
        <Paper>
            <TableContainer>
                <Grid container item xs={12}>
                    <Typography variant="h6" style={{ margin: '15px' }}>
                        Rapporter
                            </Typography>
                </Grid>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Rapport-type</TableCell>
                            <TableCell align="left">Last ned</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        <TableRow>
                            <TableCell align="left">
                                Bruker-rapport
                            </TableCell>
                            <TableCell align="left">

                                <PDFDownloadLink
                                    document={<UsersReport data={userData} />}
                                    fileName='Brukerrapport.pdf'
                                >
                                    {(blob, url, loading, error) => loading ? 'Generer brukerrapport...' : 'Last ned brukerrapport'}
                                </PDFDownloadLink>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left">
                                Kjønnsfordelings-rapport
                            </TableCell>
                            <TableCell align="left">
                                <PDFDownloadLink
                                    document={<GendersReport data={genderData} />}
                                    fileName='Kjonnsfordelingsrapport.pdf'
                                >
                                    {(blob, url, loading, error) => loading ? 'Generer kjønnsfordelingsrapport...' : 'Last ned kjønnsfordelingsrapport'}
                                </PDFDownloadLink>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left">
                                Allergiker-rapport
                            </TableCell>
                            <TableCell align="left">
                                <PDFDownloadLink
                                    document={<AllergicsReport data={allergicsData} />}
                                    fileName='Allergikerrapport.pdf'
                                >
                                    {(blob, url, loading, error) => loading ? 'Generer allergikerrapport...' : 'Last ned allergikerapport'}
                                </PDFDownloadLink>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell align="left">
                                Billett-rapport
                            </TableCell>
                            <TableCell align="left">
                                <PDFDownloadLink
                                    document={<TicketTypesReport data={ticketTypesData} />}
                                    fileName='Billettyperapport.pdf'
                                >
                                    {(blob, url, loading, error) => loading ? 'Generer billettyperapport...' : 'Last ned billettyperapport'}
                                </PDFDownloadLink>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}