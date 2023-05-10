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
          />
        </div>
        {/* <div className="text-6 text-f10 mt-5 sm:px-2">
          Additionally, there are the following <b>holidays</b> where market are
          closed throughout the day:
          <div className="ml-1 my-3">
            <div className="mt-2">1.&nbsp; January 1st - 3rd</div>
            <div className="mt-2">2.&nbsp; December 25th - 27th </div>
          </div>
        </div> */}
      </ShareModalStyles>
    </Dialog>
  );
};

const ModalButton = ({ children, className, onClick }) => {
  return (
    <button
      className={`text-f16 text-3 bg-2 pb-[3px] pr-4 pl-[10px] rounded-sm h-[30px] whitespace-nowrap w-[80px] transition-all duration-300 hover:text-1 ${className}`}
    >
      {children}
    </button>
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
