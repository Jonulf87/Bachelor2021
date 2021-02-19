import React from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) =>
    createStyles({
        root: {
            maxWidth: 450,
        },
    }),
);

function createData(date, description, type, seat) {
    return { date, description, type, seat };
}

const rows = [
    createData('08.08.2021', 'WarpZone', 'Standard', 124),
    createData('01.10.2021', 'WrapZone', 'Standard', 52),
    createData('15.10.2021', 'WarPonez', 'VIP', 12),
    createData('11.11.2021', 'ZapWrones', 'Gull', 34),
];

export default function UserTicketCard() {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Typography gutterBottom variant="h5" component="h2">
                Billetter
                    </Typography>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell align="left">Dato</TableCell>
                        <TableCell align="left">Arrangement</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Plassnr.</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                            <TableCell align="left">{row.date}</TableCell>
                            <TableCell align="left">{row.description}</TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                            <TableCell align="left">{row.seat}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

