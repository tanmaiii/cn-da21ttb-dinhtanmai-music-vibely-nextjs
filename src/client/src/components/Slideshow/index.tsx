"use client";
import React from "react";
import styles from "./style.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import SildeItem from "./ItemSlide";
import banner1 from "@/public/images/banner1.jpg";
import banner2 from "@/public/images/banner2.jpg";
import banner3 from "@/public/images/banner3.jpg";

function SampleNextArrow(props: {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClick?: () => void;
}) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.SlickButton} ${styles.SlickButton_right}`}
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-right"></i>
    </div>
  );
}

function SamplePrevArrow(props: {
  className?: string;
  style?: React.StyleHTMLAttributes<HTMLDivElement>;
  onClick?: () => void;
}) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} ${styles.SlickButton} ${styles.SlickButton_left}`}
      style={{ ...style }}
      onClick={onClick}
    >
      <i className="fas fa-chevron-left"></i>
    </div>
  );
}

const Slideshow = () => {
  const settings = {
    dots: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 4000,
    // cssEase: "linear",
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    // appendDots: (dots: string) => (
    //   <div>
    //     <ul className={styles.SlickDots} style={{ margin: "0px" }}>
    //       {dots}
    //     </ul>
    //   </div>
    // ),
    // customPaging: () => <div className={`${styles.SlickDot}`}></div>,
  };

  return (
    <div className={`${styles.Slideshow}`}>
      <Slider {...settings}>
        <SildeItem title="1" img={banner1.src} />
        <SildeItem title="2" img={banner2.src} />
        <SildeItem title="3" img={banner3.src} />
      </Slider>
    </div>
  );
};

export default Slideshow;
