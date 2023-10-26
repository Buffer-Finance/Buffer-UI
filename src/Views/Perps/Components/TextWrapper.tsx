import styled from '@emotion/styled';

export const SettingsHeaderText = styled.div`
  font-size: 14px;
  color: #c3c2d4;
  text-transform: capitalize;
  margin-bottom: 12px;
`;

export const SettingsText = styled.div`
  font-size: 12px;
  color: #c3c2d4;
  ::first-letter {
    text-transform: capitalize;
  }
`;

export const SettingsComponentHeader = styled.div<{ fontSize?: string }>`
  font-size: ${({ fontSize }) => (fontSize ? fontSize : '16px')};
  color: #c3c2d4;
  text-transform: capitalize;
`;

export const BuyTradeHeadText = styled.div`
  font-size: 12px;
  color: #7f87a7;
  white-space: nowrap;
  font-weight: 400;
  ::first-letter {
    text-transform: capitalize;
  }
`;

export const BuyTradeDescText = styled.div`
  font-size: 16px;
  padding: 1px 0;
  color: #ffffff;
  font-weight: 500;
`;

export const RadioTextHead = styled.div`
  font-size: 12px;
  color: #808191;
  font-weight: 400;
`;

export const White12pxText = styled.div`
  font-size: 12px;
  color: #ffffff;
  font-weight: 400;
`;

export const EditTextValueText = styled.div`
  font-size: 14px;
  color: #c2c1d3;
  font-weight: 400;
`;
