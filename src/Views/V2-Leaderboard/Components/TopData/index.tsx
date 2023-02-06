export function TopData({
  pageImage,
  heading,
  desc,
  DataCom,
}: {
  pageImage: JSX.Element;
  heading: string | JSX.Element;
  DataCom: JSX.Element;
  desc?: JSX.Element;
}) {
  return (
    <div className="w-fit mt-5 b1200:mx-auto tab:flex-col tab:items-center">
      <div className="flex items-center">
        {pageImage && <div>{pageImage}</div>}
        <div className="flex-col ml-4">
          <p className="text-f22 fw4 text-5 tab:text-f16">{heading}</p>
          {desc && <p className="text-f16 fw5 text-6 tab:text-f13">{desc}</p>}
        </div>
      </div>
      {DataCom}
    </div>
  );
}
