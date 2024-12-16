import React from "react";
import styles from "./style.module.scss";

const Footer = () => {
  return (
    <div className={`${styles.Footer}`}>
      <div className={`${styles.Footer_swapper} row`}>
        <div className={`${styles.Footer_swapper_col} col pc-4 t-12 m-12`}>
          <div className={`${styles.Footer_swapper_col_social}`}>
            <button>
              <i className={`fa-brands fa-facebook-f`}></i>
            </button>
            <button>
              <i className={` fa-brands fa-youtube`}></i>
            </button>
            <button>
              <i className={` fa-brands fa-steam-symbol`}></i>
            </button>
          </div>
        </div>
        <div className={`${styles.Footer_swapper_col} col pc-2 t-3 m-12`}>
          <h4 className={`${styles.Footer_swapper_col_header}`}>Communities</h4>
          <ul className={`${styles.Footer_swapper_col_list}`}>
            <li>
              <a href="">For Artists</a>
            </li>
            <li>
              <a href="">Developers</a>
            </li>
            <li>
              <a href="">Advertising</a>
            </li>
            <li>
              <a href="">F Investors</a>
            </li>
          </ul>
        </div>
        <div className={`${styles.Footer_swapper_col} col pc-2 t-3 m-12`}>
          <h4 className={`${styles.Footer_swapper_col_header}`}>Communities</h4>
          <ul className={`${styles.Footer_swapper_col_list}`}>
            <li>
              <a href="">For Artists</a>
            </li>
            <li>
              <a href="">Developers</a>
            </li>
            <li>
              <a href="">Advertising</a>
            </li>
            <li>
              <a href="">F Investors</a>
            </li>
          </ul>
        </div>
        <div className={`${styles.Footer_swapper_col} col pc-2 t-3 m-12`}>
          <h4 className={`${styles.Footer_swapper_col_header}`}>Communities</h4>
          <ul className={`${styles.Footer_swapper_col_list}`}>
            <li>
              <a href="">For Artists</a>
            </li>
            <li>
              <a href="">Developers</a>
            </li>
            <li>
              <a href="">Advertising</a>
            </li>
            <li>
              <a href="">F Investors</a>
            </li>
          </ul>
        </div>
        <div className={`${styles.Footer_swapper_col} col pc-2 t-3 m-12`}>
          <h4 className={`${styles.Footer_swapper_col_header}`}>Communities</h4>
          <ul className={`${styles.Footer_swapper_col_list}`}>
            <li>
              <a href="">For Artists</a>
            </li>
            <li>
              <a href="">Developers</a>
            </li>
            <li>
              <a href="">Advertising</a>
            </li>
            <li>
              <a href="">F Investors</a>
            </li>
          </ul>
        </div>
      </div>
      <div className={`${styles.Footer_bottom}`}>
        <h4>
          © 2024 - Đây là đồ án chuyên ngành của <a href="mailto:dinhtanmaivn@gmail.com">Tanmaiii</a>
        </h4>
      </div>
    </div>
  );
};

export default Footer;
