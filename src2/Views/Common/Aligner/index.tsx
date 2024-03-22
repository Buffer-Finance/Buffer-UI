import Background from "./style";

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
  keyColumnStyles?: string;
  valueColumnStyles?: string;
}

const ValueFormatter: React.FC<iValueFormatter> = ({
  keys,
  values,
  keyStyles,
  valueStyles,
  valuePrefix,
  styles,
  keyPrefix,
  valuePostfix,
  keyPostfix,
  keyColumnStyles,
  valueColumnStyles,
}) => {
  function formatter(
    pre: String | undefined,
    val: String,
    post: String | undefined
  ) {
    return `${pre ? pre : ""}${val}${post ? post : ""}`;
  }
  return (
    <div className={`${styles} flex-center`}>
      <div className={`flex-col content-center ${keyColumnStyles}`}>
        {keys
          .filter((k) => k)
          .map((k, idx) => {
            const isJsx = typeof k !== "string" || typeof k !== "number";
            return (
              <div className={`key ${keyStyles}`} key={idx}>
                {isJsx ? k : formatter(keyPrefix, k, keyPostfix)}
              </div>
            );
          })}
      </div>
      <div className={`flex-col content-center ${valueColumnStyles}`}>
        {values
          .filter((k) => k)
          .map((v, idx) => {
            const isJsx = typeof v !== "string" || typeof v !== "number";
            return (
              <div className={`value ${valueStyles}`} key={idx}>
                {isJsx ? v : formatter(valuePrefix, v, valuePostfix)}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ValueFormatter;
