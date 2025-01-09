"use client";
import { Dropdown, FormCreateSong } from "@/components/Form";
import Table from "@/components/Table";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { IMAGES, paths } from "@/lib/constants";
import { apiImage, formatDateTime, formatNumber } from "@/lib/utils";
import { ISong, ISort } from "@/types";
import Image from "next/image";
import styles from "./style.module.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import songService from "@/services/song.service";
import { use, useCallback, useState } from "react";
import LoadingTable from "@/components/Table/loading";
import Link from "next/link";
import Modal, { ModalConfirm } from "@/components/Modal";
import { useCustomToast } from "@/hooks/useToast";
import { Form } from "formik";
import { SongRequestDto } from "@/types/song.type";

const DataSort: { label: string; value: string }[] = [
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Likes", value: "mostLikes" },
  { label: "Popular", value: "mostListens" },
];

const columns = [
  { header: "Song", accessor: "song" },
  { header: "Created at", accessor: "createdAt" },
  { header: "Public", accessor: "public" },
  { header: "Listens", accessor: "listens" },
  { header: "Followers", accessor: "Followers" },
  { header: "Actions", accessor: "actions" },
];

type IRow = {
  item: ISong;
  onEdit: (item: ISong) => void;
  onDelete: (item: ISong) => void;
};

const renderRow = ({ item, onDelete, onEdit }: IRow) => {
  return (
    <>
      <td className={styles.col_1}>
        <div className={styles.image}>
          <Image
            src={item.imagePath ? apiImage(item.imagePath) : IMAGES.SONG}
            alt={item.title}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <Link href={`${paths.SONG}/${item.slug}`}>
            <h6>{item.title}</h6>
          </Link>
          <Link href={`${paths.ARTIST}/${item.creator.slug}`}>
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
      <td>{formatNumber(item.listens)}</td>
      <td>{formatNumber(item.likes)}</td>
      <td>
        <ButtonIconSquare
          onClick={() => onEdit(item)}
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-pencil"></i>}
        />
        <ButtonIconSquare
          onClick={() => onDelete(item)}
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-trash"></i>}
        />
      </td>
    </>
  );
};

const SongPage = () => {
  const { toastError, toastSuccess } = useCustomToast();
  const [paginate, setPaginate] = useState(1);
  const [total, setTotal] = useState(10);
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<ISort>("newest");
  const [openEdit, setOpenEdit] = useState<ISong | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [openDeleteAll, setOpenDeleteAll] = useState(false);
  const [openDelete, setOpenDelete] = useState<ISong | null>(null);
  const [selected, setSelected] = useState<ISong[]>([]);
  const queryClient = useQueryClient();

  const { data: songs, isLoading } = useQuery({
    queryKey: ["song", paginate, keyword, filter],
    queryFn: async () => {
      const res = await songService.getAllSong({
        page: paginate,
        keyword: keyword,
        sort: filter,
      });
      setTotal(res.data.totalPages);
      return res.data.data;
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (data: SongRequestDto) => {
      const res = await songService.create(data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Create song success");
      setOpenAdd(false);
      queryClient.invalidateQueries({ queryKey: ["song", paginate, keyword] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (data: SongRequestDto) => {
      const res = await songService.update(openEdit?.id as string, data);
      return res;
    },
    onSuccess: () => {
      toastSuccess("Update song success");
      setOpenEdit(null);
      queryClient.invalidateQueries({ queryKey: ["song", paginate, keyword] });
    },
    onError: (error) => {
      toastError(error.message);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await songService.delete(id);
      if (res.data) {
        setOpenDelete(null);
        setPaginate(1);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["song", paginate, keyword] });
      setOpenDelete(null);
      setOpenDeleteAll(false);
      toastSuccess("Delete song successfully");
    },
    onError: (error: unknown) => {
      toastError((error as Error).message);
    },
  });

  const handleSelect = useCallback((data: ISong[]) => {
    setSelected(data);
  }, []);

  return (
    <div className={styles.SongPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Songs</h2>
          <span></span>
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
          {!songs || isLoading ? (
            <LoadingTable />
          ) : (
            <Table
              className={styles.Table}
              data={songs}
              columns={columns}
              onSelectRow={(data) => data && handleSelect(data)}
              renderRow={(item: ISong) =>
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
      {openAdd && (
        <Modal
          className={styles.modalSong}
          show={openAdd}
          onClose={() => setOpenAdd(false)}
        >
          <FormCreateSong
            file={null}
            onClose={() => setOpenAdd(false)}
            onSubmit={(data) => mutationAdd.mutate(data)}
          />
        </Modal>
      )}
      {openEdit && (
        <Modal
          className={styles.modalSong}
          show={openEdit ? true : false}
          onClose={() => setOpenEdit(null)}
        >
          <FormCreateSong
            file={null}
            onClose={() => setOpenEdit(null)}
            initialData={openEdit}
            onSubmit={(data) => mutationEdit.mutate(data)}
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

export default SongPage;
