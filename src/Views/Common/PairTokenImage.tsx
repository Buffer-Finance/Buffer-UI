export const PairTokenImage = ({
  pair,
  image1,
  image2,
}: {
  pair: { token0: string; token1: string };
  image1?: string;
  image2?: string;
}) => {
  if (image1 !== undefined && image2 !== undefined)
    return (
      <div
        className={`relative w-full h-full
        `}
      >
        <img
          src={image1}
          className="absolute z-1 -left-[1px] bottom-[0] w-[75%] h-[75%]"
        />
        <img
          src={image2}
          className="absolute z-0 -right-[1px] top-[0] w-[75%] h-[75%]"
        />
      </div>
    );
  const { token0: token1, token1: token2 } = pair;
  const shouldShowSecondImage = token2?.toLowerCase() !== 'usd';
  const imageSrc =
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/w_50,h_50,c_fill,r_max/Assets/';
  if (!shouldShowSecondImage)
    return (
      <img
        src={imageSrc + token1.toLowerCase() + '.png'}
        className="relative z-1 w-full h-full"
      />
    );
  return (
    <div
      className={`relative w-full h-full
        `}
    >
      <img
        src={imageSrc + token1.toLowerCase() + '.png'}
        className="absolute z-1 -left-[1px] bottom-[0] w-[75%] h-[75%]"
      />
      <img
        src={imageSrc + token2.toLowerCase() + '.png'}
        className="absolute z-0 -right-[1px] top-[0] w-[75%] h-[75%]"
      />
    </div>
  );
};
