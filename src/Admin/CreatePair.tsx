import BufferInput from '@Views/Common/BufferInput';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';

interface IInput {
  name: string;
  type: string | IInput[];
}
const mapping: IInput[] = [
  {
    type: 'string',
    name: 'Address',
  },
  {
    type: 'string',
    name: 'Asset_Pair',
  },
  {
    name: 'Market_Timings',
    type: [
      {
        name: '0',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '1',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '2',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '3',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '4',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '5',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
      {
        name: '6',
        type: [
          {
            type: 'string',
            name: 'Start_Hour',
          },

          {
            type: 'string',
            name: 'Start_Minute',
          },

          {
            type: 'string',
            name: 'End_Hour',
          },

          {
            type: 'string',
            name: 'End_Minute',
          },
        ],
      },
    ],
  },
  {
    type: 'string',
    name: '_baseSettlementFeePercentageForAbove',
  },
  {
    type: 'string',
    name: '_baseSettlementFeePercentageForBelow',
  },
  {
    type: [
      {
        type: 'string',
        name: 'Tier_1',
      },
      {
        type: 'string',
        name: 'Tier_2',
      },
      {
        type: 'string',
        name: 'Tier_3',
      },
      {
        type: 'string',
        name: 'Tier_4',
      },
    ],
    name: 'NFT_Tier_Setup',
  },
  {
    type: 'string',
    name: 'optionFeePerTxnLimitPercent (2 dec)',
  },
  {
    type: 'string',
    name: 'overallPoolUtilizationLimit (2 dec)',
  },
  {
    type: 'string',
    name: 'assetUtilizationLimit (2 dec)',
  },
  {
    type: 'string',
    name: 'minPeriod',
  },
  {
    type: 'string',
    name: 'maxPeriod',
  },
  {
    type: 'string',
    name: 'minFee Arb(8 dec) USDC(6 dec)',
  },
];

/*
  a:string
  a:[b:string, c:string]

*/
/*
  Address:'',
  Asset Pair: '',
  Window : {
    mon:[
      sh:'',
      sm:'',
      eh:'',
      em:''
    ]
  }



  a:string
  a:[b:string, c:string]

*/
interface IInitState {
  [key: string]: string | IInitState;
}

const map2initState = (mapping: IInput[]): IInitState => {
  const initState: IInitState = {};
  for (const map of mapping) {
    if (typeof map.type == 'string') {
      initState[map.name] = '';
    } else {
      initState[map.name] = map2initState(map.type);
    }
  }
  return initState;
};
const res = map2initState(mapping);
const formAtom = atom(map2initState(mapping));

const CreatePair: React.FC<any> = ({}) => {
  const [form, setForm] = useAtom(formAtom);
  return (
    <div>
      <RenderForm form={form} setForm={setForm} id="" />
    </div>
  );
};

const RenderForm = ({ form, setForm, id }) => {
  const [origForm, setOrigForm] = useAtom(formAtom);

  return (
    <div className="ml-[30px]">
      {Object.keys(form).map((key) => {
        if (typeof form[key] == 'string') {
          const currId = id + ':' + key;
          const ids = currId.split(':');
          let value = '';
          if (ids.length == 4) {
            value = origForm[ids[1]][ids[2]][ids[3]];
          }
          if (ids.length == 3) {
            value = origForm[ids[1]][ids[2]];
          }
          if (ids.length == 2) {
            value = origForm[ids[1]];
          }
          if (ids.length == 1) {
            value = origForm[key];
          }
          return (
            <div className="text-f12 ml-2">
              <div>{key}</div>
              <BufferInput
                val={value}
                onChange={(val) => {
                  const ids = currId.split(':');
                  setOrigForm((f) => {
                    let updatedF = f;

                    if (ids.length == 4) {
                      console.log(
                        `f[ids[1]][ids[2]][ids[3]]: `,
                        f[ids[1]][ids[2]][ids[3]]
                      );
                      f[ids[1]][ids[2]][ids[3]] += val;
                      console.log(
                        `f[ids[1]][ids[2]][ids[3]]: `,
                        f[ids[1]][ids[2]][ids[3]]
                      );
                    }
                    return f;
                  });
                  // console.log(`currId: `, currId);
                }}
              />
            </div>
          );
        } else {
          return (
            <div className="text-f12 ml-2">
              <div>{key}</div>
              <RenderForm
                {...{
                  form: form[key],
                  setForm,
                  id: id + ':' + key,
                }}
              />
            </div>
          );
        }
      })}
    </div>
  );
};
export { CreatePair };
