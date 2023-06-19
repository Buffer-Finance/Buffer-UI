import { Dialog } from '@mui/material';
import { useAtom } from 'jotai';
import { CloseOutlined } from '@mui/icons-material';
import BufferTable from '@Views/Common/BufferTable';
import { ModalBase } from 'src/Modals/BaseModal';
import { TableHeader } from '../Views/AccordionTable/Common';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { ForexTimingsModalAtom } from '../atoms';
interface IMarketTimingsModal {}
const headNameArray = ['Day of the week', 'Market open/close'];
const dataArr = [
  [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ],
  [
    'Closed from 10:00PM - 11:00PM UTC',
    'Closed from 10:00PM - 11:00PM UTC',
    'Closed from 10:00PM - 11:00PM UTC',
    'Closed from 10:00PM - 11:00PM UTC',
    'Closed from 17:00PM UTC',
    'Closed all day',
    'Open from 17:00 UTC',
  ],
];
const MarketTimingsModal: React.FC<IMarketTimingsModal> = ({}) => {
  const [show, setShow] = useAtom(ForexTimingsModalAtom);
  const closeModal = () => setShow(false);

  const HeaderFomatter = (col: number) => {
    return (
      <TableHeader
        col={col}
        headsArr={headNameArray}
        className="text-f11 text-1 mr-4"
      />
    );
  };
  const BodyFormatter = (row: number, col: number) => {
    return (
      <CellContent
        content={[dataArr[col][row]]}
        className="text-f11  text-6 font-[500] "
      />
    );
  };

  return (
    <ModalBase open={show} onClose={closeModal}>
      <div>Forex Trading Timings</div>
      <div>
        <BufferTable
          tableClass="!w-full"
          className="mt-1"
          headerJSX={HeaderFomatter}
          bodyJSX={BodyFormatter}
          cols={headNameArray.length}
          rows={dataArr[0].length}
          onRowClick={console.log}
          shouldShowMobile
        />
      </div>
    </ModalBase>
  );
};

export { MarketTimingsModal };
