import { FormControl } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles'
import { BorderAll } from '@material-ui/icons';

const theme = createMuiTheme({
    mixins: {
        toolbar: {
            minHeight: '40px'
        }
    },

    palette: {
        type: 'light',
        primary: {
            light: '#dce8ff',
            main: '#B8292F',
            dark: '#7786cc',
            contrastText: '#000',
        },
        secondary: {
            light: '#ff5983',
            main: '#f50057',
            dark: '#bb002f',
            contrastText: '#000',
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
            },
            paper: {
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