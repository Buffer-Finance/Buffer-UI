import React, { useEffect, useState } from 'react';

interface Props {
  data: Record<string, any>;
}

interface Props {
  data: Record<string, any>;
  onDataChange?: (data: Record<string, any>) => void;
}

const NestedObjectDisplay: React.FC<Props> = ({ data, onDataChange }) => {
  const [epoch, setEpoch] = useState(0);
  const [pause, setPause] = useState(false);
  useEffect(() => {
    let interval;
    if (!pause) {
      interval = setInterval(() => {
        setEpoch((e) => e + 100);
      }, 100);
    }
    return () => {
      clearInterval(interval);
    };
  }, [pause]);
  return (
    <div>
      {epoch / 1000}s {epoch % 1000}ms
      <button onClick={() => setPause((p) => !p)}>
        {pause ? 'paused' : 'not-paused'}
      </button>
    </div>
  );
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
