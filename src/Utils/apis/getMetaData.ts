import axios, { axiosInstance } from "@Config/axios";
import { CHAIN_CONFIGS } from "config";
import { IChain } from "@Contexts/Global/interfaces";
const getMetadata = async (
  period,
  strike_price,
  asset,
  option_size,
  option_type,
  product_type,
  chain: IChain
) => {
  let res;
  try {
    const apiRes = await axiosInstance.post(
      `meta_data/hash/?environment=${chain.env}`,
      {
        period,
        strike_price,
        asset,
        option_size,
        option_type,
        product_type,
      }
    );
    res = apiRes?.data?.data;
  } catch (err) {
    console.log(err);
  }
  return res;
};

export default getMetadata;
