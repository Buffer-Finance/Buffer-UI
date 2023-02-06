import useSWR from "swr";
import { multicallv2 } from "@Utils/Contract/multiContract";

export const useMultiCallSWR = (calls, chain, library) => {
  return useSWR(calls && [calls], {
    fetcher: async (calls) => {
      if (!chain || !library || !calls) return null;
      const returnData = await multicallv2(calls, chain, library);
      if (returnData) {
        const copy = JSON.parse(JSON.stringify(returnData));
        convertBigToNum(copy);
        return copy;
      }
      return null;
    },
  });
};

export function convertBigToNum(data) {
  Object.keys(data).forEach((key) => {
    if (typeof data[key] === "object" && !data[key].type) {
      convertBigToNum(data[key]);
    }
    if (data[key].type) {
      data[key] = parseInt(data[key].hex, 16);
    }
  });
}
