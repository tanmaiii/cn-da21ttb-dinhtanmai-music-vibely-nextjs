"use client";
import styles from "./admin.module.scss";

const Page = () => {
  return (
    <div className={styles.Admin}>
      <div className={styles.Admin_swapper}>
        <div className={`${styles.top} row`}>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-users"></i>
              <h4>Employees</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className=" fa-thin fa-music"></i>
              <h4>Songs</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-album"></i>
              <h4>Playlists</h4>
              <h2>152</h2>
            </div>
          </div>
          <div className={` col pc-3 t-4 m-6`}>
            <div className={styles.card}>
              <i className="fa-thin fa-signal-stream"></i>
              <h4>Room</h4>
              <h2>152</h2>
            </div>
          </div>
        </div>

        <div className={`${styles.char} row`}>
          <div className={`col pc-7`}></div>
          <div className={`col pc-5`}>
            <h5>Sales Overview</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
