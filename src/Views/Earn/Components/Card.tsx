import { Divider } from './Divider';

export function Card({
  top,
  bottom,
  middle,
  right,
}: {
  top: any;
  bottom?: any;
  middle: any;
  right?: any;
}) {
  return (
    <div className="p-5 text-f15 bg-2 h-full w-full rounded-sm border border-[#23263b] ">
      <div className="flex justify-between sm:flex-col sm:justify-center h-full">
        <div className="flex flex-col justify-between w-full">
          <div className="justify-self-start">
            <div className="text-1 text-f16">{top}</div>
            <Divider />
            {middle}
          </div>

          <div className="justify-self-end">
            {bottom && (
              <>
                <Divider />
                {bottom}
              </>
            )}
          </div>
        </div>

        {right && <div className="ml-2 sm:m-auto"> {right}</div>}
      </div>
    </div>
  );
}
