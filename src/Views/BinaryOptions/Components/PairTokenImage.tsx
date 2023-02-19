export const PairTokenImage = ({
  pair,
  size = 20,
  className = '',
}: {
  pair: string;
  size?: number;
  className?: string;
}) => {
  const [token1, token2] = pair.split('-');
  const shouldShowSecondImage = token2.toLowerCase() !== 'usd';
  const imageSrc =
    // 'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/';
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/w_100,h_100,c_fill,r_max/Assets/';
  return (
    <div
      className={`flex items-center ${className} ${
        !shouldShowSecondImage ? `mr-[6px]` : ``
      }`}
    >
      <img
        src={imageSrc + token1.toLowerCase() + '.png'}
        className="relative z-10"
        width={size}
        height={size}
      />
      {shouldShowSecondImage && (
        <img
          src={imageSrc + token2.toLowerCase() + '.png'}
          className="relative z-0 -left-[15%]"
          width={size}
          height={size}
        />
      )}
    </div>
  );
};
