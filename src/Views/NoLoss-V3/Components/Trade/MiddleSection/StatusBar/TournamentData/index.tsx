export const TournamentData = () => {
  const dataArray = [
    {
      head: 'score',
      data: 'dummy',
    },
    {
      head: 'rank',
      data: 'dummy',
    },
    {
      head: 'play tokens',
      data: 'dummy',
    },
  ];
  return (
    <div className="flex items-center gap-[17px] ml-auto">
      {dataArray.map((data, index) => {
        return (
          <div key={data.head} className="flex items-center gap-[17px]">
            <div className="flex flex-col justify-center items-start gap-y-1 b1200:w-1/2 ">
              <span className="capitalize text-f12 b1200:text-f10 text-[#82828F]">
                {data.head}
              </span>
              <span className="text-f12 w-fit b1200:text-f10">{data.data}</span>
            </div>
            {index !== dataArray.length - 1 && (
              <div className="w-[1px] h-7 bg-[#2D2D3D]" />
            )}
          </div>
        );
      })}
    </div>
  );
};
