import Config from 'public/config.json';
export type Markets = keyof typeof Config.markets;
export type Market2Prices = {
  [key in keyof typeof Config.markets]: {
    time: number;
    price: string;
    volume?:number;
  }[];
};