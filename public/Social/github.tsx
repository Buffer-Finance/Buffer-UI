import * as React from "react";
import { SVGProps } from "react";

const GitHub = (props: SVGProps<SVGSVGElement>) => (
  <svg
  width={24}
  height={25}
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  {...props}
>
  <path
    fillRule="evenodd"
    clipRule="evenodd"
    d="M11.974 4.476c-4.787 0-8.669 3.884-8.669 8.674 0 3.83 2.5 7.077 5.903 8.248.426.052.585-.213.585-.426v-1.49c-2.393.532-2.925-1.171-2.925-1.171-.372-1.011-.957-1.277-.957-1.277-.797-.532.053-.532.053-.532.851.052 1.33.905 1.33.905.798 1.33 2.02.957 2.5.745.031-.442.22-.857.53-1.171-1.913-.213-3.935-.957-3.935-4.31 0-.958.32-1.703.905-2.342-.054-.16-.373-1.064.106-2.235 0 0 .745-.213 2.393.905.692-.213 1.436-.266 2.18-.266.745 0 1.49.106 2.18.266 1.65-1.118 2.394-.905 2.394-.905.478 1.171.16 2.075.106 2.288.586.639.909 1.475.905 2.342 0 3.352-2.022 4.044-3.936 4.257.319.266.585.798.585 1.596v2.395c0 .213.16.478.585.426a8.678 8.678 0 0 0 5.903-8.248c-.053-4.79-3.936-8.674-8.721-8.674Z"
    fill="currentColor"
  />
</svg>
);

export default GitHub;
