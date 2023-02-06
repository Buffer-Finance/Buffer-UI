// added for autocompletion
import { IAsset, IChain, IOption } from './interfaces';
interface ITabs {
  list: ITab[];
  activeIdx: string | null;
}
interface ICatagory {
  name: string;
}
export interface ITab {
  name: string;
  icon?: number | 'v2';
}

interface IApprovedCache {
  [contract: string]: string | null;
}
interface ISettings {
  activeChain: IChain | null;
  isDrawerOpen: boolean;
}
export interface iGlobalState {
  isDarkMode: boolean;
  token: any;
  contracts: {
    options: IOption[];
    liquidity_pools: any[];
    autoExercises: null | object;
  };
  sidebar_active: boolean;
  activeContract: {
    options: IOptionContract | null;
    isAvailable: null | boolean | string;
  };
  isConnectionTriggered: boolean;
  catagories: ICatagory[];
  assets: IAsset[];
  settings: ISettings;
  tabs: ITabs;
  banners: {
    top: boolean;
    main: boolean;
  };
  txnLoading: 0 | 1 | 2 | 3;
  show: {
    tryTestnet: boolean;
  };
  user: {
    balance: string | null;
  };
  activePageIdx: number | null;
  approvedAmount: IApprovedCache | null;
  gasFee: { string: number } | null;
}

export interface IOptionContract extends IOption {
  contract: string;
}
const defaultState: iGlobalState = {
  isDarkMode: true,
  approvedAmount: {},
  user: {
    balance: null,
  },
  isConnectionTriggered: false,
  token: {
    ibfr_price: null,
  },
  sidebar_active: true,
  settings: {
    activeChain: null,
    isDrawerOpen: false,
  },
  tabs: {
    list: [],
    activeIdx: null,
  },
  assets: [],
  catagories: [],
  contracts: {
    options: [],
    liquidity_pools: [],
    autoExercises: null,
  },
  activeContract: {
    options: null,
    isAvailable: null,
  },
  banners: {
    top: true,
    main: true,
  },
  txnLoading: 0,
  show: {
    tryTestnet: true,
  },
  activePageIdx: null,
  gasFee: null,
};
type GlobalActions =
  | {
      type: 'UPDATE_IS_DARK_MODE';
      payload: boolean;
    }
  | {
      type: 'UPDATE_ASSETS';
      payload: any;
    }
  | {
      type: 'UPDATE_ACTIVE_PAGE_IDX';
      payload: number;
    }
  | {
      type: 'UPDATE_CATAGORIES';
      payload: any;
    }
  | {
      type: 'UPDATE_TRIGGERED';
      payload: boolean;
    }
  | {
      type: 'UPDATE_CONTRACTS';
      payload: any;
    }
  | {
      type: 'SET_TRY_TESTNET';
      payload: boolean;
    }
  | {
      type: 'UPDATE_ACTIVE_CHAIN';
      payload: IChain;
    }
  | {
      type: 'UPDATE_IBFR_BALANCE';
      payload: string;
    }
  | {
      type: 'SET_DRAWER';
      payload: boolean;
    }
  | {
      type: 'SET_TAB_LIST';
      payload: ITab[];
    }
  | {
      type: 'SET_ACIVE_TAB';
      payload: string;
    }
  | {
      type: 'UPDATRE_BANNER_STATE';
      payload:
        | { top: boolean }
        | { main: boolean }
        | { top: boolean; main: boolean };
    }
  | {
      type: 'ACCOUNT_CHANGED';
    }
  | {
      type: 'ASSET_CHANGE_TRIGGERED';
    }
  | {
      type: 'UPDATE_ACTIVE_OPTION_CONTRACT';
      payload: {
        options: IOptionContract;
        isAvailable: boolean | null | string;
      };
    }
  | {
      type: 'UPDATE_ACTIVE_OPTION_CONTRACT_AVAILABILITY';
      payload: string | boolean | null;
    }
  | {
      type: 'SET_TXN_LOADING';
      payload: 0 | 1 | 2 | 3;
    }
  | {
      type: 'SET_AUTOEXERCISE_STATUSES';
      payload: object;
    }
  | {
      type: 'SET_GAS_FEE';
      payload: {
        string: number;
      };
    }
  | {
      type: 'UPDATE_TOKEN_RES';
      payload: {
        ibfr_price: string;
      };
    }
  | {
      type: 'CHAIN_CHANGE_REQ';
    }
  | {
      type: 'UPDATE_SIDEBAR_STATE';
    };

