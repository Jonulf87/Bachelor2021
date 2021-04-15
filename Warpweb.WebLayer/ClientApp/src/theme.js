import { FormControl } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles'
import { BorderAll } from '@material-ui/icons';

const theme = createMuiTheme({
    palette: {
        type: 'light',
        primary: {
            main: '#B8292F',
        },
        secondary: {
            main: '#f50057',
        },
        divider: 'rgba(0,0,0,0.15)',
        background: {
            paper: '#F3F5F5',
        },
    },
    overrides: {
        MuiButton: {
            root: {
                textTransform: "none"
            }
        },
        MuiPaper: {
            root: {

            }
        },
        MUIDataTable: {
            root: {
                border: "none",
                backgroundColor: "#f00"
            },
            paper: {
                variant: "elevation",
                boxShadow: "none",
                borderWidth: "0px"

            }
        },
        MUIDataTableBodyCell: {
            root: {
                backgroundColor: "none",
                cursor: "pointer"
            }
        }
    },
    props: {
        MuiPaper: {
            variant: "outlined",
        },
        MUIDataTable: {
            elevation: 0,
        },
        MuiTextField: {
            variant: "outlined",
        }
    }
});

export default theme;