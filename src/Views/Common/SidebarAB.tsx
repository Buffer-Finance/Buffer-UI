import MemoAboveBelow from '@SVG/Elements/AboveBelow';
import MemoUpDown from '@SVG/Elements/UpDown';
import { Link, useLocation, useParams } from 'react-router-dom';

const Slug2Icon = {
  binary: MemoUpDown,
  ab: MemoAboveBelow,
};
const tabs = [
  {
    tab: 'Up Down',
    slug: 'binary',
  },
  {
    tab: 'Above Below',
    slug: 'ab',
  },
];

const Sidebar: React.FC<any> = ({}) => {
  const location = useLocation();
  const params = useParams();
  let show = false;
  return tabs.filter((t) => location.pathname.includes(t.slug)).length ? (
    <aside className="w-[70px] sm:pt-[3px] gap-[17px] py-5 h-full sm:h-fit sm:py-[0px] sm:px-[5px]  flex flex-col items-center sm:flex-row sm:w-full ">
      {tabs.map((t) => {
        let Icon = Slug2Icon[t.slug];
        const isActive = location.pathname.includes(t.slug);
        return (
          <Link to={`/${t.slug}/BTC-USD/`}>
            <div
              className={`flex  gap-[5px] flex-col items-center text-f16 sm:flex-row sm:border-[0px]  text-center border-[4px] border-visible ${
                isActive ? 'border-activetab text-1' : ' text-2'
              }  `}
            >
              <Icon active={location.pathname.includes(t.slug)} />
              <div>{t.tab}</div>
            </div>
          </Link>
        );
      })}
    </aside>
  ) : null;
};

export { Sidebar };
