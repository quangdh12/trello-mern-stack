
import Box from '@mui/material/Box';
import Card from './Card/Card';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

function ListCard({ cards }) {

    return (
        <SortableContext
            items={cards?.map((card) => card._id)}
            strategy={verticalListSortingStrategy}>
            <Box
                sx={{
                    p: '0 5px 5px 5px',
                    m: '0 5px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    maxHeight: (theme) => `calc(
                        ${theme.trello.boardContentHeight} - 
                        ${theme.spacing(5)} - 
                        ${theme.trello.columnHeaderHeight} -
                        ${theme.trello.columnFooterHeight})`,
                    '&::-webkit-scrollbar': { width: '8px', height: '8px' },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#ced0da',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        backgroundColor: '#bfc2cf',
                    },
                    '&::-webkit-scrollbar-track': { m: 2 }
                }
                }
            >
                {cards?.map((card) => <Card
                    key={card._id}
                    card={card}
                   />)}
            </Box >
        </SortableContext>
    )
}

export default ListCard