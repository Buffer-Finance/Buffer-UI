import styled from '@emotion/styled';

const DataColBackground = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 3px;

  .head {
    font-style: normal;
    font-weight: 400;
    font-size: 10px;
    text-transform: capitalize;

    color: #7f87a7;
  }
  .desc {
    font-style: normal;
    font-weight: 400;
    font-size: 12px;

    color: #c3c2d4;
  }
`;

export const DataCol: React.FC<{
  head: JSX.Element;
  desc: JSX.Element;
  className?: string;
}> = ({ desc, head, className = '' }) => {
  return (
    <DataColBackground>
      <span className="head">{head}</span>
      <span className="desc">{desc}</span>
    </DataColBackground>
  );
};
