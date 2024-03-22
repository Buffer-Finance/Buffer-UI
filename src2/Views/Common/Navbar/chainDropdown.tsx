import { BufferDropdown } from '@Views/Common/Buffer-Dropdown';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { ArrowDropDownRounded } from '@mui/icons-material';
import styled from '@emotion/styled';
import { getChains } from 'src/Config/wagmiClient';
import { useActiveChain } from '@Hooks/useActiveChain';
import { arbitrum, arbitrumGoerli, polygon, polygonMumbai } from 'wagmi/chains';

const ChainDropdownBackground = styled.div`
  .dropdown-value {
    color: var(--text-1);

    @media only screen and (max-width: 600px) {
      font-size: 1.4rem;
    }

    .assetImage {
      border-radius: 50%;
      object-fit: cover;
      margin-right: 0.9rem;
    }
  }

  .dot {
    width: 0.8rem;
    height: 0.8rem;
    color: var(--text-6);
  }

  .chain-row {
    &.active {
      .chain-container {
        color: var(--text-1);
      }
      .dot {
        color: var(--text-7);
      }
    }
  }
`;

interface INavbar {
  className?: string;
}

export const chainImageMappipng = {
  [polygon.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [polygonMumbai.name]:
    'https://res.cloudinary.com/dtuuhbeqt/image/upload/v1684086043/polygon2.png',
  [arbitrum.name]: '/Chains/ARBITRIUM.png',
  [arbitrumGoerli.name]: '/Chains/ARBITRIUM.png',
  ['BSC']: '/Chains/BSC.png',
};

export const chainSymbolMapping = {
  [polygon.name]: 'POLYGON',
  [polygonMumbai.name]: 'POLYGON',
  [arbitrum.name]: 'ARBITRUM',
  [arbitrumGoerli.name]: 'ARBITRUM',
  ['BSC']: 'BSC',
};

export const ChainDropdown: React.FC<INavbar> = ({ className }) => {
  const chains = getChains();
  const { activeChain } = useActiveChain();
  const activeChainName = activeChain.name;
  return (
    <ChainDropdownBackground>
      <BufferDropdown
        items={chains.map((chain) => ({
          name: chain.name,
          img: chainImageMappipng[chain.name],
          displayName: chain.name.split(' ')[0],
        }))}
        chainDropDown={true}
        dropdownBox={(activeItem, isOpen, disabled) => {
          return (
            <div
              className={`flex items-center justify-center text-f13  h-[30px] w-max rounded-[7px] pl-3 pr-[1px] sm:pr-1 transition-all duration-300 ${
                isOpen ? 'bg-3' : 'bg-4 hover:brightness-125 hover:bg-1'
              }`}
            >
              <div className="flex items-center dropdown-value f15 capitalize weight-400">
                <img
                  className="h-[18px] w-[18px] mr-[6px] sm:mr-[0px] rounded-full"
                  src={chainImageMappipng[activeChainName]}
                  alt=""
                />

                <span className="sm:hidden">
                  {activeChainName?.split(' ')[0]}
                </span>
              </div>
              {!disabled && (
                <ArrowDropDownRounded
                  className={`dropdown-arrow transition-all duration-300 w-6 h-6 ease-out ${
                    isOpen ? 'origin rotate-180' : ''
                  }`}
                />
              )}
            </div>
          );
        }}
        className="px-[20px] py-4 bg-1"
        item={(singleItem, handleClose, onChange, active) => (
          <div
            key={singleItem.name}
            role="button"
            onClick={() => {
              handleClose();
            }}
            className={`${
              singleItem.name === activeChainName && 'active text-1'
            } chain-row flex min-w-max justify-between items-center py-3 text-4 hover:text-1 text-f15 font-normal transition-all duration-150 ease-in-out`}
          >
            <span className="flex items-center mr-4 capitalize">
              <img
                className="w-5 h-5 rounded-full mr-3"
                src={singleItem.img}
                alt="chain"
              />
              {singleItem.displayName}
            </span>
            {/* <FiberManualRecordIcon className={`dot justify-self-end`} /> */}
          </div>
        )}
      />
    </ChainDropdownBackground>
  );
};
