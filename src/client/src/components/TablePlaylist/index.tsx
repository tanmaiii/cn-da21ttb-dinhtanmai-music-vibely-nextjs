"use client";

import playlistService from "@/services/playlist.service";
import { ISong } from "@/types";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "@hello-pangea/dnd";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { Track } from "../Track";
import styles from "./style.module.scss";

interface Props {
  data: ISong[];
  playlistId?: string;
  allowEdit?: boolean;
}

const TablePlaylist = (props: Props) => {
  const { data, playlistId, allowEdit } = props;
  const [items, setItems] = useState(data);
  const queryClient = useQueryClient();

  const mutationUpdatePlaylist = useMutation({
    mutationFn: async (songIds: string[]) => {
      if (playlistId) {
        await playlistService.updateSongs(playlistId, songIds);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:  ["playlist-song", playlistId],
      });
      toast.success("Reorder successfully");
    },
  });

  // Xử lý khi kéo thả
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

    // Cập nhật lại danh sách
    if (playlistId) {
      mutationUpdatePlaylist.mutate(updatedItems.map((item) => item.id));
    }

    setItems(updatedItems);
  };

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
                        isDragDisabled={!allowEdit}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                          >
                            <Track num={index + 1} song={item} />
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
