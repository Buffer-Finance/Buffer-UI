import styled from "@emotion/styled";
import { CloseOutlined } from "@mui/icons-material";
import { Dialog, IconButton } from "@mui/material";
import React from "react";
import BufferInput from "@Views/Common/BufferInput";
import { PrimaryBtn } from "@Views/Common/Buttons";

const ReferralModalStyles = styled.div`
  background-color: var(--dropdown-hover);
  gap: 1.4rem;
  padding: 3rem;
  position: relative;
  width: 100%;
  min-width: min(100%, 800px);
  .close {
    position: absolute;
    right: 4rem;
    top: 2px;

    color: var(--text-1);
    background-color: var(--bg-14);
    border-radius: 50%;
  }
`;

interface IReferralModal {
  closeModal: () => void;
  isOpen: boolean;
  btn: JSX.Element;
  inputVal: string;
  setInputVal: (val: string) => void;
}

export const ReferralCodeModal: React.FC<IReferralModal> = ({
  closeModal,
  isOpen,
  btn,
  setInputVal,
  inputVal,
}) => {
  if (!isOpen) return <></>;
  return (
    <Dialog open={isOpen} onClose={closeModal}>
      <ReferralModalStyles className=" text-1 text-f16">
        Activate Referral Code{" "}
        <IconButton className="close" onClick={closeModal}>
          <CloseOutlined />
        </IconButton>
        <BufferInput
          value={inputVal}
          onChange={(newValue) => setInputVal(newValue)}
          className="bg-5 ip-border my-4 mt-6 minww mb-5"
          placeholder="Enter your code"
          // unit={<img className="" src="/EditIcon.svg"></img>}
        ></BufferInput>{" "}
        {btn}
      </ReferralModalStyles>
    </Dialog>
  );
};
