"use client";

import { usePlayer } from "@/context/PlayerContext";
import { useUI } from "@/context/UIContext";
import { songs } from "@/lib/data";
import { ISong } from "@/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useEffect, useState } from "react";
import { TrackShort } from "../Track";
import { ButtonIconRound } from "../ui/Button";
import styles from "./style.module.scss";

export const Waiting = () => {
  const { toggleWaiting, isWaitingOpen } = useUI();
  const { queue } = usePlayer();

  const [ready, setReady] = useState(false);
  // const waitingRef = React.useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<ISong[]>(songs);

  useEffect(() => {
    if (process.browser) {
      setReady(true);
    }
  }, []);

  const handleOnDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    // Nếu không có điểm đến (người dùng thả ngoài vùng droppable)
    if (!destination) return;

    // Nếu vị trí thả không thay đổi
    if (source.index === destination.index) return;

    // Tạo bản sao mới của danh sách và hoán đổi vị trí
    const updatedItems = [...items];
    const [reorderedItem] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, reorderedItem);

    setItems(updatedItems);
  };

  return (
    <div className={`${styles.Waiting} ${isWaitingOpen ? styles.open : ""}`}>
      <div className={`${styles.Waiting_header}`}>
        <h3>Waiting</h3>
        <ButtonIconRound
          onClick={toggleWaiting}
          icon={<i className="fa-solid fa-xmark"></i>}
        />
      </div>
      <div className={`${styles.Waiting_list}`}>
        {ready && (
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable direction="vertical" droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {queue &&
                    queue.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className={styles.Waiting_item}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <TrackShort song={item} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
};
