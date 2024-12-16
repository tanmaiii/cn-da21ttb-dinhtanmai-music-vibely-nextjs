"use client";
import { Dropdown } from "@/components/form";
import Table from "@/components/Table";
import { Input, Pagination } from "@/components/ui";
import { ButtonIconSquare, ButtonLabel } from "@/components/ui/Button";
import { IMAGES } from "@/lib/constants";
import { songs } from "@/lib/data";
import { formatDateTime, formatNumber } from "@/lib/utils";
import { ISong } from "@/types";
import Image from "next/image";
import styles from "./style.module.scss";

const columns = [
  { header: "Song", accessor: "song" },
  { header: "Created at", accessor: "createdAt" },
  { header: "Public", accessor: "public" },
  { header: "Listens", accessor: "listens" },
  { header: "Followers", accessor: "Followers" },
  { header: "Actions", accessor: "actions" },
];

const renderRow = (item: ISong) => {
  return (
    <>
      <td className={styles.col_1}>
        <div>
          <Image
            src={item.image_path ? item.image_path : IMAGES.SONG}
            alt={item.title}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <h6>{item.title}</h6>
          <span>{item.owner[0].name}</span>
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
      <td>{formatNumber(item.listen)}</td>
      <td>{formatNumber(item.followers_count)}</td>
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

const SongPage = () => {
  return (
    <div className={styles.SongPage}>
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
              {/* <ButtonIconSquare className={styles.btn_add} icon={<i className="fa-solid fa-plus"></i>} /> */}
              <ButtonLabel  className={styles.btn_add}>
                <i className="fa-solid fa-plus"></i>
                <label htmlFor="">New</label>
              </ButtonLabel>
            </div>

            <Dropdown
              className={styles.dropdown}
              label="Filters"
              name="filters"
              onChange={() => console.log("asd")}
              value={{ value: "asd", label: "asdad" }}
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
          <Table
            className={styles.Table}
            data={songs}
            columns={columns}
            renderRow={renderRow}
          />
        </div>
        <div className={styles.footer}>
          <Pagination />
        </div>
      </div>
    </div>
  );
};

export default SongPage;