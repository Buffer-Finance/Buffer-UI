import { useMemo, useState } from 'react';

export const CustomHookUseMemoTest = () => {
  return (
    <>
      <Counter1 />
      <Counter2 />
    </>
  );
};

const useCount = () => {
  const [count, setCount] = useState(0);
  const increment = () => setCount(count + 1);

  const doubleCount = useMemo(() => {
    console.log('memo runs');
    return count * 2;
  }, [count]);

  return { count, increment, doubleCount };
};

const Counter1 = () => {
  const { count, increment } = useCount();
  return (
    <div>
      <h1>Counter 1</h1>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
};

const Counter2 = () => {
  const { count, increment } = useCount();
  return (
    <div>
      <h1>Counter 2</h1>
      <h2>Count: {count}</h2>
      <button onClick={increment}>Increment</button>
    </div>
  );
};
