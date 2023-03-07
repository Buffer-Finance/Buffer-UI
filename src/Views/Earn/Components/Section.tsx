export const Section = ({
  Heading,
  subHeading,
  Cards,
  other,
}: {
  Heading: JSX.Element;
  subHeading: JSX.Element;
  Cards?: JSX.Element[];
  other?: JSX.Element;
}) => {
  return (
    <div className="first-of-type:mt-5 mt-8 max-w-[100vw]">
      <div className="text-[22px]">{Heading}</div>
      <div className="text-f16 text-2 mb-6">{subHeading}</div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-1 mx-3">
        {Cards &&
          Cards.map((card, index) => (
            <div key={index} className="">
              {card}
            </div>
          ))}
      </div>
      {other && <div className="mt-6">{other}</div>}
    </div>
  );
};
