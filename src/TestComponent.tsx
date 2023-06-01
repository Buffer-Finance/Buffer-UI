import { Call } from '@Utils/Contract/multiContract';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

const callsAtom = atom<{ [key: string]: Call[] }>({});

const TestComponent: React.FC<any> = ({}) => {
  const [calls, setCall] = useAtom(callsAtom);
  const add = () => {
    setCall((d) => ({
      ...d,
      root: [-1, -2, -3],
    }));
  };
  const rem = () => {
    setCall((d) => ({
      ...d,
      root: [],
    }));
  };
  useEffect(() => {
    console.log(`TestComponent-calls: `, calls);
    let calllls = [];
    Object.keys(calls).forEach((r) => {
      if (calls[r].length) {
        calllls = [...calllls, ...calls[r]];
      }
    });
    console.log(`TestComponent-calllls: `, calllls);
  }, [calls]);
  return (
    <div className="flex-col ">
      <div>
        <button onClick={add}>Add Call</button>
        <button onClick={rem}>Remove Call</button>
      </div>
      <TestComponent1 />
      <TestComponent2 />
      <TestComponent3 />
      <TestComponent4 />
    </div>
  );
};
const TestComponent1: React.FC<any> = ({}) => {
  const [calls, setCall] = useAtom(callsAtom);

  const add = () => {
    setCall((d) => ({
      ...d,
      root1: [11, 12, 13],
    }));
  };
  const rem = () => {
    setCall((d) => ({
      ...d,
      root1: [],
    }));
  };
  return (
    <div>
      <button onClick={add}>Add Call</button>

      <button onClick={rem}>Remove Call</button>
    </div>
  );
};
const TestComponent2: React.FC<any> = ({}) => {
  const [calls, setCall] = useAtom(callsAtom);

  const add = () => {
    setCall((d) => ({
      ...d,
      root2: [21, 22, 23],
    }));
  };
  const rem = () => {
    setCall((d) => ({
      ...d,
      root2: [],
    }));
  };
  return (
    <div>
      <button onClick={add}>Add Call</button>

      <button onClick={rem}>Remove Call</button>
    </div>
  );
};
const TestComponent3: React.FC<any> = ({}) => {
  const [calls, setCall] = useAtom(callsAtom);

  const add = () => {
    setCall((d) => ({
      ...d,
      root3: [31, 32, 33],
    }));
  };
  const rem = () => {
    setCall((d) => ({
      ...d,
      root3: [],
    }));
  };
  return (
    <div>
      <button onClick={add}>Add Call</button>

      <button onClick={rem}>Remove Call</button>
    </div>
  );
};
const TestComponent4: React.FC<any> = ({}) => {
  const [calls, setCall] = useAtom(callsAtom);

  const add = () => {
    setCall((d) => ({
      ...d,
      root4: [41, 42, 43],
    }));
  };
  const rem = () => {
    setCall((d) => ({
      ...d,
      root4: [],
    }));
  };
  return (
    <div>
      <button onClick={add}>Add Call</button>

      <button onClick={rem}>Remove Call</button>
    </div>
  );
};

export { TestComponent };
