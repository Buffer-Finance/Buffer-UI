const INITIAL_STATE = {
  markets: {},
};
type actionType =
  | {
      type: "UPDATE_MARKETS";
      payload: {
        key: string;
        value: object;
      };
    }
  | {
      type: "TEST_ACTION";
    };

export default function profileReducer(
  state = INITIAL_STATE,
  action: actionType
) {
  switch (action.type) {
    case "UPDATE_MARKETS":
      try {
        return {
          markets: {
            ...state.markets,
            [action.payload.key]: {
              ...state.markets[action.payload.key],
              ...action.payload.value,
            },
          },
        };
      } catch (err) {
        return state;
      }
    case "TEST_ACTION":
      return state;
    default:
      return state;
  }
}
