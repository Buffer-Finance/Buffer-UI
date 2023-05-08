import React, { useState } from 'react';

interface Props {
  data: Record<string, any>;
}

interface Props {
  data: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
}

const NestedObjectDisplay: React.FC<Props> = ({ data, onDataChange }) => {
  const [localData, setLocalData] = useState(data);

  const handleValueChange = (key: string, value: any) => {
    const updatedData = {
      ...localData,
      [key]: value,
    };
    setLocalData(updatedData);
    onDataChange && onDataChange(updatedData);
  };

  const renderData = (obj: Record<string, any>): JSX.Element[] => {
    return Object.keys(obj).map((key: string) => {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        return (
          <div key={key}>
            <h3>{key}</h3>
            {renderData(value)}
          </div>
        );
      } else {
        return (
          <div key={key}>
            <span>{key}: </span>
            <input
              type="text "
              className="text-blue"
              value={localData[key]}
              onChange={(e) => handleValueChange(key, e.target.value)}
            />
          </div>
        );
      }
    });
  };

  return <div>{renderData(localData)}</div>;
};

interface Person {
  name: string;
  age: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

const ExampleComponent: React.FC = () => {
  const [optionState, setOptionState] = useState({
    balance: '100',
    allowance: true,
    maxFee: '0.05',
    minFee: '0.01',
    maxPeriod: '30',
    minPeriod: '1',
    activeMarket: {
      name: 'Market A',
      id: 'market-a',
      isOpen: true,
    },
    payout: {
      total: '200',
      boosted: '300',
    },
  });

  const handleOptionStateChange = (newOptionState) => {
    setOptionState(newOptionState);
    // Do any additional processing here
  };

  return (
    <NestedObjectDisplay
      data={optionState}
      onDataChange={handleOptionStateChange}
    />
  );
};

export default ExampleComponent;
