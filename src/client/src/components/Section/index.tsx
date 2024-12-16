"use client";
import Link from "next/link";
import React from "react";
import Skeleton from "react-loading-skeleton";
import styles from "./style.module.scss";

interface Props {
  title?: string;
  children: React.ReactNode;
  path?: string;
  isLoading?: boolean;
}

const Section = (props: Props) => {
  return (
    <div className={`${styles.Section}`}>
      {props?.title && (
        <div className={`${styles.Section_header}`}>
          <h4>{props.title}</h4>
          {props.path && (
            <Link href={props?.path}>
              <span>{props.isLoading ? "Loading..." : "View all"}</span>
              <i className="fa-solid fa-chevron-right"></i>
            </Link>
          )}
        </div>
      )}
      <div className={`${styles.Section_body} row no-gutters`}>
        {React.Children.map(props.children, (child, index) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<{ className: string }>,
              {
                className: `${child.props.className}`.trim(),
                key: index,
              }
            );
          }
          return child;
        })}
      </div>
    </div>
  );
};

const SectionOneRow = (props: Props) => {
  const { title, path, isLoading, children } = props;
  return (
    <div className={`${styles.Section}`}>
      <div className={`${styles.Section_header}`}>
        <h4>{isLoading ? <Skeleton width={100} /> : title}</h4>
        {path && (
          <Link href={path}>
            <span>{isLoading ? "Loading..." : "View all"}</span>
            <i className="fa-solid fa-chevron-right"></i>
          </Link>
        )}
      </div>
      <div
        className={`${styles.Section_body} row no-gutters`}
        style={{ flexWrap: "nowrap" }}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(
              child as React.ReactElement<{ className: string }>,
              { className: `${child.props.className}`.trim() }
            );
          }
          return child;
        })}
      </div>
    </div>
  );
};

export { Section, SectionOneRow };

