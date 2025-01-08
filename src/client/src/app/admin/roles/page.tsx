"use client";
import Modal, { ModalConfirm } from "@/components/Modal";
import Table from "@/components/Table";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import roleService, { RoleRequestDto } from "@/services/role.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Form from "./Form";
import styles from "./style.module.scss";
import { useCustomToast } from "@/hooks/useToast";
import { IRole } from "@/types/user.type";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Permissions", accessor: "permissions" },
  { header: "Actions", accessor: "actions" },
];

type IRow = {
  item: IRole;
  onEdit: (item: IRole) => void;
  onDelete: (item: IRole) => void;
};

const renderRow = (props: IRow) => {
  return (
    <>
      <td className={styles.col_1}>{props.item.name}</td>
      <td>{formatNumber(props.item.permissions.length || 0)}</td>
      <td>
        <ButtonIconSquare
          onClick={() => props.onEdit(props.item)}
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-pencil"></i>}
        />
        <ButtonIconSquare
          onClick={() => props.onDelete(props.item)}
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-trash"></i>}
        />
      </td>
    </>
  );
};

const RolesPage = () => {
  const { toastError, toastSuccess } = useCustomToast();
  const [openEdit, setOpenEdit] = useState<IRole | null>(null);
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const [openDelete, setOpenDelete] = useState<IRole | null>(null);
  const [openDeleteAll, setOpenDeleteAll] = useState<boolean>(false);
  const [selected, setSelected] = useState<IRole[] | null>(null);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await roleService.getAllRole();
      return res.data;
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (values: RoleRequestDto) => {
      const res = await roleService.create(values);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpenAdd(false);
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: async (values: RoleRequestDto) => {
      const res = openEdit && (await roleService.update(openEdit?.id, values));
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpenEdit(null);
    },
  });

  const mutationDelete = useMutation({
    mutationFn: async (id: string) => {
      const res = await roleService.delete(id);
      return res?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      setOpenDelete(null);
      setOpenDeleteAll(false);
      toastSuccess("Delete role successfully");
    },
    onError: () => {
      setOpenDelete(null);
      setOpenDeleteAll(false);
      toastError("Delete role failed");
    },
  });

  return (
    <div className={styles.RolesPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Roles</h2>
          <span>Manage roles and permissions for users.</span>
        </div>
        <div className={styles.body}>
          <div className={styles.filters}>
            <div className={styles.left}>
              <ButtonLabel
                onClick={() => setOpenAdd(true)}
                className={styles.btn_add}
              >
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>

              {selected && selected?.length > 0 && (
                <ButtonLabel
                  onClick={() => setOpenDeleteAll(true)}
                  className={styles.btn_delete}
                >
                  <i className="fa-light fa-trash"></i>
                  <label htmlFor="">Delete</label>
                </ButtonLabel>
              )}
            </div>
          </div>
          {data && (
            <Table
              onSelectRow={(data) => setSelected(data)}
              className={styles.Table}
              data={data}
              columns={columns}
              renderRow={(item: IRole) =>
                renderRow({
                  item,
                  onEdit: (role) => setOpenEdit(role),
                  onDelete: (role) => setOpenDelete(role),
                })
              }
            />
          )}
        </div>
      </div>
      <Modal show={openEdit ? true : false} onClose={() => setOpenEdit(null)}>
        <Form
          onSubmit={(values) => mutationUpdate.mutate(values)}
          onClose={() => setOpenEdit(null)}
          initialData={openEdit ? openEdit : undefined}
        />
      </Modal>
      <Modal show={openAdd} onClose={() => setOpenAdd(false)}>
        <Form
          onSubmit={(values) => mutationAdd.mutate(values)}
          onClose={() => setOpenAdd(false)}
        />
      </Modal>
      <ModalConfirm
        title="Are you sure you want to delete this role?"
        show={openDelete ? true : false}
        onClose={() => setOpenDelete(null)}
        onConfirm={() => openDelete && mutationDelete.mutate(openDelete?.id)}
      />
      <ModalConfirm
        title="Are you sure you want to delete select this role?"
        show={openDeleteAll}
        onClose={() => setOpenDeleteAll(false)}
        onConfirm={() =>
          selected?.map((item) => mutationDelete.mutate(item.id))
        }
      />
    </div>
  );
};

export default RolesPage;
