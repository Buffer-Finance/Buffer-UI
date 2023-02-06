export default function getDeepCopy(item) {
  let copy;
  try {
    if (typeof structuredClone === "function") {
      copy = structuredClone(item);
    } else {
      copy = JSON.parse(JSON.stringify(item));
    }
  } catch (e) {
    copy = JSON.parse(JSON.stringify(item));
  }
  return copy;
}
