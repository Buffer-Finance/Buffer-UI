import { useGlobal } from "@Contexts/Global";
import { useAtom } from "jotai";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import useSWR from "swr";
import { openDrawer } from "@Utils/appControls/mobileDrawerHandlers";
import { getDisplayDate } from "@Utils/Dates/displayDateTime";
import BufferTable from "@Views/Common/BufferTable";
import { PrimaryActionBtn } from "@Views/Common/Buttons";
import { Display } from "@Views/Common/Tooltips/Display";
import { CellHeadDesc, TableHeads } from "@Views/Common/TableComponents/TableComponents.tsx";
import { dates, drawerType, isDrawerOpen } from "@Views/BinaryOptions/store";
import { useAccount } from "wagmi";

import { BetType, Modal, IBet, SelectedBet, Date } from "../../store";
import { Background } from "./style";
import { divide, gt, lte } from "@Utils/NumString/stringArithmatics";
import { Skeleton } from "@mui/material";
import useConnectionDrawer from "@Hooks/Utilities/useOpenConnectionDrawer";
import { useUserAccount } from "@Hooks/useUserAccount";

export interface IBinaryBet {
  expiration: number;
  strike: number;
  is_above: boolean;
  implied_probability: number;
  odds: number;
  max_amount: number;
}
export const useAllBets = (): IBet[] => {
  // const { data, error } = useSWR<IBet[]>(betsKey);
  // if (error) return null;
  // return data;
  //   const [returnedData, setReturnedData] = useState<IBinaryBet[]>([]);
  //   useEffect(() => {
  //     const d = getData();
  //     setReturnedData(d);
  //   }, [data]);
  //   const getData = () => {
  //     let newArr = [];
  //     if (!data) return;
  //     for (let d of data) {
  //       // close above
  //       let obj: any = {};
  //       obj.expiration = d.expiration;
  //       obj.strike = d.strike;
  //       obj.is_above = true;
  //       obj.max_amount = d.max_amount;
  //       obj.odds = d.stats.is_above.odds;
  //       obj.implied_probability = d.stats.is_above.implied_probability;
  //       newArr.push(obj);
  //       // close below
  //       let obj2: any = {};
  //       obj2.expiration = d.expiration;
  //       obj2.strike = d.strike;
  //       obj2.is_above = false;
  //       obj2.odds = d.stats.is_below.odds;
  //       obj2.implied_probability = d.stats.is_below.implied_probability;
  //       newArr.push(obj2);
  //     }
  //     return newArr;
  //   };
  //   return returnedData;
  // };
};
export default function PGTable({ shoundShowMobile, className }) {
  const { state } = useGlobal();
  const [_, setIsModalOpen] = useAtom(Modal);
  const [isAssetDrawer, setIsAssetDrawer] = useAtom(drawerType);
  const [isyes] = useAtom(BetType);
  const openWalletModal = useConnectionDrawer();
  const [, setIsConnectionDrawerOpen] = useAtom(isDrawerOpen);
  const { address: account } = useUserAccount();

  const connect = () => {
    // dispatch({ type: "SET_DRAWER", payload: true });
    setIsConnectionDrawerOpen(true);
    openWalletModal();
  };

  const [, setSelectedBet] = useAtom(SelectedBet);
  const [, setDates] = useAtom(dates);
  const [selectedDate, setSelectedDate] = useAtom(Date);
  const currentAsset = state.settings.activeAsset?.underlying_asset;
  let highBets: IBinaryBet[] = [];
  let lowBets: IBinaryBet[] = [];
  const data = useAllBets();

  if (data && !!data.length) {
    let filteredData: IBinaryBet[] = data;
    if (selectedDate && data.length > 0) {
      if (selectedDate === "All Dates") filteredData = data;
      else
        filteredData = data.filter((bet, idx) => {
          return bet.expiration === selectedDate;
        });
    }
    highBets = filteredData.filter((bet, idx) =>
      gt(
        bet.strike.toString(),
        divide(currentAsset.current_price.toString(), 8)
      )
    );
    lowBets = filteredData.filter((bet, idx) =>
      lte(
        bet.strike.toString(),
        divide(currentAsset.current_price.toString(), 8)
      )
    );
  }

  useEffect(() => {
    if (!data) return;

    let dates: any[] = [];
    data.forEach((obj) => {
      dates.push(obj.expiration);
    });
    // dates.unshift("All Dates");
    setDates([...new Set(dates)]);
    if (dates.findIndex((date) => selectedDate === date) == -1)
      setSelectedDate(null);
  }, [data]);

  const HeaderFormatter = (col: number) => {
    switch (col) {
      case 0:
        return <TableHeads>Asset</TableHeads>;
      case 1:
        return <TableHeads>Odds</TableHeads>;
      case 2:
        return <TableHeads> </TableHeads>;
      default:
        return <div>Unhandled col of header</div>;
    }
  };
  const selectBet = (strike) => {
    setIsModalOpen(true);
    isAssetDrawer && setIsAssetDrawer(false);
    openDrawer();
    setSelectedBet(strike);
  };
  const topRowClickHandler = (row) => {
    const selectedBet = highBets[row];
    const idx = data.findIndex((bet) => bet === selectedBet);
    selectBet(idx);
  };
  const rowClickHandler = (row) => {
    const selectedBet = lowBets[row];
    const idx = data.findIndex((bet) => bet === selectedBet);
    selectBet(idx);
  };
  // sortBets();
  const BodyFormatter = (row: number, col: number, bets: IBinaryBet[]) => {
    const currentRow = bets[row];

    switch (col) {
      case 0:
        return (
          <CellHeadDesc
            labels={[
              {
                label: (
                  <div className="text-1 f13 nowrap">
                    Close {currentRow?.is_above ? "above" : "below"}&nbsp;
                    <Display
                      data={currentRow?.strike.toString()}
                      label="$"
                      className={`inline f15 fw5 ${
                        currentRow?.is_above ? "green" : "red"
                      } xtml`}
                    />
                    <div className="f12 text-6">
                      {getDisplayDate(currentRow?.expiration)}
                    </div>
                  </div>
                ),
              },
            ]}
          />
        );
      case 1:
        return (
          <CellHeadDesc
            labels={[
              {
                label: (
                  <div className="f15 text-1">
                    {!isyes ? currentRow?.odds : currentRow?.odds}X
                  </div>
                ),
              },
            ]}
          />
        );
      case 2:
        return (
          <CellHeadDesc
            labels={[
              {
                label: (
                  <PrimaryActionBtn className="table-btn">
                    {!isyes ? "Yes" : "No"}
                  </PrimaryActionBtn>
                ),
              },
            ]}
          />
        );
      default:
        return <div>Unhandled col of body</div>;
    }
  };

  const HighBodyFormatter = (row: number, col: number) => {
    return BodyFormatter(row, col, highBets);
  };
  const LowBodyFormatter = (row: number, col: number) => {
    return BodyFormatter(row, col, lowBets);
  };

  const bgRef = useRef<HTMLDivElement>();
  const updateDim = () => {
    const bg = bgRef.current;
    if (!bg) return;
    setTimeout(() => {
      const top = bg.getBoundingClientRect().y;
      const height = window.innerHeight - top - 30;
      bg.style.height = height + "px";
    });

    // bg.style.top= top+'px'
  };
  useLayoutEffect(() => {
    updateDim();
  }, [window.innerHeight, data, window.location]);

  if (lowBets.length === 0 && highBets.length === 0) {
    return <Skeleton variant="rectangular" className="loader lc fw h7" />;
  }
  return (
    <Background ref={bgRef}>
      {/* <div className={`relative ${className}`}> */}

      {/* <div className="loader fw h7"> */}

      {/* </div> */}
      <BufferTable
        smHeight={true}
        widths={["50%", "30%", "20%"]}
        cols={3}
        rows={highBets?.length}
        headerJSX={HeaderFormatter}
        bodyJSX={HighBodyFormatter}
        onRowClick={account ? topRowClickHandler : connect}
        shouldShowMobile={shoundShowMobile}
        // loading={!data}

        shouldHideBody={highBets.length === 0}
      />

      {currentAsset && (lowBets.length > 0 || highBets.length > 0) && (
        <div className="priceTracker">
          <div className="content">
            <div className="line"></div>
            <div className="flex tracker f12">
              {currentAsset?.name} current price
              <span className="green xtml fw5">
                {currentAsset?.current_price ? (
                  <Display
                    data={divide(currentAsset.current_price.toString(), 8)}
                    label="$"
                  />
                ) : (
                  <Skeleton variant="rectangular" className="lc h2 w5" />
                )}
              </span>
            </div>
          </div>
        </div>
      )}
      <BufferTable
        smHeight={true}
        widths={["50%", "30%", "20%"]}
        cols={3}
        rows={lowBets?.length}
        headerJSX={HeaderFormatter}
        bodyJSX={LowBodyFormatter}
        onRowClick={account ? rowClickHandler : connect}
        shouldShowMobile={shoundShowMobile}
        // loading={!data}
        shouldHideHeader
        shouldHideBody={lowBets.length === 0}
        className="lower-table"
      />

      {/* </div> */}
    </Background>
  );
}
