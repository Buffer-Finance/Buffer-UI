export const PairTokenImage = ({
  pair,
  size = 25,
}: {
  pair: string;
  size?: number;
}) => {
  const [token1, token2] = pair.split('-');
  const imageSrc =
    'https://cdn.buffer.finance/Buffer-Website-Data/main/Assets/';
  return (
    <div className="flex items-center">
      <img
        src={imageSrc + token1.toLowerCase() + '.svg'}
        className="relative z-10"
        width={size}
        height={size}
      />
      <img
        src={imageSrc + token2.toLowerCase() + '.svg'}
        className="relative z-0 -left-3"
        width={size}
        height={size}
      />
    </div>
  );
};
