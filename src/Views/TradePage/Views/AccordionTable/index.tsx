import { useState } from 'react';

const AccordionTable: React.FC<any> = ({}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      className={` bg-blue ${
        expanded ? 'h-[400px]' : 'h-[40px]'
      } transition-all`}
      onClick={() => setExpanded((p) => !p)}
    >
      I am table
    </div>
  );
};

export { AccordionTable };
