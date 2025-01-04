"use client";
import { Dropdown } from "@/components/Form";
import Table from "@/components/Table";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { formatNumber } from "@/lib/utils";
import roleService from "@/services/role.service";
import { IRole } from "@/types/auth.type";
import { useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Permissions", accessor: "permissions" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: IRole) => {
  return (
    <>
      <td className={styles.col_1}>
        <div>
          <h6>{item.name}</h6>
        </div>
      </td>
      <td>{formatNumber(item.permissions.length || 0)}</td>
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

const RolesPage = () => {
  const { data } = useQuery({
    queryKey: ["roles"],
    queryFn: async () => {
      const res = await roleService.getAllRole();
      return res.data;
    },
  });

  return (
    <div className={styles.RolesPage}>
      <div className={styles.swapper}>
        <div className={styles.header}>
          <h2>Roles</h2>
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
              <ButtonLabel className={styles.btn_add}>
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>
            </div>

            <Dropdown
              className={styles.dropdown}
              label="Filters"
              name="filters"
              onChange={() => console.log("asd")}
              value="asd"
              options={[
                {
                  value: "asd",
                  label: "asdad",
                },
                {
                  value: "asd",
                  label: "asdad",
                },
                {
                  value: "asd",
                  label: "asdad",
                },
              ]}
            />
          </div>
          {data && (
            <Table
              className={styles.Table}
              data={data}
              columns={columns}
              renderRow={renderRow}
            />
          )}
        </div>
        <div className={styles.footer}>
          <Pagination paginate={1} total={10} setPaginate={() => {}} />
        </div>
      </div>
    </div>
  );
};

export default RolesPage;
