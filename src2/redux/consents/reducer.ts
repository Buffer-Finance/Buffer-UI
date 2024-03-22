const INITIAL_STATE = {
  disclaimer: false,
  isTriggered: false,
};
type actionType = {
  type: "UPDATE_DISCLAIMER_CONSENT" | "UPDATE_TRIGGER";
  payload: any;
};

export default function profileReducer(
  state = INITIAL_STATE,
  action: actionType
) {
  switch (action.type) {
    case "UPDATE_DISCLAIMER_CONSENT":
      return {
        ...state,
        disclaimer: action.payload,
      };
    case "UPDATE_TRIGGER":
      return {
        isTriggered: action.payload,
      };
    default:
      return state;
  }
}
