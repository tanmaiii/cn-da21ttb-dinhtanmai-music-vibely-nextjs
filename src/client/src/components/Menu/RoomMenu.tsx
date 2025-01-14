import { useCustomToast } from "@/hooks/useToast";
import { paths } from "@/lib/constants";
import { RootState } from "@/lib/store";
import roomService from "@/services/room.service";
import { IRoom, RoomRequestDto } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { FormRoom } from "../Form";
import Modal, { ModalConfirm } from "../Modal";
import { ButtonIconRound } from "../ui";
import ItemMenu from "./ItemMenu";
import styles from "./style.module.scss";

interface Props {
  room: IRoom;
}

const RoomMenu = (props: Props) => {
  const { room } = props;
  const [openMenu, setOpenMenu] = useState(false);
  const currentUser = useSelector((state: RootState) => state.user);
  const { toastSuccess, toastError } = useCustomToast();
  const RoomMenuRef = useRef<HTMLDivElement>(null);
  const RoomMenuContentRef = useRef<HTMLDivElement>(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        RoomMenuRef.current &&
        !RoomMenuRef.current.contains(e.target as Node)
      ) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  });

  const mutationDelete = useMutation({
    mutationFn: async (room: IRoom) => {
      await roomService.delete(room.id);
      return room;
    },
    onSuccess: (room) => {
      setOpenMenu(false);
      setOpenDelete(false);
      router.back();
      toastSuccess("Delete room successfully");
      queryClient.invalidateQueries({ queryKey: ["room"] });
      queryClient.invalidateQueries({ queryKey: ["room", room.id] });
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: RoomRequestDto }) => {
      const res = await roomService.update(id, data);
      return res.data;
    },
    onSuccess: (room) => {
      toastSuccess("Update room success");
      setOpenMenu(false);
      queryClient.invalidateQueries({ queryKey: ["room"] });
      router.push(paths.ROOM + "/" + room.id);
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  if (!room) return null;

  return (
    <div ref={RoomMenuRef} className={`${styles.RoomMenu}`}>
      <ButtonIconRound
        onClick={() => setOpenMenu(!openMenu)}
        icon={<i className="fa-solid fa-ellipsis"></i>}
      />
      {openMenu && (
        <div ref={RoomMenuContentRef} className={`${styles.RoomMenu_context} `}>
          <div className={`${styles.RoomMenu_context_list} `}>
            {currentUser?.id === room?.creator.id && (
              <>
                <ItemMenu
                  icon={<i className="fa-regular fa-trash"></i>}
                  title="Delete room"
                  itemFunc={() => setOpenDelete(true)}
                />
                <ItemMenu
                  icon={<i className="fa-regular fa-pen"></i>}
                  title="Edit room"
                  itemFunc={() => setOpenEdit(true)}
                />
              </>
            )}
          </div>
          {openDelete && room && (
            <ModalConfirm
              show={openDelete}
              title="Delete room"
              content="Are you sure you want to delete this room?"
              onConfirm={() => room && mutationDelete.mutate(room)}
              onClose={() => setOpenDelete(false)}
            />
          )}
          {openEdit && room && (
            <Modal
              className={styles.modalSong}
              show={openEdit}
              onClose={() => setOpenEdit(false)}
            >
              <FormRoom
                initialData={room}
                onSubmit={(data) =>
                  room && mutationEdit.mutate({ id: room.id, data })
                }
                open={openEdit}
                onClose={() => setOpenEdit(false)}
              />
            </Modal>
          )}
        </div>
      )}
    </div>
  );
};

export default RoomMenu;
