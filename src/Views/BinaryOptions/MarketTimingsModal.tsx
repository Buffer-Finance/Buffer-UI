import { Dialog } from '@mui/material';
import { useAtom } from 'jotai';
import { ShareModalStyles } from './Components/shareModal';
import { ForexTimingsModalAtom } from './PGDrawer/CustomOption';
import { CloseOutlined } from '@mui/icons-material';
import { TableHeader } from '@Views/Pro/Common/TableHead';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import BufferTable from '@Views/Common/BufferTable';
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
    <Dialog open={show} onClose={closeModal}>
      <ShareModalStyles>
        <ModalHeader
          header={'Forex Trading Timings'}
          onClick={closeModal}
          className=""
        />
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
            highlightIndexs={[2]}
          />
        </div>
      </ShareModalStyles>
    </Dialog>
  );
};

const ModalHeader = ({ onClick, header, className }) => {
  return (
    <div
      className={`flex justify-between items-center mb-4 shareModal:mb-3 shareModal:pl-5 shareModal:pr-3 w-full ${className}`}
    >
      <div className="text-f20 text-1 pb-2">{header}</div>
      <button className="p-3 text-1 rounded-full bg-2" onClick={onClick}>
        <CloseOutlined />
      </button>
    </div>
  );
};

export { MarketTimingsModal };
