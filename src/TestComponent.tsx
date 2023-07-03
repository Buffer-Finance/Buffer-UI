import { Call } from '@Utils/Contract/multiContract';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';

const TestComponent: React.FC<any> = ({}) => {
  console.log(`TestComponent-TestComponent(d): `, TestComponent);
  return <div>hello</div>;
};
export default TestComponent;
