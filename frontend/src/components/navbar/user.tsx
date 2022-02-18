import {
    AppBar, Button, Container, Box, styled, createStyles,
} from '@mui/material';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import Link from '../common/Link'

const navBtnStyle = createStyles({
    color: 'white',
    mx: 2,
    py: 2,
})

const Navbar = (): JSX.Element => (
    <AppBar sx={{
        display: 'flex', flexDirection: 'row', justfiyContent: 'center', alignItems: 'center', px: 2,
    }}
    >
        <TextFieldsIcon fontSize="large" sx={{ mr: 2 }} />
    </AppBar>
)

export default Navbar
