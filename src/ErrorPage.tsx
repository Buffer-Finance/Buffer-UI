import { ClickEvent } from '@szhsin/react-menu';

const ErrorPage: React.FC<any> = ({}) => {
  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    let arr = undefined;
    arr.map((a) => a);
  };
  return (
    <div className="flex flex-col">
      I am the errro<button onClick={onClick}>Click me for error</button>
    </div>
  );
};

export { ErrorPage };
