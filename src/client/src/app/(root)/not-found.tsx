import React from "react";
import styles from "./root.module.scss";
import { ButtonLabel } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/constants";

const NotFound = () => {
  return (
    <div className={`${styles.NotFoundPage}`}>
      <div>
        <Image src={IMAGES.ERROR} alt="" width={400} />
      </div>
      <h1>Opps</h1>
      <h6>This page you are looking for could not be found.</h6>
      <ButtonLabel>
        <Link href="/">
          <label htmlFor="">Go to Home</label>
        </Link>
      </ButtonLabel>
    </div>
  );
};

export default NotFound;
