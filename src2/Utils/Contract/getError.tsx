
export const getError = (error: any, contractArgs?: any) => {
  // logAPI({ ...contractArgs, error: error && error.toString() });
  if (!error) return "User denied transaction!";
  let errMessage = error.message;

  if (error.data && error.data.message) {
    errMessage = error.data.message;
  } else if (
    errMessage &&
    errMessage.includes("Current round hasn't ended completely")
  )
    return "Current round hasn't ended completely";
  else if (errMessage && errMessage.includes("(setting 'loadingDefaults')"))
    return "User denied transaction.";
  else if (errMessage && errMessage.includes("insufficient funds"))
    return "Insufficient funds for paying gas fee.";
  else if (
    errMessage &&
    errMessage.includes("Creation isn't allowed in this time window")
  )
    return "Creation isn't allowed in this time window";
  else if (
    errMessage &&
    errMessage.includes(
      "execution reverted: Pool: Not accepting withdraw requests currently"
    )
  )
    return "execution reverted: Pool: Not accepting withdraw requests currently";
  else if (error.code && error.code === 4001) {
    return "User denied transaction signature.";
  } else {
    const info = errMessage.split('"');
    let idx = 0;
    let finalMsg;
    for (let msg of info) {
      if (msg == "message") {
        finalMsg = info[idx + 2];
        break;
      }
      idx++;
    }
    return finalMsg || errMessage;
  }
};
