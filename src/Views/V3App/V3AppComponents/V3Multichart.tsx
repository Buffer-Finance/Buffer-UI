import { V3AppConfig, useV3AppConfig } from '../useV3AppConfig';
import { marketsForChart } from '../config';
import { joinStrings } from '../helperFns';
import { Skeleton } from '@mui/material';
import Config from 'public/config.json';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import ReplayIcon from '@mui/icons-material/Replay';
import { usePrice } from '@Hooks/usePrice';
import FlexLayout, { Layout, TabNode } from 'flexlayout-react';
import { useToast } from '@Contexts/Toast';
import { usePastTradeQuery } from '@Views/BinaryOptions/Hooks/usePastTradeQuery';
import { useGenericHooks } from '@Hooks/useGenericHook';
import { useNavigate, useParams } from 'react-router-dom';
import { atomWithLocalStorage } from '@Views/BinaryOptions/Components/SlippageModal';
import { TradingChart } from 'src/TradingView';
import { CustomisationWarnModal } from 'src/Modals/CustomisationWarnModal';
import { ResetWarnModal } from 'src/Modals/ResetWarnModal';
import { V3MarketSelector } from './V3MarketSelector';
import { Markets } from 'src/Types/Market';
import { TabIcon } from 'src/MultiChart';
import { OneCTModal } from '@Views/OneCT/OneCTModal';
import { WideTableModal } from 'src/WideTableModal';
import { ShareModal } from '@Views/BinaryOptions/Components/shareModal';
import { Background } from '@Views/BinaryOptions/PGDrawer/style';
import { V3ActiveAsset } from './V3ActiveAsset';
import { V3OptionBuying } from './V3optionBuying';
import { UserTrades } from '@Views/BinaryOptions/UserTrades';
import { json, layoutConsentsAtom } from 'src/MultiChartLayout';

export const V3MultiChart = () => {
  const appChartConfig = useV3MultiChartConfig();
  const appConfig = useV3AppConfig();
  if (!appConfig || !appChartConfig)
    return (
      <Skeleton
        className="lc sr w-full flex-1 !h-[300px] m-5  "
        variant="rectangular"
      />
    );
  return (
    <MultiChart markets={appChartConfig} product="v3" ddConfig={appConfig} />
  );
};

const useV3MultiChartConfig = (): {
  [key: string]: chartMarkets;
} | null => {
  const appConfig = useV3AppConfig();

  //turn appConfig into a chartMarkets
  let response: {
    [key: string]: chartMarkets;
  } = {};

  const loopFn = (market: V3AppConfig) => {
    const marketId = joinStrings(market.token0, market.token1, '');
    response[marketId] =
      marketsForChart[marketId as keyof typeof marketsForChart];
  };

  if (appConfig) {
    appConfig.forEach(loopFn);
  }

  return response;
};

type chartMarkets = {
  [key: string]: {
    price_precision: number;
    pair: string;
    category: string;
    fullName: string;
    tv_id: string;
  };
}[];

export interface MarketInterface {
  minPeriod: string;
  maxPeriod: string;
  minFee: string;
  maxFee: string;
  configContract: string;
  isPaused: boolean;
  optionsContract: string;
  price_precision: number;
  pair: string;
  category: string;
  fullName: string;
  tv_id: string;
}

export interface Market {
  pricePrecision: number;
  pair: string;
  category: string;
  fullName: string;
}

const MultiChart = ({
  markets,
  product,
  ddConfig,
}: {
  markets: { [key: string]: MarketInterface };
  product: 'no-loss' | 'binary';
  ddConfig: V3AppConfig[];
}) => {
  const layoutRef = useRef<Layout | null>(null);
  const [forcefullyRerender, setforcefullyRerender] = useState(1);
  const { market } = useParams();
  const [layoutConset, seLayoutConsent] = useAtom(layoutConsentsAtom);
  const [layout, setLayout] = [json, () => {}];
  const layoutApi = useMemo(() => FlexLayout.Model.fromJson(layout), [layout]);
  const toastify = useToast();
  const navigate = useNavigate();
  usePrice(true);
  usePastTradeQuery();
  useGenericHooks();

  const factory = (node: TabNode) => {
    var component = node.getComponent();
    if (component === 'TradingView') {
      return <TradingChart market={node.getName() as Markets} />;
    }
    if (component === 'AddButton') {
      return (
        <V3MarketSelector
          markets={ddConfig}
          className="asset-dropdown-wrapper !h-[100%] !justify-start "
          onMarketSelect={handleNewTabClick}
          onResetMarket={() =>
            seLayoutConsent((l) => {
              l;
              const updatedConsents = {
                ...l,
                resetCustomization: {
                  isModalOpen: true,
                  isUserEducated: true,
                },
              };
              return updatedConsents;
            })
          }
        />
      );
    }
  };
  const redirectTo = (market?: string) => {
    if (!market) {
      navigate(`/${product}/BTC-USD`);
    } else {
      navigate(`/${product}/${market}`);
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
    if (toMarket == market) {
      setforcefullyRerender((f) => f + 1);
    }
    redirectTo(toMarket || custom);
  }
  function resetLayoutForced() {
    redirectTo();
    isCDMForMarketSelect.current = true;
    setLayout();
  }
  useEffect(() => {
    try {
      if (isCDMForMarketSelect.current) {
        layoutApi.doAction(FlexLayout.Actions.setActiveTabset('charts'));
      }
      if (market && !(market.replace('-', '') in Config.markets))
        return redirectTo();
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
        console.log('[adderr]error,', e);
      }
    }
  }, [market, forcefullyRerender]);
  return (
    <>
      {/* <Detector
        onChange={(p) => {

        }}
        render={({ online }) => (
          <div className={online ? 'normal' : 'warning'}>
            You are currently {online ? 'online' : 'offline'}
          </div>
        )}
      /> */}
      {/*//TODO - v3 fix this shareModal*/}
      {/* <ShareModal qtInfo={qtInfo} /> */}
      <WideTableModal />
      <OneCTModal />
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
      <div className="flex w-full  ">
        <div className="relative w-full m-[10px]">
          <FlexLayout.Layout
            onAction={(p) => {
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
                  redirectTo(p.data.tabNode);
                }
              }
              if (p.type == FlexLayout.Actions.DELETE_TAB) {
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
                const market = Config.markets[name.replace('-', '')]?.pair;
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

                      return updatedConsents;
                    });
                  }}
                >
                  <ReplayIcon />
                </button>
              );
            }}
            onModelChange={(model) => {
              setLayout(model.toJson());
            }}
          />{' '}
        </div>
        <Background className=" max-w-[280px] mx-auto flex flex-col border-left ">
          <V3ActiveAsset />
          <V3OptionBuying />
          <div className="flex-1 max-h-full w-full relative mt-4 ">
            <UserTrades />
          </div>
        </Background>
      </div>
    </>
  );
};
