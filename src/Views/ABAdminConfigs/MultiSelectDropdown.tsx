import { ReactMenu } from '@Views/Common/ReactMenu';

export const MultiSelectDropdown = ({
  options,
}: {
  options: JSX.Element[];
}) => {
  console.log(options, 'options');
  return (
    <ReactMenu
      MenuHeader={<div>Select Assets</div>}
      MenuOptions={<>{options}</>}
    />
  );
};
