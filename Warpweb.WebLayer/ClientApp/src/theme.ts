import { createTheme } from '@mui/material/styles';

/* Prøvde med bakgrunnsfargen fra Warpzone.no: https://imagecolorpicker.com/color-code/3a4557 */

const theme = createTheme({
    mixins: {
        toolbar: {
            minHeight: '40px',
        },
    },

    palette: {
        mode: 'light',
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
            secondary: 'rgba(0,0,0,0.60)',
        },
    },
    components: {
        MuiPaper: {
            defaultProps: {
                variant: 'elevation',
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                },
            },
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    background: '#fff',
                },
            },
        },
    },
});

export default theme;
