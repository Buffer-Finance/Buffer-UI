import { ReactNode } from 'react';

interface IPlainCard {
  className?: string;
  children?: ReactNode;
}
let PlainCard: {
  Container: React.FC<IPlainCard>;
  Header: React.FC<IPlainCard>;
  Description: React.FC<IPlainCard>;
} = {
  Container: ({ className, children }) => {
    return (
      <div
        className={
          className +
          '  bg-1 sm:m-auto  rounded-lg  web:px-8  sm:p-6 sm:max-w-full '
        }
      >
        {children}
      </div>
    );
  },
  Header: ({ className, children }) => {
    return (
      <div className={className + '  text-f18 text-center  mb-5 '}>
        {children}
      </div>
    );
  },
  Description: ({ className, children }) => {
    return (
      <div className={className + '   text-f15    text-3'}>{children}</div>
    );
  },
};

export default PlainCard;
