"use client";
import roomService from "@/services/room.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import SildeItem from "./ItemSlide";
import styles from "./style.module.scss";

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
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const { data: rooms } = useQuery({
    queryKey: ["rooms-banner"],
    queryFn: async () => {
      const res = await roomService.getAll({ page: 1, limit: 4 });
      return res.data.data;
    },
  });

  return (
    <div className={`${styles.Slideshow}`}>
      <Slider {...settings}>
        {rooms &&
          rooms.map((room, index) => <SildeItem key={index} data={room} />)}
      </Slider>
    </div>
  );
};

export default Slideshow;
