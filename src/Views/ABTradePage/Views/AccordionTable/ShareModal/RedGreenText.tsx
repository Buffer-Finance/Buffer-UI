import { lt } from '@Utils/NumString/stringArithmatics';

export const RedGreenText = ({
  displayText,
  conditionValue,
}: {
  displayText: JSX.Element;
  conditionValue: string;
}) => {
  return (
    <span
      className={`nowrap flex ${
        lt(conditionValue, '0') ? 'text-red' : 'text-green'
      }`}
    >
      {displayText}
    </span>
  );
};
