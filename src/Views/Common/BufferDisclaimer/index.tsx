import { IconButton } from "@mui/material";
import { useState } from "react";
import CloseLogo from "src/SVG/Elements/Closelogo";
import InfoIcon from "src/SVG/Elements/InfoIcon";
import Background from "./style";

interface BufferDisclaimerProps {
  content: string | JSX.Element;
  isClosable?: boolean;
}

const BufferDisclaimer: React.FC<BufferDisclaimerProps> = ({
  content,
  isClosable = false,
}) => {
  const [closed, setClosed] = useState(false);
  return (
    !closed && (
      <Background>
        <div className="first-part">
          <div className="flex flex-center">
            <InfoIcon tooltip="" className="smr" />
          </div>
          <div>{content}</div>
        </div>
        {isClosable && (
          // <img src="/cross.svg" className="crossIcon pointer" alt="cross-icon" />
          <IconButton className="button" onClick={() => setClosed(true)}>
            <CloseLogo />
          </IconButton>
        )}
      </Background>
    )
  );
};

export default BufferDisclaimer;
