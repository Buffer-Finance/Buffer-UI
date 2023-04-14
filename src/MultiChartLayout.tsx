import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import {
  ReactNode,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIdleTimer } from 'react-idle-timer';

const initD = ['800123.32', '22313.2312', '312312.11', '32131123.231'];
const Decd = ['800123.31', '22313.2311', '312312.10', '32131123.230'];
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import useWebSocket from 'react-use-websocket';
import { Market2Prices, Markets } from './Types/Market';
import ReplayIcon from '@mui/icons-material/Replay';
import { TradingChart } from './TradingView';
import { usePrice } from '@Hooks/usePrice';
import FlexLayout, { Layout, TabNode } from 'flexlayout-react';
import { FavouriteAssetDD } from '@Views/BinaryOptions/Favourites/FavouriteAssetDD';
import { TVMarketSelector } from '@Views/BinaryOptions/Favourites/TVMarketSelector';
import { useToast } from '@Contexts/Toast';
import { CustomOption } from '@Views/BinaryOptions/PGDrawer/CustomOption';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { ActiveAsset } from '@Views/BinaryOptions/PGDrawer/ActiveAsset';
import PGTables from '@Views/BinaryOptions/Tables';
import { ActiveTable, CancelTable, HistoryTable } from '@Views/BinaryOptions';
import { usePastTradeQuery } from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { PairTokenImage } from '@Views/BinaryOptions/Components/PairTokenImage';
import { IconButton } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import React from 'react';
import { ResetWarnModal } from './Modals/ResetWarnModal';
import { CustomisationWarnModal } from './Modals/CustomisationWarnModal';
import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { Detector } from 'react-detect-offline';
import isUserPaused, { UserActivityAtom } from '@Utils/isUserPaused';
import { ModalBase } from './Modals/BaseModal';
import { BlueBtn } from '@Views/Common/V2-Button';
var json = {
  global: {
    tabEnableClose: true,
    // tabClassName: 'bg-2',
    tabSetClassNameTabStrip: 'bg-2',
    borderClassName: 'bg-2',
  },
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'row',
        weight: 1000,
        children: [
          {
            type: 'tabset',
            weight: 55,
            selected: 0,
            id: 'charts',
            children: [
              {
                type: 'tab',
                name: 'BTC-USD',
                id: 'BTC-USD',
                enableClose: false,
                component: 'TradingView',
                enableDrag: false,
              },
            ],
          },
          {
            type: 'tabset',
            weight: 45,
            selected: 0,
            id: 'PastTradeTab',
            children: [
              {
                type: 'tab',
                name: 'Active',
                id: 'ActiveTable',
                component: 'ActiveTable',
                enableClose: false,
                enableDrag: false,
              },
              {
                type: 'tab',
                name: 'History',
                id: 'HistoryTable',
                component: 'HistoryTable',
                enableClose: false,
                enableDrag: false,
              },
              {
                type: 'tab',
                name: 'Cancelled',
                id: 'CancelledTable',
                component: 'CancelledTable',
                enableClose: false,
                enableDrag: false,
              },
            ],
          },
        ],
      },
      {
        type: 'row',
        weight: 300,
        children: [
          {
            type: 'tabset',
            weight: 50,
            selected: 0,
            id: 'BuyTradeTab',
            children: [
              {
                enableClose: false,
                type: 'tab',
                name: 'Trade',
                enableDrag: false,
                id: 'BuyTraded',
                component: 'BuyTrade',
              },
            ],
          },
        ],
      },
    ],
  },
};

