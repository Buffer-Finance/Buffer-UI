import Background from './style';
import Button from '@Views/Common/Buttons';
import { IconButton } from '@mui/material';
import CrossIcon from 'src/SVG/buttons/cross';
import { useGlobal } from '@Contexts/Global';
import { isTestnet } from 'config';

interface ITryTestnetBanner {}

const TryTestnetBanner: React.FC<ITryTestnetBanner> = ({}) => {
  const { dispatch, state } = useGlobal();
  const show = state.show.tryTestnet;
  return show ? (
    <Background className="web:mb-4">
      <IconButton
        className="cross-icon-wrapper"
        onClick={() => dispatch({ type: 'SET_TRY_TESTNET', payload: false })}
      >
        <CrossIcon className="cross-icon" />
      </IconButton>
      <p className="font1 weight-500 testTxt">
        Make a prediction on the asset of your choice that will go up or down
      </p>
      <a
        href={`https://${!isTestnet ? 'testnet' : 'app'}.buffer.finance`}
        className="unset"
        target={'_blank'}
      >
        <Button className="font3 weight-600 testBtn">
          Try {!isTestnet ? 'Testnet' : 'Mainnet'}
        </Button>
      </a>
      <img className="testImg" src="/testnet.png" />
    </Background>
  ) : (
    <></>
  );
};

export default TryTestnetBanner;
