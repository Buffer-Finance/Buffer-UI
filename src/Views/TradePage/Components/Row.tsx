import styled from '@emotion/styled';

export const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const RowFixed = styled.div`
  display: flex;
  align-items: center;
`;

export const RowGap = styled.div<{ gap?: string }>`
  display: flex;
  align-items: center;
  gap: ${({ gap }) => gap || '0px'};
`;
