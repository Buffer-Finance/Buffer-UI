import React from "react";
import NumberTooltip from "@Views/Common/Tooltips";
import {
  getDisplayDate,
  getDisplayDateUTC,
  getDisplayTime,
  getDisplayTimeUTC,
} from "./Dates/displayDateTime";
const DisplayDate = ({
  timestamp,
  className,
  noTime,
  noDate,
}: {
  className?: string;
  timestamp: number;
  noTime?: boolean;
  noDate?: boolean;
}) => {
  return (
    <NumberTooltip
      content={`${getDisplayTimeUTC(timestamp)}  ${getDisplayDateUTC(
        timestamp
      )} UTC`}
    >
      <div className={className}>
        {!noTime && <span>{getDisplayTime(timestamp)}&nbsp;</span>}
        {!noDate && <span>{getDisplayDate(timestamp)}</span>}
      </div>
    </NumberTooltip>
  );
};

export default DisplayDate;
