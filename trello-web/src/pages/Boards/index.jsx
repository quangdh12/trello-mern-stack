import { ArrowRight, Home, ListAlt, SpaceDashboard } from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    CardMedia,
    Container,
    Divider,
    Pagination,
    PaginationItem,
    Stack,
    styled,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import randomColor from 'randomcolor';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppBar from '~/components/AppBar/AppBar';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';
import SidebarCreateBoardModal from './create';
import { fetchBoardsAPI } from '~/apis';
import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants';

export const SidebarItem = styled(Box)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    padding: '12px 16px',
    borderRadius: '8px',
    '&:hover': {
        backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    },
    '&.active': {
        color: theme.palette.mode === 'dark' ? '#90caf9' : '#0c66e4',
        backgroundColor: theme.palette.mode === 'dark' ? '1A2027' : '#e9f2ff',
    },
}));

const Boards = () => {
    const [boards, setBoards] = useState([]);
    const [totalBoards, setTotalBoards] = useState(null);
    const location = useLocation();

    const query = new URLSearchParams(location.search);

    const page = parseInt(query.get('page') || '1', 10);

    const fetchBoards = (query) => {
        fetchBoardsAPI(query).then((res) => {
            setBoards(res.boards || []);
            setTotalBoards(res.totalBoards || 0);
        });
    };
    useEffect(() => {
        fetchBoards(location.search);
    }, [location.search]);

    if (!boards) {
        return <PageLoadingSpinner caption={'Loading Boards...'} />;
    }

    return (
        <Container disableGutters maxWidth={false}>
            <AppBar />
            <Box sx={{ paddingX: 2, my: 4 }}>
                <Grid container spacing={2}>
                    <Grid sx={12} sm={3}>
                        <Stack direction={'column'} spacing={1}>
                            <SidebarItem className="active">
                                <SpaceDashboard fontSize="small" />
                                Boards
                            </SidebarItem>
                            <SidebarItem className="active">
                                <ListAlt fontSize="small" />
                                Templates
                            </SidebarItem>
                            <SidebarItem className="active">
                                <Home fontSize="small" />
                                Home
                            </SidebarItem>
                        </Stack>
                        <Divider sx={{ my: 1 }} />
                        <Stack direction={'column'} spacing={1}>
                            <SidebarCreateBoardModal fetchBoards={fetchBoards} />
                        </Stack>
                    </Grid>

                    <Grid xs={12} sm={9}>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
                            Your boards:
                        </Typography>
                        {boards.length === 0 && (
                            <Typography variant="span" fontWeight={'bold'} mb={3}>
                                No result found!
                            </Typography>
                        )}
                        <Grid container spacing={2}>
                            {boards.map((board) => (
                                <Grid xs={4} sm={4} md={4} key={board._id}>
                                    <Card sx={{ width: '250px' }}>
                                        {/* <CardMedia
                                            component={'img'}
                                            height="100"
                                            image="https://picsum.photos/100"
                                        /> */}
                                        <Box
                                            sx={{ height: '50px', backgroundColor: randomColor() }}
                                        ></Box>
                                        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
                                            <Typography gutterBottom variant="h6" component={'div'}>
                                                {board?.title}
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                color={'text.secondary'}
                                                sx={{
                                                    overflow: 'hidden',
                                                    whiteSpace: 'nowrap',
                                                    textOverflow: 'ellipsis',
                                                }}
                                            >
                                                {board?.description}
                                            </Typography>
                                            <Box
                                                component={Link}
                                                to={`/boards/${board._id}`}
                                                sx={{
                                                    mt: 1,
                                                    display: 'flex',
                                                    justifyContent: 'flex-end',
                                                    alignItems: 'center',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        color: 'primary.light',
                                                    },
                                                }}
                                            >
                                                Go to board <ArrowRight fontSize="small" />
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>

                        <Box
                            sx={{
                                my: 3,
                                pr: 5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            {boards.length > 0 && (
                                <Pagination
                                    size="large"
                                    color="secondary"
                                    showFirstButton
                                    showLastButton
                                    count={Math.ceil(totalBoards / DEFAULT_ITEMS_PER_PAGE)}
                                    page={page}
                                    renderItem={(item) => (
                                        <PaginationItem
                                            component={Link}
                                            to={`/boards${
                                                item.page === DEFAULT_PAGE
                                                    ? ''
                                                    : `?page=${item.page}`
                                            }`}
                                            {...item}
                                        />
                                    )}
                                />
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Boards;
