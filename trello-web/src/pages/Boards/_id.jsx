// BOARD DETAILS
import Container from '@mui/material/Container';
import { cloneDeep } from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
    moveCartToDifferentColumnAPI,
    updateBoardDetailsAPI,
    updateColumnDetailsAPI
} from '~/apis';
import AppBar from '~/components/AppBar/AppBar';
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner';
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard';
import {
    fetchBoardDetailsAPI,
    selectCurrentActiveBoard,
    updateCurrentActiveBoard,
} from '~/redux/activeBoard/activeBoardSlice';
import BoardBar from './BoardBar/BoardBar';
import BoardContent from './BoardContent/BoardContent';

function Board() {
    const dispatch = useDispatch();
    const board = useSelector(selectCurrentActiveBoard);

    const { boardId } = useParams();

    useEffect(() => {
        // const boardId = '67aa696306d04128739c7eff';

        dispatch(fetchBoardDetailsAPI(boardId));
    }, [dispatch, boardId]);

    // FLow when to call API: Update state -> Call API
    const moveColumns = async (dndOrderedColumns) => {
        // Update state
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        dispatch(updateCurrentActiveBoard(newBoard));

        // call api
        updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds });
    };

    const moveCardInTheSameColumn = async (dndOrderedCards, dndOrderedCardIds, columnId) => {
        const newBoard = cloneDeep(board);
        const columnToUpdate = newBoard.columns.find((column) => column._id === columnId);
        if (columnToUpdate) {
            columnToUpdate.cards = dndOrderedCards;
            columnToUpdate.cardOrderIds = dndOrderedCardIds;
        }
        dispatch(updateCurrentActiveBoard(newBoard));

        await updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds });
    };

    const moveCartToDifferentColumn = async (
        currentCardId,
        prevColumnId,
        nextColumnId,
        dndOrderedColumns
    ) => {
        const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id);
        const newBoard = { ...board };
        newBoard.columns = dndOrderedColumns;
        newBoard.columnOrderIds = dndOrderedColumnsIds;
        dispatch(updateCurrentActiveBoard(newBoard));

        // Call API
        let prevCardOrderIds = dndOrderedColumns.find(
            (card) => card._id === prevColumnId
        )?.cardOrderIds;
        if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = [];

        moveCartToDifferentColumnAPI({
            currentCardId,
            prevColumnId,
            prevCardOrderIds,
            nextColumnId,
            nextCardOrderIds: dndOrderedColumns.find((card) => card._id === nextColumnId)
                ?.cardOrderIds,
        });
    };

    if (!board) {
        return <PageLoadingSpinner caption={'Loading Board...'} />;
    }

    return (
        <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
            <ActiveCard />

            <AppBar />
            <BoardBar board={board} />
            <BoardContent
                board={board}
                moveColumns={moveColumns}
                moveCardInTheSameColumn={moveCardInTheSameColumn}
                moveCartToDifferentColumn={moveCartToDifferentColumn}
            />
        </Container>
    );
}

export default Board;
