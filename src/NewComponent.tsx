import { useState } from 'react';
let i = 0;
const NewComponent: React.FC<any> = ({}) => {
  const [c, setc] = useState(0);
  const inc = async () => {
    setc(c + 1);
    setInterval(() => {
      i++;
      setc(i);
    }, 1);
  };
  return (
    <main className="content-drawer">
      <button onClick={inc}>{c}</button>
    </main>
  );
};

export { NewComponent };
