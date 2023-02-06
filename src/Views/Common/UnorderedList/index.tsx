import { useState, useEffect, ReactNode } from "react";
import Background from "./style";

interface IUnorderedList {
  header: string | ReactNode;
  list: string[] | ReactNode[];
}

const UnorderedList: React.FC<IUnorderedList> = ({ header, list }) => {
  return (
    <Background>
      <h2 className="f15">{header}</h2>
      <ul>
        {list.map((single) => (
          <li dangerouslySetInnerHTML={{ __html: single }}></li>
        ))}
      </ul>
    </Background>
  );
};

export default UnorderedList;