const reducer = (state: iGlobalState, action: GlobalActions): iGlobalState => {
  switch (action.type) {
    case 'UPDATE_IS_DARK_MODE':
      return {
        ...state,
        isDarkMode: action.payload,
        settings: {
          ...state.settings,
        },
      };
    case 'UPDATE_ASSETS':
      return {
        ...state,
        assets: action.payload,
        settings: {
          ...state.settings,
        },
      };
    case 'UPDATE_TOKEN_RES':
      return {
        ...state,
        token: { ...action.payload },
      };
    case 'UPDATE_ACTIVE_PAGE_IDX':
      return {
        ...state,
        activePageIdx: action.payload,
      };
    case 'UPDATE_CATAGORIES':
      return {
        ...state,
        catagories: action.payload,
      };
    case 'UPDATE_TRIGGERED':

      return {
        ...state,
        isConnectionTriggered: action.payload,
      };
    case 'UPDATE_ACTIVE_OPTION_CONTRACT':
      return {
        ...state,
        activeContract: {
          ...action.payload,
        },
      };
    case 'UPDATE_CONTRACTS':
      return {
        ...state,
        contracts: {
          ...state.contracts,
          ...action.payload,
        },
      };

    case 'SET_AUTOEXERCISE_STATUSES':
      return {
        ...state,
        contracts: {
          ...state.contracts,
          autoExercises: action.payload,
        },
      };
    case 'UPDATE_ACTIVE_OPTION_CONTRACT_AVAILABILITY':
      return {
        ...state,
        activeContract: {
          ...state.activeContract,
          isAvailable: action.payload,
        },
      };
    case 'UPDATE_ACTIVE_CHAIN':
      return {
        ...state,

        settings: {
          ...state.settings,
          activeChain: action.payload,
        },
      };
    case 'SET_GAS_FEE':
      return {
        ...state,
        gasFee: { ...state.gasFee, ...action.payload },
      };

    case 'SET_DRAWER':
      return {
        ...state,
        settings: {
          ...state.settings,
          isDrawerOpen: action.payload,
        },
      };

    case 'UPDATE_IBFR_BALANCE':
      return {
        ...state,
        user: {
          ...state.user,
          balance: action.payload,
        },
      };
    case 'SET_TRY_TESTNET':
      return {
        ...state,
        show: {
          ...state.show,
          tryTestnet: action.payload,
        },
      };
    case 'CHAIN_CHANGE_REQ':
      return {
        ...state,
        contracts: defaultState.contracts,
        activeContract: defaultState.activeContract,
        assets: defaultState.assets,
        settings: {
          ...state.settings,
          activeChain: null,
        },
        isConnectionTriggered: false,
      };
    case 'SET_TAB_LIST':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          list: action.payload,
        },
      };
    case 'SET_ACIVE_TAB':
      return {
        ...state,
        tabs: {
          ...state.tabs,
          activeIdx: action.payload,
        },
      };
    case 'UPDATRE_BANNER_STATE':
      return {
        ...state,
        banners: {
          ...state.banners,
          ...action.payload,
        },
      };
    case 'ASSET_CHANGE_TRIGGERED':
      return {
        ...state,
        settings: {
          ...state.settings,
        },
        activeContract: defaultState.activeContract,
      };
    case 'ACCOUNT_CHANGED':
      return state;
    case 'SET_TXN_LOADING':
      return { ...state, txnLoading: action.payload };
    case 'UPDATE_SIDEBAR_STATE':
      return { ...state, sidebar_active: !state.sidebar_active };

    default:
      throw new Error('Invalid Action.');
  }
};
export type { GlobalActions };
export { defaultState };
export default reducer;
