import * as React from 'react';
const NoLossNavigation: React.FC<any> = ({}) => {
  const navigate = useNavigate();

  return (
    <aside className="min-h-full border-right  w-[4rem] fex-col items-center">
      <Tournaments className="m-auto mt-4" />
      {/* <img
        src="https://a.slack-edge.com/production-standard-emoji-assets/14.0/google-large/1f419@2x.png"
        width={60}
        height={60}
        onClick={() => navigate('/profile')}
        // className={
        //   'absolute z-0 rounded-full left-[0] right-[0] top-[0] bottom-[0] m-auto'
        // }
      /> */}
    </aside>
  );
};

export { NoLossNavigation };
import { SVGProps } from 'react';
import { useNavigate } from 'react-router-dom';
const Tournaments = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={23}
    height={29}
    fill="none"
    {...props}
  >
    <path
      fill="#C3C2D4"
      fillRule="evenodd"
      d="M9.54.067C8.053.39 6.762.85 5.535 1.493l-1.395.731v1.103c0 1.619.493 5.062 1.011 7.068.695 2.69 1.663 4.783 3.004 6.497 1.408 1.8 1.925 2.876 1.925 4.008v.835h2.88V20.9c0-1.128.514-2.203 1.917-4.008.647-.832 1.402-2.013 1.678-2.623 1.216-2.698 2.09-6.558 2.288-10.1l.107-1.927-1.46-.748c-.804-.412-1.929-.891-2.5-1.066-1.03-.314-4.581-.55-5.45-.36ZM7.02 2.615c.003 1.54.739 8.44 1.2 11.25.108.653.093.684-.196.416-.845-.785-1.864-4.173-2.342-7.788-.161-1.217-.335-2.51-.386-2.873-.088-.618-.044-.685.68-1.046 1.003-.499 1.044-.497 1.045.04ZM0 5.06c0 .457 1.555 8.597 1.666 8.721.127.142 4.712 1.903 4.825 1.853.068-.03-.057-.374-.28-.765-.35-.617-.619-.787-2.036-1.295l-1.632-.585-.301-1.53c-.166-.842-.484-2.438-.707-3.548-.223-1.11-.376-2.079-.339-2.153.037-.074.633-.12 1.326-.1l1.258.033v-1.11H1.89c-1.869 0-1.89.006-1.89.479Zm19.26.076v.555l1.258-.034c.693-.018 1.29.027 1.325.101.08.162-1.218 6.744-1.391 7.058-.067.12-.82.474-1.672.785-1.325.483-1.61.669-1.954 1.272-.222.388-.376.74-.342.782.034.042 1.154-.354 2.489-.88l2.427-.956.268-1.34c1.12-5.61 1.412-7.29 1.315-7.573-.093-.269-.424-.325-1.917-.325H19.26v.555ZM6.3 24.257v2.12h10.44V22.139H6.3v2.119Zm-1.62 3.734V29h13.68v-2.018H4.68v1.009Z"
      clipRule="evenodd"
    />
  </svg>
);