// build RestWarnModal modal UI
// build CustomizingWarnModal UI
// build consets atoms
const WithIdle = (C: any, duration: number) => {
  const updatedComponent = () => {
    const [isIdle, setIsIdle] = useState<boolean>(false);

    const onIdle = () => {
      setIsIdle(true);
    };
    useIdleTimer({
      onIdle,
      timeout: duration,
      throttle: 100,
    });
    const displayApp = () => {
      setIsIdle(false);
    };
    return (
      <>
        <ModalBase open={isIdle} onClose={displayApp}>
          <>
            <div className="text-1 text-f16 mb-4">Are you still there?</div>
            <BlueBtn onClick={displayApp} className="!h-[35px]">
              Continue
            </BlueBtn>
          </>
        </ModalBase>
        {!isIdle ? <C /> : null}
      </>
    );
  };
  return updatedComponent;
};
const layoutConsentsAtom = atomWithLocalStorage('layout-consents-persisted', {
  layoutCustomization: {
    isModalOpen: false,
    isUserEducated: false,
  },
  resetCustomization: {
    isModalOpen: false,
    isUserEducated: false,
  },
});
const layoutAtom = atomWithLocalStorage('layout-persisted-v2', json);
const DesktopTrad = () => {
  const layoutRef = useRef<Layout | null>(null);
  const [forcefullyRerender, setforcefullyRerender] = useState(1);
  const { market } = useParams();
  const [layoutConset, seLayoutConsent] = useAtom(layoutConsentsAtom);
  const [layout, setLayout] = useAtom(layoutAtom);
  const layoutApi = useMemo(() => FlexLayout.Model.fromJson(layout), [layout]);
  const toastify = useToast();
  const navigate = useNavigate();
  usePrice();
  usePastTradeQuery();
  useGenericHooks();

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if (component === 'TradingView') {
      return <TradingChart market={node.getName() as Markets} />;
    }
    if (component === 'AddButton') {
      return (
        <TVMarketSelector
          className="asset-dropdown-wrapper !h-[100%] !justify-start "
          onMarketSelect={handleNewTabClick}
          onResetMarket={() =>
            seLayoutConsent((l) => {
              const updatedConsents = {
                ...l,
                resetCustomization: {
                  isModalOpen: true,
                  isUserEducated: true,
                },
              };
              console.log(`updatedConsents: `, updatedConsents);
              return updatedConsents;
            })
          }
        />
      );
    }
    if (component === 'BuyTrade') {
      return (
        <Background className=" max-w-[420px] mx-auto">
          <ActiveAsset cb={handleNewTabClick} />
          <CustomOption
            onResetLayout={() =>
              seLayoutConsent((l) => {
                const updatedConsents = {
                  ...l,
                  resetCustomization: {
                    isModalOpen: true,
                    isUserEducated: true,
                  },
                };
                console.log(`updatedConsents: `, updatedConsents);
                return updatedConsents;
              })
            }
          />
        </Background>
      );
    }
    const rect = node.getRect();
    if (component === 'ActiveTable') {
      return <ActiveTable width={rect.width} />;
    }
    if (component === 'HistoryTable') {
      return <HistoryTable width={rect.width} />;
    }
    if (component === 'CancelledTable') {
      return <CancelTable width={rect.width} />;
    }
  };
  const isCDMForMarketSelect = useRef(true);
  function handleNewTabClick(toMarket: string, custom?: string) {
    if (custom == 'charts') {
      layoutApi.doAction(FlexLayout.Actions.setActiveTabset('charts'));
    }
    isCDMForMarketSelect.current = false;
    try {
      layoutApi.doAction(FlexLayout.Actions.deleteTab('dd'));
    } catch (e) {
      console.log('errwhile-deleting', e);
    }
    console.log(`toMarket: `, toMarket, market);
    if (toMarket == market) {
      setforcefullyRerender((f) => f + 1);
    }
    navigate('/binary/' + (toMarket || custom));
  }
  function resetLayoutForced() {
    navigate('/binary/BTC-USD');
    isCDMForMarketSelect.current = true;
    setLayout(json);
  }
  useEffect(() => {
    try {
      if (isCDMForMarketSelect.current) {
        layoutApi.doAction(FlexLayout.Actions.setActiveTabset('charts'));
      }
      if (market && !(market.replace('-', '') in Config.markets))
        return navigate('/binary/BTC-USD');
      layoutRef.current!.addTabToActiveTabSet({
        type: 'tab',
        name: market,
        component: 'TradingView',
        id: market,
      });
      console.log('[adderr]', market);
    } catch (e) {
      try {
        layoutApi.doAction(FlexLayout.Actions.selectTab(market));
      } catch (e) {
        console.log('[adderr]error,', e);
      }
      console.log('[adderr]errorwhileadding', e);
    }
  }, [market, forcefullyRerender]);
  return (
    <>
      {/* <Detector
        onChange={(p) => {
          console.log('detectorprops', p);
        }}
        render={({ online }) => (
          <div className={online ? 'normal' : 'warning'}>
            You are currently {online ? 'online' : 'offline'}
          </div>
        )}
      /> */}
      <CustomisationWarnModal
        onConfirm={() => {
          seLayoutConsent((l) => {
            const updatedConsents = {
              ...l,
              layoutCustomization: {
                isModalOpen: false,
                isUserEducated: true,
              },
            };
            console.log(`updatedConsents: `, updatedConsents);
            return updatedConsents;
          });
        }}
        onCancel={() => {
          resetLayoutForced();
          seLayoutConsent((l) => {
            const updatedConsents = {
              ...l,
              layoutCustomization: {
                isUserEducated: false,
                isModalOpen: false,
              },
            };
            console.log(`updatedConsents: `, updatedConsents);
            return updatedConsents;
          });
        }}
        open={layoutConset.layoutCustomization.isModalOpen}
      />
      <ResetWarnModal
        onConfirm={() => {
          resetLayoutForced();
          seLayoutConsent((l) => {
            const updatedConsents = {
              ...l,
              resetCustomization: {
                isModalOpen: false,
                isUserEducated: true,
              },
            };
            console.log(`updatedConsents: `, updatedConsents);
            return updatedConsents;
          });
        }}
        onCancel={() => {
          seLayoutConsent((l) => {
            const updatedConsents = {
              ...l,
              resetCustomization: {
                ...l.resetCustomization,
                isModalOpen: false,
              },
            };
            return updatedConsents;
          });
        }}
        open={layoutConset.resetCustomization.isModalOpen}
      />
      <FlexLayout.Layout
        onAction={(p) => {
          console.log('actionselect', p);
          if (p.type == FlexLayout.Actions.MOVE_NODE) {
            if (layoutConset.layoutCustomization.isUserEducated) return p;
            seLayoutConsent((l) => {
              const updatedConsents = {
                ...l,
                layoutCustomization: {
                  isModalOpen: true,
                  isUserEducated: true,
                },
              };
              return updatedConsents;
            });
          }
          if (p.type == FlexLayout.Actions.SELECT_TAB) {
            const market = p.data?.tabNode.replace('-', '');
            if (market && Config.markets?.[market]) {
              console.log(`p.data.tabNode: `, p.data.tabNode);
              navigate('/binary/' + p.data.tabNode);
            }
          }
          if (p.type == FlexLayout.Actions.DELETE_TAB) {
            console.log('action', p);
            if (
              p.data.node.toLowerCase() ==
              market?.replace('-', '').toLowerCase()
            ) {
              toastify({
                type: 'error',
                msg: "Can't remove the Active Chart!",
                id: '231',
              });
              return false;
            }
          }
          return p;
        }}
        ref={layoutRef}
        model={layoutApi}
        factory={factory}
        onRenderTab={(d, v) => {
          if (d.getComponent() == 'TradingView') {
            const name = d.getName() as Markets;
            console.log(`name: `, name);
            const market = Config.markets[name.replace('-', '')].pair;
            console.log(`market: `, market);
            v.leading = <TabIcon market={market} />;
          }
        }}
        onRenderTabSet={(d, v) => {
          const id = d.getId();
          if (id != 'BuyTradeTab' && id != 'PastTradeTab') {
            // v.headerButtons[0].
            v.stickyButtons.push(
              <button
                className="text-f22"
                onClick={() => {
                  // make current tabset active
                  layoutApi.doAction(
                    FlexLayout.Actions.setActiveTabset(d.getId())
                  );
                  // delete all dds
                  try {
                    layoutApi.doAction(FlexLayout.Actions.deleteTab('dd'));
                  } catch (e) {
                    console.log(e);
                  }

                  // add dd to activeTab
                  layoutRef.current!.addTabToActiveTabSet({
                    type: 'tab',
                    name: 'Add Chart',
                    component: 'AddButton',
                    id: 'dd',
                  });
                }}
              >
                +
              </button>
            );
          }
          v.buttons.push(
            <button
              title="Reset layout. You can Drag and Drop to customize the UI."
              className="flex justify-center items-center flip-y !text-2 hover:!bg-[#3d3d3d] rounded-sm "
              onClick={() => {
                seLayoutConsent((l) => {
                  const updatedConsents = {
                    ...l,
                    resetCustomization: {
                      isModalOpen: true,
                      isUserEducated: true,
                    },
                  };
                  console.log(`updatedConsents: `, updatedConsents);
                  return updatedConsents;
                });
              }}
            >
              <ReplayIcon />
            </button>
          );
        }}
        onModelChange={(model) => {
          console.log(`model: `, model);
          setLayout(model.toJson());
        }}
      />
    </>
  );

  //   console.log(`arr: `,arr);
  //   console.log(`node: `,node);
  //   arr.buttons.push(<Tab></Tab>)
  // }}
};
const DesktopTrade = WithIdle(DesktopTrad, 30 * 60 * 1000);
export const priceAtom = atom<Partial<Market2Prices>>({});
export { DesktopTrade };

const TabIcon = React.memo(({ market }) => {
  return (
    <div className="w-[20px] h-[20px]" id={market.replace('-', '')}>
      <PairTokenImage pair={market} />
    </div>
  );
});

export const Tes2 = () => {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return <div>{loading ? 'Loading' : 'Hello'}</div>;
};

export const Test2 = WithIdle(Tes2, 5 * 60 * 1000);
