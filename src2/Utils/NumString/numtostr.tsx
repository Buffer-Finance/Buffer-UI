const nestedObjToStr = (res: Object) => {
  if (!res) return null;
  Object.keys(res).forEach((key) => {
    if (typeof res[key] === "object" && res[key] !== null) {
      nestedObjToStr(res[key]);
    }
    if (typeof res[key] === "number") {
      res[key] = res[key].toString();
    }
  });
};
export default nestedObjToStr;
