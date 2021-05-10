
import { createMuiTheme } from '@material-ui/core/styles'

/* Prøvde med bakgrunnsfargen fra Warpzone.no: https://imagecolorpicker.com/color-code/3a4557 */

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
            main: '#3a4557',
            /*main: '#B8292F',*/
            dark: '#7786cc',
            contrastText: '#FFF',
            /*contrastText: '#000',*/
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
        text: {
            secondary: 'rgba(0,0,0,0.60)'
        }
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
        },
        MUIDataTableBodyCell: {
            root: {
                backgroundColor: "none",
                cursor: "pointer"
            }
        },
        MuiInputBase: {
            root: {
                background: "#fff",
            }
        }
    },
    props: {
        MuiPaper: {
            variant: "elevation",
        },
        MUIDataTable: {
        },
        MuiTextField: {
            variant: "outlined",
        },
        MuiFormControl: {
            variant: "outlined",
        }
    }
});

export default theme;