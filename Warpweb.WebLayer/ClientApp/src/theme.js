import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#484848',
            main: '#212121',
            dark: '#000000',
            contrastText: '#fff',
        },
        secondary: {
            light: '#ff7b47',
            main: '#e54819',
            dark: '#ab0300',
            contrastText: '#000',
        },
        background: {
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
            paper: {
                boxShadow: "none"
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
      }
    }
});

export default theme;