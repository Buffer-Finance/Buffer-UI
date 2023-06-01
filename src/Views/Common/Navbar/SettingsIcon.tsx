export const SettingsIcon: React.FC<{
  svgProps?: React.SVGProps<SVGSVGElement>;
  className?: string;
}> = ({ svgProps, className }) => {
  return (
    <svg
      width="29"
      height="31"
      viewBox="0 0 29 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
      role="button"
      className="animate-spin"
    >
      <path
        d="M0 4C0 1.79086 1.79086 0 4 0H25C27.2091 0 29 1.79086 29 4V27C29 29.2091 27.2091 31 25 31H4C1.79086 31 0 29.2091 0 27V4Z"
        fill="#191B20"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M13.5975 6.69586C13.5315 6.72308 13.4268 6.79418 13.3647 6.85387C13.1444 7.06623 13.1171 7.18652 13.1171 7.94576V8.66132L12.7065 8.7935C12.4807 8.86619 12.1315 9.00298 11.9306 9.09748L11.5653 9.26933L11.0041 8.70222C10.4021 8.09396 10.2863 8.03024 9.911 8.1009C9.76022 8.12931 9.6083 8.26139 8.97826 8.91215C8.36763 9.54283 8.21604 9.72712 8.17468 9.88935C8.08237 10.2515 8.16647 10.4211 8.72864 11.0068L9.23168 11.5309L9.0419 11.8745C8.93753 12.0634 8.7797 12.4127 8.69112 12.6507L8.53007 13.0832L7.79605 13.0845C6.95654 13.086 6.81494 13.1247 6.60312 13.4112L6.46469 13.5983L6.44999 14.6594C6.43621 15.6572 6.4414 15.7334 6.53746 15.9383C6.71412 16.3149 6.87292 16.3788 7.70551 16.4077L8.41801 16.4325L8.55001 16.8566C8.62258 17.0899 8.754 17.4421 8.84204 17.6392L9.00208 17.9977L8.4463 18.5786C7.59028 19.4732 7.59878 19.591 8.59506 20.6373C9.27726 21.3538 9.49336 21.5146 9.77386 21.5146C10.0602 21.5146 10.1963 21.4257 10.6993 20.9099L11.1875 20.4093L11.6235 20.6418C11.8634 20.7697 12.1948 20.9267 12.3602 20.9908L12.6608 21.1073L12.6848 21.9273C12.7114 22.8338 12.7333 22.9028 13.0686 23.1384C13.2215 23.2459 13.267 23.25 14.2939 23.25C15.3209 23.25 15.3663 23.2459 15.5192 23.1384C15.8528 22.9041 15.8774 22.8286 15.8943 21.987L15.9096 21.2267L16.3266 21.0931C16.5559 21.0196 16.9049 20.8828 17.1022 20.7891L17.4608 20.6187L17.9667 21.1628C18.245 21.462 18.5336 21.7305 18.6079 21.7594C18.7981 21.8335 19.1026 21.8249 19.2556 21.7411C19.4507 21.6344 20.742 20.271 20.7999 20.1107C20.8643 19.9324 20.8643 19.675 20.7999 19.5001C20.7722 19.4249 20.5329 19.136 20.2682 18.8583L19.7868 18.3534L20.0006 17.9384C20.1182 17.7101 20.2739 17.363 20.3466 17.167L20.4788 16.8107L21.277 16.7952C22.023 16.7806 22.0854 16.772 22.232 16.6641C22.5367 16.4397 22.5554 16.3532 22.5554 15.1682C22.5554 14.1913 22.5474 14.0881 22.4594 13.9339C22.2637 13.591 22.1763 13.5596 21.34 13.532L20.5875 13.5072L20.4379 13.0362C20.3557 12.7771 20.2228 12.4172 20.1426 12.2363L19.9968 11.9074L20.499 11.3934C20.7752 11.1107 21.0321 10.8192 21.0698 10.7455C21.1076 10.6718 21.1385 10.5023 21.1385 10.3687C21.1385 10.0559 21.0455 9.92525 20.2437 9.11176C19.7323 8.59284 19.5885 8.47425 19.4113 8.42526C19.0492 8.32525 18.8829 8.41083 18.3046 8.99485L17.8003 9.5042L17.4881 9.32487C17.3163 9.22625 16.9813 9.06481 16.7436 8.96619L16.3113 8.78681L16.2873 7.94898C16.2605 7.01338 16.2376 6.94297 15.8965 6.74271C15.7347 6.64776 15.6476 6.64043 14.7197 6.6433C14.1685 6.64504 13.6635 6.66869 13.5975 6.69586ZM15.2004 11.7218C15.3819 11.7615 15.7146 11.886 15.9396 11.9984C16.7321 12.3944 17.4082 13.2669 17.613 14.1579C17.716 14.6057 17.715 15.3498 17.6109 15.7632C17.3126 16.9475 16.3884 17.8946 15.264 18.1683C14.8746 18.2631 14.0798 18.2626 13.7156 18.1674C12.355 17.8116 11.3835 16.5819 11.307 15.1186C11.193 12.9383 13.111 11.2649 15.2004 11.7218Z"
        fill="#808191"
      />
    </svg>
  );
};
