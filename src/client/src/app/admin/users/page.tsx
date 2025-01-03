"use client";
import Table from "@/components/Table";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";
import { apiImage, formatNumber } from "@/lib/utils";
import userService from "@/services/user.service";
import { IUser, UserRequestDto } from "@/types/auth.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import styles from "./style.module.scss";
import { Dropdown } from "@/components/Form";
import { useState } from "react";
import roleService from "@/services/role.service";
import Modal from "@/components/Modal";
import FormUser from "./Form";
import { useCustomToast } from "@/hooks/useToast";

const columns = [
  { header: "User", accessor: "song" },
  { header: "Email", accessor: "email" },
  { header: "Followers", accessor: "followers" },
  { header: "Songs", accessor: "songs" },
  { header: "Playlists", accessor: "playlists" },
  { header: "Role", accessor: "role" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: IUser) => {
  return (
    <>
      <td className={styles.col_1}>
        <div>
          <Image
            src={item.imagePath ? apiImage(item.imagePath) : IMAGES.AVATAR}
            alt={item.name}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <h6>{item.name}</h6>
          <span>{item.slug}</span>
        </div>
      </td>
      <td>{item.email}</td>
      <td>{formatNumber(item.followers)}</td>
      <td>{formatNumber(item.songs)}</td>
      <td>{formatNumber(item.playlists)}</td>
      <td className={styles.col_6}>
        <div className={styles.role}>
          <span>{item?.role?.name}</span>
        </div>
      </td>
      <td>
        <ButtonIconSquare
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-eye"></i>}
        />
        <ButtonIconSquare
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-pencil"></i>}
        />
        <ButtonIconSquare
          className={`pl-2`}
          size="small"
          icon={<i className="fa-light fa-trash"></i>}
        />
      </td>
    </>
  );
};

const UserPage = () => {
  const { toastSuccess } = useCustomToast();
  const [openEdit, setOpenEdit] = useState<IUser | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const [paginate, setPaginate] = useState(1);
  const [total, setTotal] = useState(10);
  const queryClient = useQueryClient();
  const { data: users } = useQuery({
    queryKey: ["users", paginate],
    queryFn: async () => {
      const res = await userService.getAllUsers({ page: paginate, limit: 10 });
      setTotal(res.data.totalPages);
      return res.data.data;
    },
  });

  const { data: roles } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await roleService.getAllRole();
      return res.data;
    },
  });

  const mutationAdd = useMutation({
    mutationFn: async (data: UserRequestDto) => {
      await userService.create(data);
    },
    onSuccess: () => {
      setPaginate(1);
      setOpenAdd(false);
      toastSuccess("Create user successfully");
      queryClient.invalidateQueries({ queryKey: ["users", paginate] });
    },
  });

  return (
    <div className={styles.UserPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Songs</h2>
          <span>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi
            deserunt vero ab
          </span>
        </div>
        <div className={styles.body}>
          <div className={styles.filters}>
            <div className={styles.left}>
              <div className={styles.search}>
                <button>
                  <i className="fa-light fa-magnifying-glass"></i>
                </button>
                <Input placeholder="Search song" />
              </div>
              <ButtonLabel
                onClick={() => setOpenAdd(true)}
                className={styles.btn_add}
              >
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>
            </div>

            {roles && (
              <Dropdown
                className={styles.dropdown}
                label="Filters"
                name="filters"
                onChange={(role) => console.log(role)}
                value="asd"
                options={roles.map((role) => {
                  return {
                    label: role.name,
                    value: role.id,
                  };
                })}
              />
            )}
          </div>
          {users && (
            <Table
              className={styles.Table}
              data={users}
              columns={columns}
              renderRow={renderRow}
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
        <FormUser
          onSubmit={(values) => console.log(values)}
          onClose={() => setOpenEdit(null)}
          initialData={openEdit ? openEdit : undefined}
        />
      </Modal>
      <Modal show={openAdd} onClose={() => setOpenAdd(false)}>
        <FormUser
          onSubmit={(values) => mutationAdd.mutate(values)}
          onClose={() => setOpenAdd(false)}
        />
      </Modal>
    </div>
  );
};

export default UserPage;
