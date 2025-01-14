import Skeleton from "react-loading-skeleton";
import styles from "./style.module.scss";

const HeaderPageSkeleton = () => {
  return (
    <div className={`${styles.HeaderPage}`}>
      <div className={`${styles.body}`}>
        <div className={`${styles.avatar}`}>
          <Skeleton width={"100%"} height={"100%"} />
        </div>
        <div className={`${styles.info}`}>
          <Skeleton width={50} height={20} />
          <Skeleton width={400} height={60} />
          <Skeleton width={300} height={20} />
          <Skeleton width={600} height={20} />
        </div>
      </div>
    </div>
  );
};

export default HeaderPageSkeleton;

