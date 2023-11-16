import { ClickAwayListener, IconButton } from '@mui/material';
import { useState } from 'react';
import SidebarCss from './styles';
import { useGlobal } from '@Contexts/Global';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from 'react-reveal/Fade';
import { getTabs, ITab } from 'src/Config/getTabs';
import { BufferLogoComponent } from '../Navbar/BufferLogo';
import { NavLink } from 'react-router-dom';
import Twitter from 'public/Social/twitter';
import Discord from 'public/Social/discord';
import Medium from 'public/Social/medium';
import GitHub from 'public/Social/github';
import Telegram from 'public/Social/telegram';
import CloseLogo from '@SVG/Elements/Closelogo';
import { CloseButton } from '@Views/TradePage/Components/CloseButton';
import BackIcon from '@SVG/buttons/back';
import MemoHamburgerBack from '@SVG/Elements/sidebarCollpaseIcon';
import { NewChip, newTabs } from '../Navbar';
const social = [
  {
    Img: Twitter,
    link: 'https://twitter.com/Buffer_Finance',
    name: 'Twitter',
  },
  {
    Img: Discord,
    link: 'https://discord.com/invite/Hj4QF92Kdc',
    name: 'Discord',
  },
  {
    Img: Telegram,
    link: 'https://t.me/bufferfinance',
    name: 'Telegram',
  },
  {
    Img: Medium,
    link: 'https://buffer-finance.medium.com/',
    name: 'Medium',
  },
  {
    Img: GitHub,
    link: 'https://github.com/Buffer-Finance',
    name: 'GitHub',
  },
];
const SideBar: React.FC<any> = () => {
  const newPageNavElements = 9;
  const { state, dispatch } = useGlobal();
  const options = getTabs();

  const handleChange = (link: string) => {
    handleClose();
    window.open(link);
  };

  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };

  return (
    <SidebarCss>
      {state.sidebar_active ? null : (
        <div className="overlay" onClick={handleClose}></div>
      )}

      <div
        className={`bg-1 sidebar  ${
          state.sidebar_active ? '' : 'sidebar-closed'
        } a1400:!hidden`}
      >
        <div className="sidebar_container flex-col items-start">
          <div className="icon_container mb-6 ml-3">
            <div
              className="flex items-center justify-between w-full"
              role={'button'}
              onClick={
                () => {}
                // router.push({
                //   pathname: "/",
                // })
              }
            >
              <BufferLogoComponent />
              <IconButton className="collapse-icon" onClick={handleClose}>
                <MemoHamburgerBack />
              </IconButton>
            </div>
          </div>
          {options.map((option, key) => {
            if (key >= newPageNavElements || option.isExternalLink) {
              return (
                <button
                  key={option.name}
                  className={`item !w-full !ml-[0px] !mr-[0px]`}
                  onClick={() => {
                    handleChange(option.to);
                  }}
                >
                  {/* <SidebarIcon id={option.id} active={active} /> */}
                  <div className="name flex items-center gap-2">
                    {option.name} {newTabs.includes(option.name) && <NewChip />}
                  </div>{' '}
                </button>
              );
            }
            return option.subTabs.length > 0 ? (
              // active=router.asPath.includes(option.subTab.slug);
              <SubTabDropDown tab={option} defaultName={'Lol'} key={key} />
            ) : (
              <NavLink
                key={option.name}
                to={option.to}
                onClick={handleClose}
                className={({ isActive }) =>
                  `item ${isActive ? 'active ' : ''} 
          `
                }
              >
                <div className="name flex items-center gap-2">
                  {option.name} {newTabs.includes(option.name) && <NewChip />}
                </div>
              </NavLink>
            );
          })}
          {/* <div className=" text-2 mb-3 mt-[10vh] text-left text-f13 pl-[2rem]">
            Connect with us on{' '}
          </div>
          <div className=" bbborderrr flex w-full justify-center">
            <div className="flex  w-full flex-row items-center  flex-wrap gap-[4px] pl-[2rem]">
              {social.map((S) => {
                return (
                  <a key={S} className="unset" href={S.link} target="_blank">
                    <span className="text-2 ">
                      <S.Img className="" />
                    </span>
                  </a>
                );
              })}
            </div>
          </div> */}
        </div>
      </div>
    </SidebarCss>
  );
};
export default SideBar;

const SubTabDropDown = ({
  tab,
  defaultName,
}: {
  tab: ITab;
  defaultName: string;
}) => {
  const { dispatch } = useGlobal();
  const option = tab;
  const [open, setOpen] = useState(false);
  const handleClickAway = () => {
    setOpen(false);
  };
  const handleClose = () => {
    dispatch({
      type: 'UPDATE_SIDEBAR_STATE',
    });
  };
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <>
        <button
          className={`flex-bw unset sr xmpr  text-6
          `}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className="flex-center dropdown">
            {/* <SidebarIcon id={option.id} active={active} /> */}
            <div className="name">{defaultName}</div>
          </div>
          <div className="liftup">
            <ExpandMoreIcon className={`arrow ${!open ? '' : 'rotate'} `} />
          </div>
        </button>
        <Fade center when={open} collapse duration={500}>
          <div className="dropdown-box">
            {option.subTabs.map((subTab: ITab, index: number) => {
              return (
                <NavLink
                  key={option.name}
                  to={option.to}
                  className={({ isActive }) =>
                    `dropdown-item ${isActive ? 'active' : ''} 
          `
                  }
                >
                  <div className="name" role={'button'} onClick={handleClose}>
                    {option.name}
                  </div>
                </NavLink>
              );
            })}
          </div>
        </Fade>
      </>
    </ClickAwayListener>
  );
};
