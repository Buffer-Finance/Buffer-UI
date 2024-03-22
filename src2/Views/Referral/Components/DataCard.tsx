import PlainCard from './PlainCard';

export const DataCard = ({
  header,
  desc,
}: {
  header: string;
  desc: JSX.Element;
}) => {
  return (
    <PlainCard.Container className="w-fit m-[0] py-5 !px-7">
      <PlainCard.Header className="capitalize">{header}</PlainCard.Header>
      <PlainCard.Description className="text-center text-buffer-blue text-f22">
        {desc}
      </PlainCard.Description>
    </PlainCard.Container>
  );
};
