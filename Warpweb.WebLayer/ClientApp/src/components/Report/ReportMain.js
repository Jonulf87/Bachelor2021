import React, { useState, useEffect } from 'react';
import { Table, TableRow, TableCell, TableContainer, Paper, TableHead, TableBody } from '@material-ui/core';
import { PDFDownloadLink, Document, Page, View, Text } from '@react-pdf/renderer';
import UsersReport from './UsersReport';

export default function ReportMain() {

    const userReport =
        <Document>
            <Page>
                <View >
                    <Text>
                        Some random Text
                    </Text>
                    {/*<UsersReport />*/}
                </View>
            </Page>
        </Document>

    return (
        <Paper>
            <TableContainer>
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
                                <PDFDownloadLink document={<userReport />} fileName="somename.pdf">
                                        Last ned
                                </PDFDownloadLink>
                            </TableCell>
                        </TableRow>

                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>

    );
}