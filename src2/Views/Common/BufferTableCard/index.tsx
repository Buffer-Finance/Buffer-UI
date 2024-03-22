import { Divider, Skeleton } from "@mui/material";
import AlignerMobile from "../Mobile/AlignerMobile";
import Card, { Background } from "./style";
import { createArray } from "@Utils/JSUtils/createArray";
import { ReactNode } from "react";

/*
  1. row: used as the key value while mapping, this is a mandatory value
  2. header: Used for constructing the top row, 'desc' and 'imgs' are optional values
  3. title: Used for displaying the large value in the center and the name associated to the value, both values are required
  4. tableData: Used for displaying the table below the divider. Accepts two objects as values, 'key' and 'value' which are 
    sent as props to Aligner Mobile. 
  5. actions: Used to display actions such as buttons and links at the bottom. Optional in nature. 
*/

interface IBufferTableCard {
  rows: number;
  assetJSX: (idx: number) => React.ReactChild;
  titleJSX: (idx: number) => React.ReactChild;
  tableKeys: () => string[];
  tableValues: (idx: number) => React.ReactChild[];
  actionsJSX: (idx?: number) => React.ReactChild;
  loading?: boolean;
  error?: ReactNode;
}

const BufferTableCard: React.FC<IBufferTableCard> = ({
  rows,
  assetJSX,
  titleJSX,
  tableKeys,
  tableValues,
  actionsJSX,
  loading,
  error,
}) => {
  return (
    <Background>
      <div className="s">
        {loading ? (
          <Skeleton className="tableCardSkeleton" />
        ) : rows ? (
          createArray(rows).map((row, idx) => (
            <Card key={idx}>
              {/* Rendering the asset data */}
              {assetJSX(idx)}

              {/* Rendering the data on top*/}
              <div className="title flex-col items-center xxsmb">
                {titleJSX(idx)}
              </div>
              <Divider sx={{ backgroundColor: "#808191", opacity: "0.5" }} />
              <br />

              {/* Rendering the table */}
              <AlignerMobile
                styles={`content-sbw`}
                keys={
                  //This will create an array of JSX elements
                  tableKeys().map((key: string, index: number) => (
                    <div
                      className="flex font3 items-center text-1"
                      style={{ fontSize: "15px" }}
                      key={index}
                    >
                      {key}
                    </div>
                  ))
                }
                //Insert array of values as given
                values={tableValues(idx)}
                keyStyles="lbold"
                valueStyles="bold"
              />

              {/* Insert buttons or any other actions here */}
              <div>{actionsJSX(idx)}</div>
            </Card>
          ))
        ) : (
          <div>{error}</div>
        )}
      </div>
    </Background>
  );
};

export default BufferTableCard;
