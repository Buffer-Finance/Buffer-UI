import { v4 } from "uuid";
const reducer = (state, actions) => {
  if (typeof actions === "string") {
    let noti = {
      msg: actions,
      id: v4(),
      type: "success",
    };
    return state.concat(noti);
  }
  switch (actions.type) {
    case "ADD-NOTIFICATION":
      if (actions.payload.id) {
        // id is passed.
        let duplState = state;
        let i = 0;
        for (let toast of state) {
          if (toast.id === actions.payload.id) {
            duplState[i] = actions.payload;
            return duplState;
          }
          i++;
        }
        return state.concat(actions.payload);
      }
      actions.payload.id = v4();
      return state.concat(actions.payload);
    case "REMOVE-NOTIFICATION":
      return state.filter((s) => s.id !== actions.payload.id);
    default:
      if (actions.id) {
        // id is passed.
        actions.animatable = true;

        let duplState = [...state];
        let i = 0;
        for (let toast of state) {
          if (toast.id === actions.id) {
            duplState[i] = actions;
            return duplState;
          }
          i++;
        }
        return state.concat(actions);
      }
      actions.id = v4();
      return state.concat(actions);
  }
};

export default reducer;
