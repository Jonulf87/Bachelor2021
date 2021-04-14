import { FormControl } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles'
import { BorderAll } from '@material-ui/icons';

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
              border: "none",
              backgroundColor:"#f00"
            },
            paper: {
                variant: "elevation",
                boxShadow: "none",
                borderWidth: "0px"
                
            }
        },
        MUIDataTableBodyCell: {
            root: {
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