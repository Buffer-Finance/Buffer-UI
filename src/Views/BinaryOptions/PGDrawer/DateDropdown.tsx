import { useAtom } from "jotai";
import { useEffect } from "react";
import { getDisplayDate } from "@Utils/Dates/displayDateTime";
import BufferDropdown from "@Views/Common/BufferDropdown";
import { DateDropDownStyles } from "./style";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const DateDropdown = ({ dateList }) => {
  const [selectedDate, setSelectedDate] = useAtom(DateAtom);

  useEffect(() => {
    setSelectedDate(dateList[0]);
  }, [dateList]);

  return (
    <DateDropDownStyles>
      <BufferDropdown
        items={dateList || []}
        rootClass=""
        className="full-width"
        dropdownBox={(activeItem, isOpen) => (
          <div
            className={`flex-center datedropdown ${isOpen ? "text-1" : ""}  ${
              selectedDate ? "active" : ""
            }`}
          >
            {selectedDate && !selectedDate[0]
              ? getDisplayDate(selectedDate as number)
              : "All dates"}
            <ExpandMoreIcon className={`arrow  ${isOpen ? "rotate" : ""}`} />
          </div>
        )}
        initialActive={0}
        item={(singleItem, handleClose, onChange, active) => (
          <div
            className="flex-center content-start dateitem"
            key={singleItem}
            onClick={() => {
              // setSelectedDate(1);
              setSelectedDate(singleItem);
            }}
          >
            {!singleItem[0] ? getDisplayDate(singleItem) : "All Dates"}
          </div>
        )}
      />
    </DateDropDownStyles>
  );
};
