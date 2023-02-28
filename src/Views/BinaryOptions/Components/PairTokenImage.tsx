export const PairTokenImage = ({ pair }: { pair: string }) => {
  const [token1, token2] = pair.split('-');
  const shouldShowSecondImage = token2.toLowerCase() !== 'usd';
  const imageSrc =
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/';
  if (!shouldShowSecondImage)
    return (
      <img
        src={imageSrc + token1.toLowerCase() + '.png'}
        className="relative z-10 w-full h-full"
      />
    );
  return (
    <div
      className={`relative w-full h-full
      `}
    >
      <img
        src={imageSrc + token1.toLowerCase() + '.png'}
        className="absolute z-10 -left-[1px] bottom-[0] w-[75%] h-[75%]"
      />
      <img
        src={imageSrc + token2.toLowerCase() + '.png'}
        className="absolute z-0 -right-[1px] top-[0] w-[75%] h-[75%]"
      />
    </div>
  );
};
