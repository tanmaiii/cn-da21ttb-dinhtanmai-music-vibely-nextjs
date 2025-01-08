"use client";
import Modal, { ModalConfirm } from "@/components/Modal";
import Table from "@/components/Table";
import Loading from "@/components/Table/loading";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { useCustomToast } from "@/hooks/useToast";
import { IMAGES } from "@/lib/constants";
import { apiImage } from "@/lib/utils";
import genreService from "@/services/genre.service";
import { IGenre } from "@/types";
import { GenreRequestDto } from "@/types/genre.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useCallback, useState } from "react";
import FormGenre from "./Form";
import styles from "./style.module.scss";

const columns = [
  { header: "Title", accessor: "title" },
  { header: "Description", accessor: "Description" },
  { header: "Color", accessor: "color" },
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
          <Image
            src={
              props.item.imagePath
                ? apiImage(props.item.imagePath)
                : IMAGES.AVATAR
            }
            alt={props.item.title}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <h6>{props.item.title}</h6>
        </div>
      </td>
      <td>{props.item.description}</td>
      <td className={styles.col_3}>
        {/* <button
          onClick={() =>
            props.item.color && navigator.clipboard.writeText(props.item.color)
          }
          style={{
            backgroundColor: props.item.color,
          }}
        ></button> */}
      </td>
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

const GenrePage = () => {
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

  const { data: genres, isLoading } = useQuery({
    queryKey: ["genres", paginate, keyword],
    queryFn: async () => {
      console.log("Call API");
      
      const res = await genreService.getAll({
        page: paginate,
        limit: 10,
        keyword: keyword,
      });
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
    queryClient.invalidateQueries({ queryKey: ["genres", paginate, keyword] });
  };

  const mutationAdd = useMutation({
    mutationFn: async (data: GenreRequestDto) => {
      console.log("Call API");

      await genreService.create(data);
    },
    onSuccess: () => {
      setOpenAdd(false);
      handleSuccess("Create genre success");
    },
  });

  const mutationEdit = useMutation({
    mutationFn: async (data: GenreRequestDto) => {
      console.log("Call API");

      if (openEdit) {
        await genreService.update(openEdit.id, data);
      }
    },
    onSuccess: () => {
      setOpenEdit(null);
      handleSuccess("Update genre success");
    },
    onError: (err: unknown) => {
      handleError((err as Error)?.message || "Update user failed");
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      console.log("Call API");

      await genreService.delete(id);
    },
    onSuccess: () => {
      setOpenDelete(null);
      setOpenDeleteAll(false);
      handleSuccess("Delete genre success");
    },
    onError: () => {
      handleError("Delete genre failed");
    },
  });

  const handleSelect = useCallback((data: IGenre[]) => {
      setSelected(data);
  }, []);

  return (
    <div className={styles.GenrePage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Genres</h2>
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
          {!genres || isLoading ? (
            <Loading />
          ) : (
            <Table
              className={styles.Table}
              data={genres}
              columns={columns}
              onSelectRow={(data) => data && handleSelect(data)}
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
        title="Are you sure you want to delete this genre?"
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

export default GenrePage;
