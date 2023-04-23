import React, { useEffect, useRef, useState } from "react";
import classes from "./index.module.css";
import { useNavigate } from "@remix-run/react";
import Button from "~/components/Button";


export type Props = {
  title?: string
  closable?: boolean
  children?: React.ReactNode
}

export const Modal: React.FC<Props> = ({
  children, title,
}) => {
  const navigate = useNavigate();
  const modal = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // close modal on click outside
    document.body.addEventListener('click', (e) => {
      if (modal.current && !modal.current?.contains(e.target as Node)) {
        console.log('close modal')
        navigate(-1);
      }
    });

    // lock body scroll
    // in combination with the preventScrollReset prop on the navigate function,
    // the scroll position is not reset when the modal is closed
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    }
  }, [navigate]);
 
  return (
    <div ref={modal} className={classes.container}>
      <div className={classes.header}>
        <div>{ title }</div>
        <Button
          layout="symbol"
          symbol="close"
          className={classes.close}
          onClick={() => navigate(-1)}
        />
      </div>
      <div className={classes.content}>{/* this div is necessary to center the content */}
        { children }
      </div>
    </div> 
  )
};

export default Modal;
