export const Section = ({
  Heading,
  subHeading,
  Cards,
  other,
  HeadingRight,
  className = '',
}: {
  Heading: JSX.Element;
  subHeading: JSX.Element;
  Cards?: JSX.Element[];
  other?: JSX.Element;
  HeadingRight?: JSX.Element;
  className?: string;
}) => {
  return (
    <div className={`first-of-type:mt-5 mt-8 max-w-[100vw] ${className}`}>
      <div className="flex items-end justify-between flex-wrap mb-6 gap-3">
        <div className={!HeadingRight ? 'w-full' : 'w-fit'}>
          <div className="text-[22px]">{Heading}</div>
          <div className="text-f16 text-2 ">{subHeading}</div>
        </div>
        {HeadingRight && <div className="mr-3">{HeadingRight}</div>}
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mx-3">
        {Cards &&
          Cards.map((card, index) => (
            <div key={index} className="">
              {card}
            </div>
          ))}
      </div>
      {other && <div className="mx-3">{other}</div>}
    </div>
  );
};
