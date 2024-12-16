import React from "react";
import styles from "./style.module.scss";

const Pagination = () => {
  const total = 10;
  const [paginate, setPaginate] = React.useState(1);

  const handleClickLeft = () => {
    if (paginate - 1 < 0) return;
    setPaginate(paginate - 1);
  };

  const handleClickRight = () => {
    if (paginate >= total) return;
    setPaginate(paginate + 1);
  };

  return (
    <div className={styles.Pagination}>
      <div className={styles.swapper}>
        <button
          onClick={() => handleClickLeft()}
          className={styles.button_control}
        >
          <i className="fa-solid fa-chevron-left"></i>
          <span>Prev</span>
        </button>

        <div className={styles.list}>
          {paginate > 3 && total > 5 && (
            <>
              <button
                onClick={() => setPaginate(1)}
                key={`page-1`}
                className={`${styles.button} ${
                  paginate === 1 ? styles.active : ""
                }`}
              >
                1
              </button>
              {paginate > 4 && <span>....</span>}
            </>
          )}
          {Array.from({ length: total }).map((_, i) => {
            const num = i + 1;
            if (
              (paginate <= 3 && num <= 5) ||
              (paginate >= total - 2 && num >= total - 4) ||
              (num >= paginate - 2 && num <= paginate + 2)
            ) {
              return (
                <button
                  onClick={() => setPaginate(num)}
                  key={`page-${num}`}
                  className={`${styles.button} ${
                    paginate === num && styles.active
                  }`}
                >
                  {num}
                </button>
              );
            }
            return null;
          })}
          {total > 5 && paginate < total - 2 && (
            <>
             {total > 6 && paginate < total - 3 && <span>....</span>}
              <button
                onClick={() => setPaginate(total)}
                key={`page-${total}`}
                className={`${styles.button} ${
                  paginate === total && styles.active
                }`}
              >
                {total}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => handleClickRight()}
          className={styles.button_control}
        >
          <span>Next</span>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
