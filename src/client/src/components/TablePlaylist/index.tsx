"use client";

import { ISong } from "@/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import styles from "./style.module.scss";

interface Props {
  data: ISong[];
  renderItem: (item: ISong, index: number) => React.ReactNode; // Thêm prop renderItem
  onChange?: (items: ISong[]) => void;
}

const TablePlaylist = (props: Props) => {
  const { data, onChange, renderItem } = props;
  const [items, setItems] = useState(data);

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination || source.index === destination.index) return;

    const updatedItems = [...items];
    const [reorderedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, reorderedItem);

    if (onChange) {
      onChange(updatedItems);
    }

    setItems(updatedItems);
  };

  useEffect(() => {
    if(data) {
      setItems(data);
    }
  }, [data])

  return (
    <div className={`${styles.TablePlaylist}`}>
      <div className={`${styles.TablePlaylist_swapper}`}>
        <div
          className={`${styles.TablePlaylist_swapper_header} row no-gutters`}
        >
          <div
            className={`${styles.TablePlaylist_swapper_header_line} col pc-6 m-8`}
          >
            <span className="count">#</span>
            <span className="title">Title</span>
          </div>
          <div
            className={`${styles.TablePlaylist_swapper_header_line} col pc-2 m-0`}
          >
            <span>Date Add</span>
          </div>
          <div
            className={`${styles.TablePlaylist_swapper_header_line} col pc-2 t-2 m-0`}
          >
            <span>Listen</span>
          </div>
          <div
            className={`${styles.TablePlaylist_swapper_header_line} col pc-2 t-2 m-4`}
          >
            <span>Time</span>
          </div>
        </div>
        <div className={`${styles.TablePlaylist_swapper_body}`}>
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable direction="vertical" droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {items &&
                    items.map((item, index) => (
                      <Draggable
                        key={item?.id}
                        draggableId={item?.id}
                        index={index}
                        isDragDisabled={onChange ? false : true}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            {renderItem(item, index)} {/* Gọi renderItem */}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
};

export default TablePlaylist;
