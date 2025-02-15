import HomeIcon from '@mui/icons-material/Home';
import { Box, Button, SvgIcon, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { ReactComponent as AstronautSVG } from '~/assets/404/astronaut.svg'
import { ReactComponent as PlanetSVG } from '~/assets/404/planet.svg'

const NotFound = () => {
    return (<Box sx={{
        bgcolor: '#25344C',
        color: 'white',
        height: '100vh',
    }}>
        <Box sx={{
            '@keyframes stars': {
                '0%': { backgroundPosition: '-100% 100%' },
                '100%': { backgroundPosition: '0 0' }
            },
            animation: 'starts 12s linear infinite alternate',
            width: '100%',
            // backgroundImage: 'url("src/assets/404/particles.png")',
            backgroundSize: 'contain',
            backgroundRepeat: 'repeat',
            backgroundPosition: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Typography variant="h1" sx={{ fontSize: '100px', fontWeight: 800 }}>404</Typography>
            <Typography sx={{ fontSize: '18px !important', lineHeight: '25px', fontWeight: 400, maxWidth: '350px', textAlign: 'center' }}>
                LOST IN&nbsp;
                <Typography variant="span" sx={{
                    position: 'relative',
                    '&:after': {
                        position: 'absolute',
                        content: '""',
                        borderBottom: '3px solid #fdba26',
                        left: 0,
                        top: '43%',
                        width: '100%'
                    }
                }}>
                    &nbsp;SPACE&nbsp;
                </Typography>
                &nbsp;<Typography variant="span" sx={{ color: '#fdba26', fontWeight: 500 }}>GD</Typography>?<br />Hmm, looks like that page doesn&apos;t exist.
            </Typography>
            <Box sx={{ width: '320px', height: '320px', position: 'relative' }}>
                <SvgIcon
                    component={AstronautSVG} inheritViewBox sx={{
                        width: '50px', height: '50px', position: 'absolute', top: '20px', right: '25px', '@keyframes spinAround': {
                            from: { transform: 'rotate(0deg)' },
                            to: { transform: 'rotate(360deg)' }
                        },
                        animation: 'spinAround 5s linear 0s infinite'
                    }}
                />
                <PlanetSVG />
            </Box>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <Button variant="outlined" startIcon={<HomeIcon />} sx={{
                    display: 'flex', alignItems: 'center', color: 'white', borderColor: 'white', '&:hover': {
                        color: '#fdba26', borderColor: '#fdba26'
                    }
                }}>Go Home</Button>
            </Link>
        </Box>
    </Box>);
}

export default NotFound;