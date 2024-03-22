import axios from 'axios';

export async function getAllReferralData(
  url: string
): Promise<IallReferralData[] | undefined> {
  const query = `{
    referralDatas(orderBy: totalDiscountAvailed, orderDirection: desc, first: 10000) {
        user
        totalTradesReferred
        totalVolumeOfReferredTrades
        totalTradingVolume
        totalRebateEarned
        totalDiscountAvailed
      }
    }
    `;

  try {
    const { data, status } = await axios.post(url, {
      query,
    });
    if (status !== 200) throw new Error('Error in fetching data');
    return data.data.referralDatas;
  } catch (e) {
    console.log(e, 'getAllReferralData error');
  }
}

export interface IallReferralData {
  user: string;
  totalTradesReferred: number;
  totalVolumeOfReferredTrades: string;
  totalTradingVolume: string;
  totalRebateEarned: string;
  totalDiscountAvailed: string;
}
