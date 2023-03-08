import { Display } from '@Views/Common/Tooltips/Display';
import Config from 'public/config.json';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
import { deepEqual } from 'wagmi';
var json = {
  global: { tabEnableClose: true },
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
            weight: 75,
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
            weight: 25,
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
const layoutAtom = atomWithLocalStorage('layout-persisted', json);
const DesktopTrade = () => {
  const layoutRef = useRef<Layout | null>(null);
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
        <Background className="bg-2 max-w-[420px] mx-auto">
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
  function handleNewTabClick(market: string, custom?: string) {
    layoutApi.doAction(FlexLayout.Actions.deleteTab('dd'));
    navigate('/test/' + (market || custom));
  }
  useEffect(() => {
    try {
      if (deepEqual(json.layout, layout.layout)) {
        console.log(`deepEqual: `);
        layoutApi.doAction(FlexLayout.Actions.setActiveTabset('charts'));
      }
      layoutRef.current!.addTabToActiveTabSet({
        type: 'tab',
        name: market,
        component: 'TradingView',
        id: market,
      });
    } catch (e) {
      try {
        layoutApi.doAction(FlexLayout.Actions.selectTab(market));
      } catch (e) {
        console.log('internal error,', e);
      }
      console.log('errorwhileadding', e);
    }
  }, [market]);
  return (
    <>
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
        onTabDrag={() => {
          console.log(`tabdragged: `);
          if (layoutConset.layoutCustomization.isUserEducated) return;
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
        }}
        onCancel={() => {
          setLayout(json);
          seLayoutConsent((l) => {
            const updatedConsents = {
              ...l,
              layoutCustomization: {
                ...l.layoutCustomization,
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
          setLayout(json);
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
              navigate('/test/' + p.data.tabNode);
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

  // onRenderTab={(node,arr)=>{
  //   console.log(`arr: `,arr);
  //   console.log(`node: `,node);
  //   arr.buttons.push(<Tab></Tab>)
  // }}
};

export const priceAtom = atom<Partial<Market2Prices>>({});
export { DesktopTrade };

const TabIcon = React.memo(({ market }) => {
  return (
    <div className="w-[20px] h-[20px]" id={market.replace('-', '')}>
      <PairTokenImage pair={market} />
    </div>
  );
});
