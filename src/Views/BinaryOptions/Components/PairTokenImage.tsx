export const PairTokenImage = ({
  pair,
  size = 20,
}: {
  pair: string;
  size?: number;
}) => {
  const [token1, token2] = pair.split('-');
  const shouldShowSecondImage = token2.toLowerCase() !== 'usd';
  const imageSrc =
    'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/';
  return (
    <div
      className={`flex items-center ${
        !shouldShowSecondImage ? 'mr-[6px]' : ''
      }`}
    >
      <img
        src={imageSrc + token1.toLowerCase() + '.svg'}
        className="relative z-10"
        width={size}
        height={size}
      />
      {shouldShowSecondImage && (
        <img
          src={imageSrc + token2.toLowerCase() + '.svg'}
          className="relative z-0 -left-[15%]"
          width={size}
          height={size}
        />
      )}
    </div>
  );
};
