import BufferDropdown from '@Views/Common/BufferDropdown';

const chartTypes = {
  Bar: {
    type: 0,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="chart-type ele"
      >
        <path
          d="M6.13171 3.39618V16.3996H3.12659V19.3996H6.13171V21.3647H9.13171V13.3974H12.1266V10.3974L9.13171 10.3974V3.39618H6.13171Z"
          fill="currentColor"
        ></path>
        <path
          d="M15.1289 3.39618V5.40326H12.1266V8.40326H15.1289V21.3647H18.1289V16.3981H21.1266V13.3981H18.1289V3.39618H15.1289Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  Candle: {
    type: 1,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="chart-type ele"
      >
        <path
          d="M19.1266 3.55127H16.1266V7.55127H13.1266V17.5513H16.1266V21.5513H19.1266V17.5513H22.1266V7.55127H19.1266V3.55127Z"
          fill="currentColor"
        ></path>
        <path
          d="M11.1266 11.5513H8.12659V7.55127H5.12659V11.5513H2.12659V17.5513H5.12659V21.5513H8.12659V17.5513H11.1266V11.5513Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  Area: {
    type: 3,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="ele"
      >
        <path
          d="M19.0035 1.04468L10.0963 9.95175L6.59593 6.46205L0.988159 12.0698L3.10948 14.1911L6.59917 10.7015L10.0995 14.1911L21.1248 3.16601L19.0035 1.04468Z"
          fill="currentColor"
        ></path>
        <path
          d="M21.1266 21.1653V7.16528L10.1266 18.1653H10.1227L6.62463 14.6672L3.12659 18.1653V21.1653H21.1266Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  Line: {
    type: 2,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="ele"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M21.1266 5.0127H3.12659V19.0127H21.1266V5.0127ZM13.6267 15.2796L19.1258 9.78046L17.358 8.0127L13.6267 11.744L10.6267 8.74405L5.12659 14.2441L6.89435 16.0119L10.6267 12.2796L13.6267 15.2796Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  Baseline: {
    type: 10,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="ele"
      >
        <path
          d="M9.12659 3.93579H15.1266V10.9358H9.12659V3.93579Z"
          fill="currentColor"
        ></path>
        <path
          d="M9.12659 10.9358V17.9358H3.12659V10.9358H9.12659Z"
          fill="currentColor"
        ></path>
        <path
          d="M15.1266 10.9358V21.9358H21.1266V10.9358H15.1266Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  // 'Heikin-Ashi': {
  //   type: 8,
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 25 25"
  //       fill="none"
  //       className="ele"
  //     >
  //       <path
  //         d="M8.12659 6.63989H11.1266V15.6239H2.12659V6.63989H5.12659V2.63989H8.12659V6.63989Z"
  //         fill="currentColor"
  //       ></path>
  //       <path
  //         d="M19.1266 3.62817H16.1266L16.1266 7.62817H13.1266V21.6282H22.1266V7.62817H19.1266V3.62817Z"
  //         fill="currentColor"
  //       ></path>
  //     </svg>
  //   ),
  // },
  'Hollow Candles': {
    type: 9,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="ele"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.1266 3.70508H19.1266V7.70508H22.1266V17.7041H19.1266V21.7041H16.1266L16.1266 17.7041H13.1266V7.70508H16.1266L16.1266 3.70508ZM19.1266 10.7051H16.1266V14.7041H19.1266V10.7051Z"
          fill="currentColor"
        ></path>
        <path
          d="M8.12659 11.7051H11.1266V17.7051H8.12659V21.7051H5.12659V17.7051H2.12659V11.7051H5.12659V7.70508H8.12659V11.7051Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
  // 'Hi-Lo': {
  //   type: 12,
  //   icon: (
  //     <svg
  //       xmlns="http://www.w3.org/2000/svg"
  //       viewBox="0 0 25 25"
  //       fill="none"
  //       className="ele"
  //     >
  //       <path
  //         fill-rule="evenodd"
  //         clip-rule="evenodd"
  //         d="M16.1266 3.70508H19.1266V7.70508H22.1266V17.7041H19.1266V21.7041H16.1266L16.1266 17.7041H13.1266V7.70508H16.1266L16.1266 3.70508ZM19.1266 10.7051H16.1266V14.7041H19.1266V10.7051Z"
  //         fill="currentColor"
  //       ></path>
  //       <path
  //         d="M8.12659 11.7051H11.1266V17.7051H8.12659V21.7051H5.12659V17.7051H2.12659V11.7051H5.12659V7.70508H8.12659V11.7051Z"
  //         fill="currentColor"
  //       ></path>
  //     </svg>
  //   ),
  // },
  Column: {
    type: 12,
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 25 25"
        fill="none"
        className="ele"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M16.1266 3.70508H19.1266V7.70508H22.1266V17.7041H19.1266V21.7041H16.1266L16.1266 17.7041H13.1266V7.70508H16.1266L16.1266 3.70508ZM19.1266 10.7051H16.1266V14.7041H19.1266V10.7051Z"
          fill="currentColor"
        ></path>
        <path
          d="M8.12659 11.7051H11.1266V17.7051H8.12659V21.7051H5.12659V17.7051H2.12659V11.7051H5.12659V7.70508H8.12659V11.7051Z"
          fill="currentColor"
        ></path>
      </svg>
    ),
  },
};

const ChartTypeSelectionDD: React.FC<any> = ({ active, setActive }) => {
  const find = Object.keys(chartTypes).find(
    (c) => chartTypes[c].type == active
  );
  return (
    <div>
      <>
        <BufferDropdown
          items={Object.keys(chartTypes).map((s) => ({
            name: s,
            value: chartTypes[s],
          }))}
          className={'chart-type-dd '}
          initialActive={0}
          dropdownBox={() => (
            <div className="flex whitespace-nowrap chart-type items-center mr-5 text-f11 ele">
              {chartTypes[find].icon}
              Chart Type
            </div>
          )}
          rootClass={'!w-[fit-content]'}
          item={(item) => {
            return (
              <div
                onClick={(e) => {
                  setActive(item.value.type);
                }}
                className={`chart-type my-2 ${
                  active == item.value.type ? 'active-chart' : ''
                }`}
              >
                {item.value.icon}
                <span className="ele whitespace-nowrap">
                  {item.name.replace('_', ' ')}
                </span>
              </div>
            );
          }}
        ></BufferDropdown>
        {/* <div
          onClick={(e) => {
            setActive(chartTypes[type].type);
          }}
          className={
            chartTypes[type].type == active ? "active chart-type" : "chart-type"
          }
        ></div> */}
      </>
    </div>
  );
};

const ChartElementSVG = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={18}
    height={18}
    fill="none"
    className="css-9698k2"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 20h3v-6.791l3.767-3.767.967.966 1.767 1.768 6.364-6.364-1.767-1.768-4.596 4.596-.967-.966-1.768-1.768L7 9.673V4H4v16zm16 0H7v-3h13v3zm-6.5-7.823 2.828 2.828h-5.656l2.828-2.828z"
      fill="currentColor"
    />
  </svg>
);

export { ChartTypeSelectionDD, ChartElementSVG };
