import Box from '@mui/material/Box';
import { useCallback, useEffect, useRef, useState } from 'react';
import ListColumn from './ListColumn/ListColumn';

import {
    DndContext,
    DragOverlay,
    closestCorners,
    defaultDropAnimationSideEffects,
    getFirstCollision,
    pointerWithin,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { cloneDeep, isEmpty } from 'lodash';
import { MouseSensor, TouchSensor } from '~/customLibs/DndKitSensors';
import { generatePlaceholderCard } from '~/utils/formatters';
import Column from './ListColumn/Column/Column';
import Card from './ListColumn/Column/ListCard/Card/Card';

const ACTIVE_DRAG_ITEM_TYPE = {
    COLUMN: 'column',
    CARD: 'card'
}

function BoardContent({ board, moveColumns, moveCardInTheSameColumn, moveCartToDifferentColumn, updateTitleCard }) {

    const [orderedColumns, setOrderedColumns] = useState([]);

    const [activeDraggingCardId, setActiveDraggingCardId] = useState(null);
    const [activeDragItemType, setActiveDragItemType] = useState(null);
    const [activeDragItemData, setActiveDragItemData] = useState(null);
    const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null);

    const lastOverId = useRef(null);

    // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
    const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
    const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
    const sensors = useSensors(mouseSensor, touchSensor);

    useEffect(() => {
        setOrderedColumns(board.columns);
    }, [board])

    const findColumnByCardId = (cardId) => {
        return orderedColumns.find(column => (column?.cards?.find(card => card._id === cardId)))
    }

    const handleMoveCardBetweenDifferentColumns = (
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardData,
        triggerFrom
    ) => {
        setOrderedColumns((prevColumns) => {
            const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);

            let newCardIndex;
            const isBelowOverItem = active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height;
            const modifier = isBelowOverItem ? 1 : 0;
            newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1;

            const nextColumns = cloneDeep(prevColumns);
            const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id);
            const nextOverColumn = nextColumns.find(column => column._id === overColumn._id);

            // handle dragged column
            if (nextActiveColumn) {
                // remove card from active column (dragged column) and update cardOrderIds
                nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId);

                // if dragged column haven't card, create placeholder card
                if (isEmpty(nextActiveColumn.cards)) {
                    nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)];
                }

                nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id);
            }

            // handle dropped column
            if (nextOverColumn) {
                // check if dragging card is exist in overColumn, remove it
                nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId);

                // update columnId in activeDraggingCardData
                const update_activeDraggingCardData = {
                    ...activeDraggingCardData,
                    columnId: nextOverColumn._id
                };

                // update overColumn and cardOrderIds
                nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, update_activeDraggingCardData)

                // if column have placeholder card, remove it
                nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard);

                nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id);
            }

            if (triggerFrom === 'handleDragEnd') {
                moveCartToDifferentColumn(activeDraggingCardId, oldColumnWhenDraggingCard._id, nextOverColumn._id, nextColumns)
            }

            return nextColumns;
        })
    }

    const handleDragStart = (event) => {
        setActiveDraggingCardId(event?.active?.id);
        setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN);
        setActiveDragItemData(event?.active?.data?.current);

        if (event?.active?.data?.current?.columnId) {
            setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id));
        }
    }

    const handleDragOver = (event) => {
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return;
        }

        const { active, over } = event;
        if (!active || !over) return;

        const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
        const { id: overCardId } = over;

        const activeColumn = findColumnByCardId(activeDraggingCardId);
        const overColumn = findColumnByCardId(overCardId);

        if (!activeColumn || !overColumn) return;

        // handle drag card in different column
        if (activeColumn._id !== overColumn._id) {
            handleMoveCardBetweenDifferentColumns(overColumn, overCardId, active,
                over, activeColumn, activeDraggingCardData, 'handleDragOver');
        }
    }

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!active || !over) return;

        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
            const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
            const { id: overCardId } = over;

            const activeColumn = findColumnByCardId(activeDraggingCardId);
            const overColumn = findColumnByCardId(overCardId);

            if (!activeColumn || !overColumn) return;

            // handle drag card in different column
            if (oldColumnWhenDraggingCard._id !== overColumn._id) {
                handleMoveCardBetweenDifferentColumns(overColumn, overCardId, active, over,
                    activeColumn, activeDraggingCardData, 'handleDragEnd');
            } else { // handle drag card in same column
                const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(card => card._id === activeDraggingCardId);
                const newCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId);

                const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex);

                const dndOrderedCardIds = dndOrderedCards.map(card => card._id);

                setOrderedColumns((prevColumns) => {
                    const nextColumns = cloneDeep(prevColumns);

                    const targetColumn = nextColumns.find(column => column._id === overColumn._id)

                    // update card and cardOrderIds in targetColumn
                    targetColumn.cards = dndOrderedCards;
                    targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id);

                    return nextColumns;
                })

                moveCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id);
            }
        }

        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            if (active.id !== over.id) {
                const oldColumnIndex = orderedColumns.findIndex(c => c._id == active.id);
                const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id);
                const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex);

                setOrderedColumns(dndOrderedColumns);

                moveColumns(dndOrderedColumns);
            }
        }

        setActiveDraggingCardId(null);
        setActiveDragItemType(null);
        setActiveDragItemData(null);
        setOldColumnWhenDraggingCard(null);
    }

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.5' } } }),
    }

    // fix bug: flickering when drag card between column
    const collisionDetectionStrategy = useCallback((args) => {
        if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
            return closestCorners({ ...args });
        }

        const pointerIntersections = pointerWithin(args);

        // if drag to space not in column, return
        if (!pointerIntersections?.length) return;

        // const intersections = pointerIntersections?.length > 0 ?
        //     pointerIntersections :
        //     rectIntersection(args);

        let overId = getFirstCollision(pointerIntersections, 'id');
        if (overId) {
            const targetColumn = orderedColumns.find(column => column._id === overId);

            // get cardId instead of columnId if have
            if (targetColumn) {
                overId = closestCorners({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        container => (container.id !== overId &&
                            (targetColumn?.cardOrderIds?.includes(container.id))
                        ))
                })[0]?.id;
            }

            lastOverId.current = overId;
            return [{ id: overId }];
        }

        return lastOverId.current ? [{ id: lastOverId.current }] : [];
    }, [activeDragItemType, orderedColumns])

    return (
        <DndContext
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            sensors={sensors}
            collisionDetection={collisionDetectionStrategy}
        >
            <Box sx={{
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#565656' : '#0055c5'),
                width: '100%',
                height: (theme) => theme.trello.boardContentHeight,
                p: '10px 0'
            }}>
                <ListColumn
                    columns={orderedColumns}
                    updateTitleCard={updateTitleCard}
                />
                <DragOverlay dropAnimation={dropAnimation}>
                    {!activeDragItemType && null}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
                    {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
                </DragOverlay>
            </Box>
        </DndContext>

    )
}

export default BoardContent