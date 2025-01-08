"use client";
import Modal, { ModalConfirm } from "@/components/Modal";
import Table from "@/components/Table";
import Loading from "@/components/Table/loading";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/useToast";
import moodService from "@/services/mood.service";
import { IGenre } from "@/types";
import { GenreRequestDto } from "@/types/genre.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import FormGenre from "./Form";
import styles from "./style.module.scss";

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "Description" },
  { header: "Actions", accessor: "actions" },
];

type IRow = {
  item: IGenre;
  onEdit: (item: IGenre) => void;
  onDelete: (item: IGenre) => void;
  onView?: (item: IGenre) => void;
};

const renderRow = (props: IRow) => {
  return (
    <>
      <td className={styles.col_1}>
        <div>
          <h6>{props.item.title}</h6>
        </div>
      </td>
      <td>{props.item.description}</td>
      <td>
        {props.onView && (
          <ButtonIconSquare
            className={`pl-2`}
            onClick={() => props.onView && props.onView(props.item)}
            size="small"
            icon={<i className="fa-light fa-eye"></i>}
          />
        )}
        <ButtonIconSquare
          className={`pl-2`}
          size="small"
          onClick={() => props.onEdit(props.item)}
          icon={<i className="fa-light fa-pencil"></i>}
        />
        <ButtonIconSquare
          className={`pl-2`}
          size="small"
          onClick={() => props.onDelete(props.item)}
          icon={<i className="fa-light fa-trash"></i>}
        />
      </td>
    </>
  );
};

const MoodPage = () => {
  const { toastError, toastSuccess } = useCustomToast();
  const [openEdit, setOpenEdit] = useState<IGenre | null>(null);
  const [openDelete, setOpenDelete] = useState<IGenre | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [total, setTotal] = useState(10);
  const [paginate, setPaginate] = useState(1);
  const [openDeleteAll, setOpenDeleteAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<IGenre[] | null>(null);
  const [keyword, setKeyword] = useState("");
  const queryClient = useQueryClient();

  const { data: moods, isLoading } = useQuery({
    queryKey: ["moods", paginate, keyword],
    queryFn: async () => {
      const res = await moodService.getAll({ page: paginate, limit: 10, keyword: keyword });
      setTotal(res.data.totalPages);
      return res.data.data;
    },
  });

  const handleError = (message: string) => {
    toastError(message);
  };

  const handleSuccess = (message: string) => {
    toastSuccess(message);
    setPaginate(1);
    queryClient.invalidateQueries({queryKey: ["genres", paginate, keyword]});
  }

  const mutationAdd = useMutation({
    mutationFn: async (data: GenreRequestDto) => {
      await moodService.create(data);
    },
    onSuccess: () => {
      setOpenAdd(false);
      handleSuccess("Create mood success");
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (data: GenreRequestDto) => {
      if (openEdit) {
        await moodService.update(openEdit.id, data);
      }
    },
    onSuccess: () => {
      setOpenEdit(null);
      handleSuccess("Update mood success");
    },
    onError: (err: unknown) => {
      handleError((err as Error)?.message || "Update user failed");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      await moodService.delete(id);
    },
    onSuccess: () => {
      setOpenDelete(null);
      setOpenDeleteAll(false);
      handleSuccess("Delete mood success");
    },
    onError: () => {
      handleError("Delete mood failed");
    },
  });

  return (
    <div className={styles.MoodPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Mood</h2>
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
              <ButtonLabel
                onClick={() => setOpenAdd(true)}
                className={styles.btn_add}
              >
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>
            </div>
          </div>
          {!moods || isLoading ? (
            <Loading />
          ) : (
            <Table
              className={styles.Table}
              data={moods}
              columns={columns}
              onSelectRow={(data) => setSelected(data)}
              renderRow={(item: IGenre) =>
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
      <Modal show={openEdit ? true : false} onClose={() => setOpenEdit(null)}>
        <FormGenre
          onSubmit={(values) => mutationEdit.mutate(values)}
          onClose={() => setOpenEdit(null)}
          initialData={openEdit ? openEdit : undefined}
        />
      </Modal>
      <Modal show={openAdd} onClose={() => setOpenAdd(false)}>
        <FormGenre
          onSubmit={(values) => mutationAdd.mutate(values)}
          onClose={() => setOpenAdd(false)}
        />
      </Modal>
      <ModalConfirm
        title="Are you sure you want to delete this mood?"
        show={openDelete ? true : false}
        onClose={() => setOpenDelete(null)}
        onConfirm={() => openDelete && mutationDelete.mutate(openDelete?.id)}
      />
      <ModalConfirm
        title="Are you sure you want to delete select ?"
        show={openDeleteAll}
        onClose={() => setOpenDeleteAll(false)}
        onConfirm={() =>
          selected?.map((item) => mutationDelete.mutate(item.id))
        }
      />
    </div>
  );
};

export default MoodPage;
