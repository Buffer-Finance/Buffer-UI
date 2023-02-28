export const getSlicedUserAddress = (
  address: string,
  shownCharacters: number
) => {
  return (
    address.slice(0, shownCharacters) + '...' + address.slice(-shownCharacters)
  );
};
