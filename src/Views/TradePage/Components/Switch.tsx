import styled from '@emotion/styled';
import { ChangeEvent } from 'react';

const Background = styled.div`
  width: fit-content;
  position: relative;
  .theme-switcher {
    cursor: pointer;
    margin: 0 auto;

    .background {
      width: 33px;
      height: 18px;
      background-color: var(--bg-14);
      border-radius: 13px;
      display: flex;
      align-items: center;
      justify-content: space-around;
    }

    .switch {
      height: 11px;
      width: 11px;
      background-color: #4f505e;
      position: absolute;
      top: 3.7px;
      left: 4px;
      border-radius: 50%;
      transition: all 0.2s ease-in-out;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    input {
      display: none;
      &:checked + .switch {
        background-color: #3772ff;
        left: 18px;
      }
    }
  }
`;

export const Switch: React.FC<{
  isOn: boolean;
  onChange: (event: ChangeEvent) => void;
  className?: string;
}> = ({ isOn = true, onChange, className = '' }) => {
  return (
    <Background>
      <label className="theme-switcher" htmlFor="themeswitch">
        <div className="background"></div>
        <input
          checked={isOn}
          type="checkbox"
          id="themeswitch"
          onChange={onChange}
        />
        <div className="switch"> </div>
      </label>
    </Background>
  );
};
