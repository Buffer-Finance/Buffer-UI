import { useIndependentWriteCall } from '@Hooks/writeCall';
import BufferInput from '@Views/Common/BufferInput';
import { BlueBtn } from '@Views/Common/V2-Button';
import { atom, useAtom } from 'jotai';
import { useState } from 'react';
import MarketFactoryABI from '@ABIs/MarketFactory.json';
import { useNavigate } from 'react-router-dom';
import { useActiveChain } from '@Hooks/useActiveChain';
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
    type: 'string',
    name: 'Catagory',
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
    name: '_baseSettlementFeePercentageForAbove (2 dec)',
  },
  {
    type: 'string',
    name: '_baseSettlementFeePercentageForBelow (2 dec)',
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
    name: 'minFee Arb(18 dec) USDC(6 dec)',
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

  {
    "Address": "",
    "Asset_Pair": "",
    "Market_Timings": {
        "0": {
            "Start_Hour": "12112",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        },
        "1": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        },
        "2": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        },
        "3": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": "11122"
        },
        "4": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        },
        "5": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        },
        "6": {
            "Start_Hour": "",
            "Start_Minute": "",
            "End_Hour": "",
            "End_Minute": ""
        }
    },
    "_baseSettlementFeePercentageForAbove": "",
    "_baseSettlementFeePercentageForBelow": "",
    "NFT_Tier_Setup": {
        "Tier_1": "",
        "Tier_2": "",
        "Tier_3": "",
        "Tier_4": ""
    },
    "optionFeePerTxnLimitPercent (2 dec)": "23213",
    "overallPoolUtilizationLimit (2 dec)": "",
    "assetUtilizationLimit (2 dec)": "12",
    "minPeriod": "112",
    "maxPeriod": "",
    "minFee Arb(8 dec) USDC(6 dec)": "1231"
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
      let initVal = '';
      if (
        ['Start_Hour', 'Start_Minute', 'End_Hour', 'End_Minute'].includes(
          map.name
        )
      )
        initVal = '0';
      initState[map.name] = initVal;
    } else {
      initState[map.name] = map2initState(map.type);
    }
  }
  return initState;
};
const formAtom = atom(map2initState(mapping));
const CreatePair: React.FC<any> = ({}) => {
  const { configContracts } = useActiveChain();
  console.log(`configContracts: `, configContracts.marketFactory);
  const [form, setForm] = useAtom(formAtom);
  console.log(`form: `, form);
  const { writeCall } = useIndependentWriteCall();
  const send = async () => {
    const addParam = (formInstance) => {
      console.log(`formInstance: `, formInstance);
      let args = [];
      for (let item in formInstance) {
        console.log(`formInstance[item]: `, formInstance[item], item);
        if (typeof formInstance[item] == 'string') {
          args.push(formInstance[item]);
        } else {
          args.push(addParam(formInstance[item]));
        }
      }
      return args;
    };
    const gargs = addParam(form);
    console.log(`gargs: `, gargs);
    const staticArgs = [
      '0x1CDA6A34D84F444183E89D2D41D920EeaE883439',
      'BTCUSD',
      '1',
      [
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
        ['0', '0', '0', '0'],
      ],
      '2000',
      '2000',
      ['4', '8', '12', '16'],
      '100',
      '40',
      '100',
      '180',
      '14400',
      '25000000',
    ];
    writeCall(
      configContracts.marketFactory,
      MarketFactoryABI,
      (data) => {
        console.log('final-response', data, data?.payload?.market);
      },
      'createPair',
      // [staticArgs]
      [gargs]
    );
  };
  return (
    <div className="mt-[20px]">
      <RenderAdminNavbar className={'ml-[30px]'} />
      <div className="text-f12 text-2 ml-[30px] mt-4">
        Tip: Press tab for navigating to next input
      </div>
      <div className="text-f14 text-1 ml-[30px] mt-4">
        Enter the raw values in the form, make sure that no input remains blank,
        than press "Create" below the form.
      </div>
      <RenderForm form={form} setForm={setForm} id="" />
      <BlueBtn onClick={send}>Create</BlueBtn>
    </div>
  );
};

const RenderForm = ({ form, setForm, id }) => {
  const [origForm, setOrigForm] = useAtom(formAtom);

  return (
    <div className="ml-[30px] mt-4">
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
          console.log(`value: `, key, value);
          return (
            <div className="text-f12 ml-2  mt-4">
              <div>{key}</div>
              <input
                className="text-1 bg-3 px-3 py-1 mt-3"
                value={value}
                onChange={(e) => {
                  const val = e.target.value;
                  const ids = currId.split(':');
                  setOrigForm((updatedF) => {
                    let f = { ...updatedF };

                    if (ids.length == 4) {
                      f[ids[1]][ids[2]][ids[3]] = val;
                    }
                    if (ids.length == 3) {
                      f[ids[1]][ids[2]] = val;
                    }
                    if (ids.length == 2) {
                      f[ids[1]] = val;
                      console.log(`f[key]: `, f[key]);
                    }
                    if (ids.length == 1) {
                      f[key] = val;
                    }
                    console.log(`f: `, f);
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

export const RenderAdminNavbar = ({ className }) => {
  const navigate = useNavigate();
  return (
    <div className={'  flex gap-x-[20px] ' + className}>
      <div
        onClick={() => navigate('/admin')}
        className="cursor-pointer bg-blue px-[15px] py-[5px]  rounded-[7px]"
      >
        Change Settings
      </div>
      <div
        onClick={() => navigate('/admin/create-pair')}
        className="cursor-pointer bg-blue px-[15px] py-[5px] rounded-[7px]"
      >
        Create Pair
      </div>
    </div>
  );
};
