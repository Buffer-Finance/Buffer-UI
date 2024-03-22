import Layout from "./style";
//Use only if you want elements with 'space-between' styling.

interface iValueFormatter {
  keys: any[];
  values: any[];
  keyStyles?: String;
  valueStyles?: String;
  valuePrefix?: String;
  keyPrefix?: String;
  valuePostfix?: String;
  styles?: string;
  keyPostfix?: String;
  eachRowStyles?: string;
}

const AlignerMobile: React.FC<iValueFormatter> = ({
  keys,
  values,
  keyStyles,
  valueStyles,
  valuePrefix,
  styles,
  keyPrefix,
  valuePostfix,
  keyPostfix,
  eachRowStyles,
}) => {
  function formatter(
    pre: String | undefined,
    val: String,
    post: String | undefined
  ) {
    return `${pre ? pre : ""}${val}${post ? post : ""}`;
  }

  return (
    <Layout>
      <div className={`${styles} flex-center`}>
        <div className={`flex-col items-center full-width`}>
          {keys.map((k, idx) => {
            const isJsx = typeof k !== "string" || typeof k !== "number";
            const isJsxVal =
              typeof values[idx] !== "string" ||
              typeof values[idx] !== "number";
            return (
              <div
                className={`flex full-width xxsmb content-sbw items-center ${eachRowStyles}`}
                key={idx}
              >
                {" "}
                <div className={`${keyStyles}`}>
                  {isJsx ? k : formatter(keyPrefix, k, keyPostfix)}
                </div>
                &nbsp;
                <div className={`font12px font3 ${valueStyles}`}>
                  {isJsxVal
                    ? values[idx]
                    : formatter(valuePrefix, values[idx], valuePostfix)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AlignerMobile;
