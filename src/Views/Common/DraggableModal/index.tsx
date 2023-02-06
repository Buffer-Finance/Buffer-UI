import React, { useEffect } from "react";
import { Background } from "./style";
import { CloseOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

export default function DraggableModal({ isOpen, closeModal, children }) {
  useEffect(() => {
    if (!isOpen) return;
    const draggable = document.getElementById("draggable");
    draggable.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag({ movementX, movementY }) {
      const getStyle = window.getComputedStyle(draggable);
      const left = parseInt(getStyle.left);
      const top = parseInt(getStyle.top);

      draggable.style.left = left + movementX + "px";
      draggable.style.top = top + movementY + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }, [isOpen]);

  if (isOpen)
    return (
      <Background id="draggable" className="tb">
        <div>
          <IconButton className="close" onClick={closeModal}>
            <CloseOutlined />
          </IconButton>
          {children}
        </div>
      </Background>
    );
  return <></>;
}
