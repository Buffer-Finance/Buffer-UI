import styled from '@emotion/styled';

export const ColumnGap = styled.div<{ gap?: string }>`
  display: flex;
  flex-direction: column;
  gap: ${({ gap }) => gap || '0px'};
`;
