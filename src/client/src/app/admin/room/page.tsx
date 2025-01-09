"use client";
import { Dropdown, FormPlaylist, FormRoom } from "@/components/Form";
import Modal, { ModalConfirm } from "@/components/Modal";
import Table from "@/components/Table";
import LoadingTable from "@/components/Table/loading";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/useToast";
import { IMAGES, paths } from "@/lib/constants";
import { apiImage, formatDateTime, formatNumber } from "@/lib/utils";
import playlistService from "@/services/playlist.service";
import {
  IPlaylist,
  IRoom,
  ISort,
  PlaylistRequestDto,
  RoomRequestDto,
} from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import styles from "./style.module.scss";
import roomService from "@/services/room.service";
import { fa } from "@faker-js/faker";

const DataSort: { label: string; value: string }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Popular", value: "mostLikes" },
];

const columns = [
  { header: "Song", accessor: "song" },
  { header: "Created at", accessor: "createdAt" },
  { header: "Public", accessor: "public" },
  { header: "Songs", accessor: "songs" },
  { header: "Member", accessor: "member" },
  { header: "Actions", accessor: "actions" },
];

type IRow = {
  item: IRoom;
  onEdit: (item: IRoom) => void;
  onDelete: (item: IRoom) => void;
};

const renderRow = ({ item, onDelete, onEdit }: IRow) => {
  return (
    <>
      <td className={styles.col_1}>
        <div className={styles.image}>
          <Image
            src={item.imagePath ? apiImage(item.imagePath) : IMAGES.PLAYLIST}
            alt={item.title}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <Link href={`${paths.ROOM}/${item.id}`}>
            <h6>{item.title}</h6>
          </Link>
          <Link href={`${paths.ROOM}/${item.creator.slug}`}>
            <span>{item.creator.name}</span>
          </Link>
        </div>
      </td>
      <td>
        <div>{formatDateTime(new Date(item?.createdAt)).dateTime}</div>
      </td>
      <td>
        {item.public ? (
          <i className="fa-sharp fa-light fa-globe"></i>
        ) : (
          <i className="fa-regular fa-lock"></i>
        )}
      </td>
      <td>{formatNumber(item.songsCount)}</td>
      <td>{formatNumber(item.membersCount)}</td>
      <td>
        <ButtonIconSquare
          className={`pl-2`}
          onClick={() => onEdit(item)}
          size="small"
          icon={<i className="fa-light fa-pencil"></i>}
        />
        <ButtonIconSquare
          className={`pl-2`}
          onClick={() => onDelete(item)}
          size="small"
          icon={<i className="fa-light fa-trash"></i>}
        />
      </td>
    </>
  );
};

const RoomPage = () => {
  const { toastError, toastSuccess } = useCustomToast();
  const [paginate, setPaginate] = useState(1);
  const [total, setTotal] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<ISort>("newest");
  const [openEdit, setOpenEdit] = useState<IRoom | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);
  const [openDelete, setOpenDelete] = useState<IRoom | null>(null);
  const [selected, setSelected] = useState<IRoom[]>([]);
  const queryClient = useQueryClient();

  const { data: room, isLoading } = useQuery({
    queryKey: ["room", paginate, keyword, filter],
    queryFn: async () => {
      const res = await roomService.getAll({
        page: paginate,
        limit: 10,
        keyword: keyword,
        sort: filter,
      });
      setTotal(res.data.totalPages);
      return res.data.data;
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await roomService.delete(id);
      if (res.data) {
        setOpenDelete(null);
        setPaginate(1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room", paginate, keyword] });
      setOpenDelete(null);
      setOpenDeleteAll(false);
      toastSuccess("Delete room successfully");
    },
    onError: (error: unknown) => {
      toastError((error as Error).message);
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (data: RoomRequestDto) => {
      const res = await roomService.create(data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Create playlist success");
      setOpenAdd(false);
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (data: RoomRequestDto) => {
      const res = openEdit && (await roomService.update(openEdit?.id, data));
      return res;
    },
    onSuccess: () => {
      toastSuccess("Edit room success");
      setOpenEdit(null);
      queryClient.invalidateQueries({ queryKey: ["room"] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  const handleSelect = useCallback((data: IRoom[]) => {
    setSelected(data);
  }, []);

  return (
    <div className={styles.RoomPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Room </h2>
          <span>
            {selected && selected.length > 0 && (
              <span>{selected.length} selected</span>
            )}
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.filters}>
            <div className={styles.left}>
              <div className={styles.search}>
                <button>
                  <i className="fa-light fa-magnifying-glass"></i>
                </button>
                <Input
                  value={keyword}
                  onSubmit={(value) => setKeyword(value)}
                  placeholder="Search song"
                />
              </div>
              <ButtonLabel
                onClick={() => setOpenAdd(true)}
                className={styles.btn_add}
              >
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>
            </div>
            <div className={styles.right}>
              {selected && selected?.length > 0 && (
                <ButtonLabel
                  onClick={() => setOpenDeleteAll(true)}
                  className={styles.btn_delete}
                >
                  <i className="fa-light fa-trash"></i>
                  <label htmlFor="">Delete</label>
                </ButtonLabel>
              )}
              <Dropdown
                className={styles.dropdown}
                label="Filters"
                name="filters"
                onChange={(opt) => setFilter(opt.value as ISort)}
                value={filter}
                options={DataSort}
              />
            </div>
          </div>
          {!room || isLoading ? (
            <LoadingTable />
          ) : (
            <Table
              className={styles.Table}
              data={room}
              columns={columns}
              onSelectRow={(data) => data && handleSelect(data)}
              renderRow={(item: IRoom) =>
                renderRow({
                  item,
                  onEdit: (item) => setOpenEdit(item),
                  onDelete: (item) => setOpenDelete(item),
                })
              }
            />
          )}
        </div>
        <div className={styles.footer}>
          <Pagination
            paginate={paginate}
            total={total}
            setPaginate={setPaginate}
          />
        </div>
      </div>
      {openEdit && (
        <Modal show={openEdit ? true : false} onClose={() => setOpenEdit(null)}>
          <FormRoom
            onClose={() => setOpenEdit(null)}
            open={openEdit ? true : false}
            onSubmit={(data) => mutationEdit.mutate(data)}
            initialData={openEdit}
          />
        </Modal>
      )}
      {openAdd && (
        <Modal
          className={styles.modalRoom}
          show={openAdd}
          onClose={() => setOpenAdd(false)}
        >
          <FormRoom
            onClose={() => setOpenAdd(false)}
            open={openAdd}
            onSubmit={(data) => mutationAdd.mutate(data)}
          />
        </Modal>
      )}
      <ModalConfirm
        title="Are you sure you want to delete this song?"
        show={openDelete ? true : false}
        onClose={() => setOpenDelete(null)}
        onConfirm={() => openDelete && mutationDelete.mutate(openDelete?.id)}
      />
      <ModalConfirm
        title="Are you sure you want to delete all select ?"
        show={openDeleteAll}
        onClose={() => setOpenDeleteAll(false)}
        onConfirm={() =>
          selected?.map((item) => mutationDelete.mutate(item.id))
        }
      />
    </div>
  );
};

export default RoomPage;
