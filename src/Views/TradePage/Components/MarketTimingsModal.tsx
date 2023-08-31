import { useAtom } from 'jotai';
import BufferTable from '@Views/Common/BufferTable';
import { ModalBase } from 'src/Modals/BaseModal';
import { TableHeader } from '../Views/AccordionTable/Common';
import { CellContent } from '@Views/Common/BufferTable/CellInfo';
import { ForexTimingsModalAtom } from '../atoms';
import { AssetCategory } from '../type';
interface IMarketTimingsModal {}
const headNameArray = ['Day of the week', 'Market open/close'];

const getDataArr = (marketType: number) => {
  if (marketType === AssetCategory.Commodities) {
    return [
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
        'Closed from 09:00PM - 10:00PM UTC',
        'Closed from 09:00PM - 10:00PM UTC',
        'Closed from 09:00PM - 10:00PM UTC',
        'Closed from 09:00PM - 10:00PM UTC',
        'Closed from 08:00PM UTC',
        'Closed all day',
        'Open from 11:00PM ET',
      ],
    ];
  } else {
    return [
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
        'Open all day',
        'Open all day',
        'Open all day',
        'Open all day',
        'Closed from 08:00PM UTC',
        'Closed all day',
        'Open from 10:00PM UTC',
      ],
    ];
  }
};
const MarketTimingsModal: React.FC<IMarketTimingsModal> = ({}) => {
  const [{ isOpen: show, marketType }, setShow] = useAtom(
    ForexTimingsModalAtom
  );
  const dataArr = getDataArr(marketType);
  const closeModal = () =>
    setShow((prv) => {
      return { ...prv, isOpen: false };
    });

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
