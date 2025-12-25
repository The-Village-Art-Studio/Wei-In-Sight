import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/**
 * A reusable drag-and-drop list component.
 * @param {Object} props
 * @param {Array} props.items - Array of items to render
 * @param {Function} props.onReorder - Callback when items are reordered (receives new array)
 * @param {Function} props.renderItem - Function to render each item (receives item, provided, snapshot)
 * @param {string} props.droppableId - Unique ID for the droppable area
 */
const DraggableList = ({ items, onReorder, renderItem, droppableId = 'droppable-list' }) => {
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(items);
        const [removed] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, removed);

        onReorder(reorderedItems);
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.map((item, index) => (
                            <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                            >
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                            ...provided.draggableProps.style,
                                            opacity: snapshot.isDragging ? 0.8 : 1,
                                            background: snapshot.isDragging ? 'rgba(255,255,255,0.1)' : 'transparent',
                                            borderRadius: '8px'
                                        }}
                                    >
                                        {renderItem(item, provided, snapshot)}
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};

export default DraggableList;
