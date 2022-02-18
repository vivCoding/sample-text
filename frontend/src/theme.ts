import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
    typography: {
        fontFamily: 'Roboto',
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                disableRipple: true,
            },
        },
        // MuiAppBar: {
        //     defaultProps: {
        //         backG
        //     }
        // }
    },
    palette: {
        mode: 'dark',
    },
});

export default theme;
