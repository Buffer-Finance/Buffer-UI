import { FallbackProps } from 'react-error-boundary';

export const ErrorComponenet = (props: FallbackProps) => {
  console.log('Error Handlered', props);
  return (
    <div className="grid items-center text-1 text-f20">
      Something went wrong.
    </div>
  );
};
