import {useEffect, useState } from "react";
import ReactDOM from "react-dom";

import classes from "./Modal.module.css";

const ModalOverlay = (props) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{props.children}</div>
    </div>
  );
};

const Modal = (props) => {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
   
    const overlayElement = document.createElement("div");
    overlayElement.id = "overlays";
    document.body.appendChild(overlayElement);

    
    setPortalElement(overlayElement);

    
    return () => {
      document.body.removeChild(overlayElement);
    };
  }, []); 


  if (!portalElement) return null;

 
  return ReactDOM.createPortal(
    <ModalOverlay>{props.children}</ModalOverlay>,
    portalElement
  );
};

export default Modal;
