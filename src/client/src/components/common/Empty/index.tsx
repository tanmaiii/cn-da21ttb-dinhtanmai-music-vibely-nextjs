import styles from "./style.module.scss";

const Empty = () => {
  return (
    <div className={styles.Empty}>
      <div className={styles.Empty_icon}>
        <i className="fa-light fa-box-open-full"></i>
      </div>
      <h3>No result</h3>
      <span>No matching results found, please try again.</span>
      {/* <ButtonLabel>
        <Link href="/">
          <label htmlFor="">Go to Home</label>
        </Link>
      </ButtonLabel> */}
    </div>
  );
};

export default Empty;
