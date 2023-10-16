
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import TwitterIcon from '@mui/icons-material/Twitter';

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary">
            {'Copyright © '}

            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default function StickyFooter() {
    return (
        <Box
            component="footer"
            sx={{
                height: '100px',
                pt: 3,
                pb: 10,
                px: 2,
                mt: 'auto',
                mb: 0,
                pl: { xs: '0px', sm: '200px' },
                textAlign: 'center',
                backgroundColor: '#E6E6E6',
            }}
        >
            <Container>
                <Link target="_blank" color="inherit" href="https://twitter.com/bestballexplore">
                    <TwitterIcon sx={{ lineHeight: 0, color: '#1DA1F2', fontSize: '30px' }} />
                </Link>
                <Typography fontSize={14} variant="body1" color="text.secondary">
                    Report bugs and request features on Twitter
                </Typography>
                {/* <Copyright /> */}
            </Container>
        </Box>
    );
}