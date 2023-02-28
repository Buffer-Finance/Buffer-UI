import { defaultMarket } from '@Views/BinaryOptions';
import { SVGProps } from 'react';

export interface ITab {
  to: string;
  name: string;
  subTabs: any;
  isExternalLink: boolean;
  Img?: (props: SVGProps<SVGSVGElement>) => JSX.Element;
}

export const TabIcon = {
  Trade: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.8916 16.6715C22.1722 16.9522 22.1722 17.4072 21.8916 17.6879L19.3915 20.188H21.0445C21.4415 20.188 21.7633 20.5098 21.7633 20.9067C21.7633 21.3037 21.4415 21.6255 21.0445 21.6255H17.6563C17.2593 21.6255 16.9375 21.3037 16.9375 20.9067V17.5185C16.9375 17.1215 17.2593 16.7998 17.6563 16.7998C18.0532 16.7998 18.375 17.1215 18.375 17.5185V19.1715L20.8751 16.6715C21.1558 16.3908 21.6109 16.3908 21.8916 16.6715Z"
        fill="currentColor"
      />
      <path
        d="M4.21051 8.95403C4.49121 9.23471 4.94629 9.23471 5.22698 8.95403L7.72704 6.45397V8.10697C7.72704 8.50393 8.04884 8.82572 8.44579 8.82572C8.84274 8.82572 9.16454 8.50393 9.16454 8.10697V4.71875C9.16454 4.52813 9.08881 4.34531 8.95402 4.21052C8.81924 4.07573 8.63641 4 8.44579 4H5.05758C4.66062 4 4.33883 4.32179 4.33883 4.71875C4.33883 5.1157 4.66062 5.4375 5.05758 5.4375H6.71058L4.21051 7.93756C3.92983 8.21825 3.92983 8.67333 4.21051 8.95403Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M9.62402 21.2907C9.81735 21.3103 10.0135 21.3204 10.212 21.3204C13.3876 21.3204 15.962 18.746 15.962 15.5704C19.1376 15.5704 21.712 12.996 21.712 9.82032C21.712 7.04161 19.741 4.72326 17.1207 4.18713C16.7698 4.11533 16.4073 4.07548 16.0362 4.07078C16.0115 4.07047 15.9867 4.07031 15.9619 4.07031C12.7863 4.07031 10.2119 6.64467 10.2119 9.82031C7.03628 9.82031 4.46191 12.3946 4.46191 15.5703C4.46191 18.4482 6.57622 20.8323 9.33625 21.2541C9.43143 21.2686 9.52737 21.2808 9.62402 21.2907ZM6.37858 15.5703C6.37858 13.4532 8.09483 11.7369 10.2119 11.7369C10.324 11.7369 10.4348 11.7417 10.5441 11.7511C11.1223 13.3735 12.4087 14.6599 14.0311 15.2381C14.0405 15.3475 14.0453 15.4582 14.0453 15.5703C14.0453 17.6874 12.329 19.4036 10.2119 19.4036C8.09483 19.4036 6.37858 17.6874 6.37858 15.5703ZM12.1286 9.82031C12.1286 7.70322 13.8449 5.98698 15.9619 5.98698C18.079 5.98698 19.7953 7.70322 19.7953 9.82031C19.7953 11.9374 18.079 13.6536 15.9619 13.6536C13.8449 13.6536 12.1286 11.9374 12.1286 9.82031Z"
        fill="currentColor"
      />
    </svg>
  ),
  History: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="4.875"
        y="8.96875"
        width="16.25"
        height="12.1591"
        rx="1.125"
        stroke="currentColor"
        stroke-width="1.75"
      />
      <rect
        x="9.7832"
        y="4.875"
        width="7.25"
        height="3.97727"
        rx="1.125"
        stroke="currentColor"
        stroke-width="1.75"
      />
    </svg>
  ),
  Dashboard: (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
        fill="currentColor"
      />
      <path
        d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
        fill="currentColor"
      />
    </svg>
  ),
  Earn: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M15.911 11.906C15.911 12.7111 14.9766 13.4298 13.5534 13.8755C12.701 14.1157 11.8223 14.2509 10.9371 14.278C10.7745 14.2923 10.6109 14.2923 10.4483 14.278C7.44384 14.278 5 13.1998 5 11.8773C5 10.5547 7.44384 9.47656 10.4483 9.47656H10.9371C11.1815 9.47656 11.4115 9.47656 11.6415 9.47656C12.9256 9.58513 14.157 10.037 15.2066 10.7847C15.3988 10.9089 15.5614 11.0736 15.6831 11.2673C15.8048 11.461 15.8826 11.679 15.911 11.906V11.906Z"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.9114 11.9062V15.342C15.9114 16.2189 14.8619 16.9664 13.2806 17.3833C12.3417 17.6262 11.3754 17.747 10.4055 17.7427C7.91857 17.7427 5.81975 17.0096 5.17285 16.0176"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.911 15.3516V18.9311C15.911 20.268 13.4672 21.3318 10.4483 21.3318C7.42946 21.3318 5 20.268 5 18.9311"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M11.2538 9.20574C11.0611 8.98042 10.9497 8.69691 10.9375 8.40071C10.9375 7.07816 13.3813 6 16.4002 6C19.419 6 21.8485 7.07816 21.8485 8.40071C21.8485 9.72326 19.4047 10.787 16.4002 10.787C16.0028 10.8089 15.6044 10.8089 15.207 10.787"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.9102 17.8004H16.3989C19.4034 17.8004 21.8472 16.7366 21.8472 15.4141"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M15.9102 14.2223H16.3989C19.4034 14.2223 21.8472 13.1441 21.8472 11.8359"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M21.8486 15.4059V11.8264V8.39062"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 18.9215V11.9062"
        stroke="currentColor"
        stroke-width="1.4748"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  Faucet: (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
        fill="currentColor"
      />
      <path
        d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
        fill="currentColor"
      />
    </svg>
  ),
  Referral: (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
        fill="currentColor"
      />
      <path
        d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
        fill="currentColor"
      />
    </svg>
  ),
  Leaderbaord: (
    <svg
      width="38"
      height="38"
      viewBox="0 0 38 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
        fill="currentColor"
      />
      <path
        d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
        fill="currentColor"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
        fill="currentColor"
      />
    </svg>
  ),
  NFT: (
    <svg
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M2.6357 14.2261C2.57755 13.9371 2.50778 13.648 2.4729 13.3706C2.3101 12.3185 2.40313 11.2779 2.7171 10.2605C2.91478 9.62465 3.49621 9.24312 4.15904 9.26625C4.92652 9.30093 5.54284 9.97149 5.51958 10.7345C5.50795 11.2548 5.5661 11.7751 5.79867 12.2491C5.99635 12.6422 6.2987 12.9081 6.71732 13.0584C6.72895 13.07 6.75221 13.07 6.7871 13.07C6.75221 12.8734 6.7057 12.6769 6.67081 12.4803C6.31033 10.1565 6.74058 8.01761 8.15927 6.10998C8.91512 5.09257 9.8803 4.32952 11.078 3.90174C13.02 3.20806 14.8457 3.47397 16.5318 4.65324C17.7877 5.53191 18.625 6.73429 19.1483 8.15635C19.5669 9.27781 19.7181 10.4455 19.625 11.6363C19.5902 12.0641 19.5087 12.4919 19.439 12.9197C19.439 12.9428 19.4274 12.9659 19.4274 13.0121C19.6599 12.9081 19.8576 12.7694 20.0088 12.5728C20.2646 12.2491 20.4042 11.8791 20.4507 11.4745C20.4856 11.1623 20.4856 10.8502 20.5088 10.538C20.567 9.92525 21.0902 9.38186 21.7065 9.30093C22.474 9.19688 23.1136 9.61309 23.3229 10.353C23.602 11.2779 23.695 12.2144 23.5787 13.174C23.5439 13.4977 23.4625 13.8214 23.3927 14.1452C23.3811 14.1799 23.3811 14.203 23.3694 14.2492C23.4857 14.2261 23.602 14.203 23.7067 14.203C24.23 14.1799 24.6486 14.4573 24.8463 14.966C24.9974 15.3244 25.0207 15.706 24.9858 16.099C24.8695 17.3824 24.2997 18.446 23.4276 19.3594C22.6485 20.1802 21.6833 20.6774 20.6018 20.978C19.6948 21.2208 18.7878 21.3248 17.8575 21.2208C16.3109 21.0473 14.9736 20.4346 13.834 19.3825C13.5782 19.1397 13.3572 18.8622 13.1363 18.5963C13.0665 18.527 12.9502 18.5154 12.8921 18.5963C12.2293 19.4981 11.3455 20.1571 10.3338 20.6196C9.19421 21.1514 7.98484 21.3595 6.72895 21.2208C5.63587 21.1051 4.57767 20.8161 3.64738 20.2149C2.29847 19.3478 1.4147 18.1223 1.07747 16.5499C0.972811 16.0528 0.961184 15.5557 1.12398 15.0585C1.26353 14.6539 1.51935 14.3417 1.94961 14.2261C2.15893 14.1683 2.35661 14.1914 2.5543 14.2377C2.58918 14.2145 2.61244 14.2261 2.6357 14.2261ZM18.7296 11.1276C18.7296 10.0409 18.5436 9.08126 18.1598 8.15635C17.6831 7.01177 16.9621 6.04061 15.9272 5.34692C14.648 4.47982 13.2526 4.22546 11.7525 4.65324C10.5431 5.00008 9.60121 5.71689 8.86861 6.72273C7.6011 8.48007 7.24061 10.4455 7.64761 12.5497C7.85692 13.648 8.32207 14.6423 9.00815 15.521C9.35701 15.9603 9.24073 16.5615 8.77558 16.8621C8.63604 16.943 8.50812 17.024 8.35695 17.1049C7.63598 17.4864 6.8685 17.6367 6.0545 17.4864C5.39167 17.3708 4.81024 17.0702 4.27532 16.6771C3.87995 16.3881 3.5311 16.0297 3.18224 15.6944C2.98455 15.5094 2.76361 15.336 2.53104 15.1973C2.20544 15.0123 2.0659 15.047 1.97287 15.4632C1.91473 15.7175 1.92636 15.9834 1.97287 16.2378C2.2287 17.5789 2.92641 18.631 4.07764 19.3594C5.1591 20.0531 6.3801 20.3305 7.65924 20.2843C8.86861 20.238 9.97332 19.845 10.9618 19.1513C11.485 18.7813 11.9502 18.3535 12.2758 17.787C12.3456 17.6598 12.4735 17.5905 12.613 17.5905C12.8805 17.5789 13.1479 17.5905 13.4154 17.5905C13.5782 17.5905 13.6945 17.683 13.7759 17.8217C13.8805 17.9951 13.9968 18.1801 14.1364 18.3304C15.3108 19.5906 16.776 20.238 18.5087 20.2958C19.3111 20.319 20.0902 20.1687 20.846 19.9028C22.381 19.3594 23.4159 18.3073 23.9276 16.7696C24.0439 16.3996 24.1137 16.0297 24.0788 15.6366C24.0672 15.4979 24.0206 15.3591 23.9625 15.2204C23.9276 15.1279 23.8462 15.0816 23.7415 15.1163C23.6485 15.151 23.5439 15.1741 23.4625 15.2204C23.1601 15.3822 22.9276 15.6135 22.6834 15.8563C22.2415 16.3187 21.7531 16.7349 21.1833 17.0471C20.6018 17.3708 19.9855 17.5558 19.3111 17.5442C18.625 17.5327 17.997 17.313 17.4156 16.9662C16.904 16.6656 16.7877 16.0297 17.1598 15.5672C17.2296 15.4863 17.2993 15.3938 17.3575 15.3013C18.2878 14.0296 18.7064 12.5959 18.7296 11.1276ZM8.27555 16.0759C7.79878 15.4747 7.42667 14.8273 7.13595 14.1336C7.12433 14.0989 7.06618 14.0758 7.0313 14.0758C5.92658 13.9255 5.17073 13.3359 4.81024 12.2722C4.63581 11.7751 4.5893 11.2433 4.5893 10.723C4.5893 10.4571 4.41487 10.2374 4.17067 10.2027C3.90321 10.168 3.68227 10.3068 3.60087 10.5611C3.46133 11.0005 3.37993 11.4398 3.34504 11.8907C3.25201 13.0468 3.49621 14.1336 4.03113 15.1741C4.05438 15.2088 4.06601 15.2435 4.1009 15.2666C4.47301 15.6366 4.86838 15.9719 5.3219 16.2262C5.98472 16.5962 6.68244 16.7002 7.42667 16.4806C7.71738 16.3881 7.99647 16.2493 8.27555 16.0759ZM17.8924 16.1684C17.904 16.18 17.9273 16.1915 17.9389 16.2031C18.0668 16.2609 18.1831 16.3303 18.311 16.3881C19.032 16.7002 19.753 16.6887 20.4623 16.365C20.9391 16.1453 21.3461 15.8447 21.7182 15.4863C21.8228 15.3938 21.9275 15.2897 21.9973 15.1741C22.5554 14.0874 22.7996 12.9312 22.6601 11.7173C22.6136 11.3357 22.5089 10.9542 22.4275 10.5727C22.3926 10.4224 22.288 10.3068 22.1484 10.2374C21.8112 10.0871 21.4391 10.3299 21.4391 10.6883C21.4391 11.0929 21.4158 11.5092 21.3228 11.9022C21.0437 13.0468 20.3693 13.8099 19.1715 14.0411C19.1366 14.0527 19.0901 14.0874 19.0785 14.122C18.8924 14.5614 18.6948 14.9892 18.4273 15.3822C18.2529 15.6482 18.0784 15.9025 17.8924 16.1684Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0.4375"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.4998 10.6457C11.4998 10.805 11.4998 10.9574 11.4998 11.1168C11.5092 11.3592 11.1883 11.4354 10.9618 11.3662C10.8297 11.3246 10.7542 11.2484 10.7542 11.1445C10.7542 10.805 10.7448 10.4656 10.7542 10.1331C10.7542 9.98761 10.9146 9.89062 11.1223 9.89062C11.3394 9.89062 11.4904 9.98761 11.4998 10.1331C11.4998 10.3063 11.4904 10.4795 11.4998 10.6457C11.4904 10.6457 11.4904 10.6457 11.4998 10.6457Z"
        fill="currentColor"
      />
      <path
        d="M11.4998 10.6457C11.4998 10.805 11.4998 10.9574 11.4998 11.1168C11.5092 11.3592 11.1883 11.4354 10.9618 11.3662C10.8297 11.3246 10.7542 11.2484 10.7542 11.1445C10.7542 10.805 10.7448 10.4656 10.7542 10.1331C10.7542 9.98761 10.9146 9.89062 11.1223 9.89062C11.3394 9.89062 11.4904 9.98761 11.4998 10.1331C11.4998 10.3063 11.4904 10.4795 11.4998 10.6457ZM11.4998 10.6457C11.4904 10.6457 11.4904 10.6457 11.4998 10.6457Z"
        stroke="currentColor"
        stroke-width="0.3125"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M15.2523 10.639C15.2523 10.4804 15.2523 10.3287 15.2523 10.1701C15.2523 10.0666 15.2988 9.97698 15.4289 9.92871C15.5683 9.87355 15.7077 9.88044 15.8379 9.93561C15.9401 9.97698 15.9959 10.0459 15.9959 10.1356C15.9959 10.4735 16.0052 10.8114 15.9959 11.1493C15.9959 11.2941 15.8286 11.3906 15.6241 11.3906C15.4196 11.3906 15.2616 11.2941 15.2616 11.1493C15.243 10.9769 15.2523 10.8045 15.2523 10.639Z"
        fill="currentColor"
        stroke="currentColor"
        stroke-width="0.3125"
      />
    </svg>
  ),
};

export const getTabs = (
  marketFromStorage: string
): {
  to: string;
  name: string;
  subTabs: [];
  isExternalLink: boolean;
  mobileOnly?: boolean;
  icon: JSX.Element;
}[] => {
  const market = marketFromStorage || defaultMarket;
  if (import.meta.env.VITE_ENV === 'MAINNET') {
    return [
      {
        to: `/binary/` + market,
        name: 'Trade',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Trade,
      },
      {
        to: `/history`,
        name: 'History',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.History,
        mobileOnly: true,
      },
      {
        to: `/earn`,
        name: 'Earn',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Earn,
      },

      {
        to: `https://optopi.buffer.finance/`,
        name: 'NFT',
        subTabs: [],
        isExternalLink: true,
        icon: TabIcon.NFT,
      },

      {
        to: `/dashboard`,
        name: 'Dashboard',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Dashboard,
      },
      {
        to: `/referral`,
        name: 'Referral',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Referral,
      },
      {
        to: `https://testnet.buffer.finance/`,
        name: 'Practice Trading',
        subTabs: [],
        isExternalLink: true,
        icon: (
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
              fill="currentColor"
            />
            <path
              d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
              fill="currentColor"
            />
          </svg>
        ),
      },

      {
        to: `https://stats.buffer.finance/`,
        name: 'Stats',
        subTabs: [],
        isExternalLink: true,
        icon: (
          <svg
            width="38"
            height="38"
            viewBox="0 0 38 38"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M28.9113 23.8086C29.2393 24.1366 29.2393 24.6684 28.9113 24.9965L25.9893 27.9185H27.9213C28.3852 27.9185 28.7613 28.2947 28.7613 28.7586C28.7613 29.2225 28.3852 29.5987 27.9213 29.5987H23.9611C23.4972 29.5987 23.1211 29.2225 23.1211 28.7586V24.7986C23.1211 24.3345 23.4972 23.9585 23.9611 23.9585C24.4251 23.9585 24.8012 24.3345 24.8012 24.7986V26.7305L27.7232 23.8086C28.0513 23.4805 28.5832 23.4805 28.9113 23.8086Z"
              fill="currentColor"
            />
            <path
              d="M8.24604 14.7901C8.57411 15.1182 9.106 15.1182 9.43406 14.7901L12.3561 11.8681V13.8001C12.3561 14.2641 12.7322 14.6402 13.1961 14.6402C13.6601 14.6402 14.0362 14.2641 14.0362 13.8001V9.84005C14.0362 9.61726 13.9477 9.40358 13.7901 9.24605C13.6326 9.08851 13.4189 9 13.1961 9H9.23606C8.77211 9 8.39601 9.3761 8.39601 9.84005C8.39601 10.304 8.77211 10.6801 9.23606 10.6801H11.168L8.24604 13.6021C7.91799 13.9302 7.91799 14.4621 8.24604 14.7901Z"
              fill="currentColor"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14.5734 29.2048C14.7993 29.2277 15.0286 29.2395 15.2606 29.2395C18.9722 29.2395 21.981 26.2306 21.981 22.5191C25.6926 22.5191 28.7015 19.5102 28.7015 15.7986C28.7015 12.5509 26.3978 9.84127 23.3353 9.21466C22.9251 9.13073 22.5014 9.08416 22.0677 9.07867C22.0388 9.0783 22.0099 9.07812 21.9809 9.07812C18.2693 9.07812 15.2605 12.087 15.2605 15.7986C11.5489 15.7986 8.54004 18.8074 8.54004 22.5189C8.54004 25.8826 11.0112 28.669 14.237 29.162C14.3483 29.179 14.4604 29.1932 14.5734 29.2048ZM10.7802 22.5189C10.7802 20.0446 12.7861 18.0387 15.2605 18.0387C15.3915 18.0387 15.521 18.0443 15.6487 18.0552C16.3245 19.9514 17.828 21.4549 19.7242 22.1307C19.7352 22.2585 19.7408 22.388 19.7408 22.5189C19.7408 24.9934 17.7348 26.9992 15.2605 26.9992C12.7861 26.9992 10.7802 24.9934 10.7802 22.5189ZM17.5006 15.7986C17.5006 13.3242 19.5066 11.3183 21.9809 11.3183C24.4553 11.3183 26.4612 13.3242 26.4612 15.7986C26.4612 18.273 24.4553 20.2788 21.9809 20.2788C19.5066 20.2788 17.5006 18.273 17.5006 15.7986Z"
              fill="currentColor"
            />
          </svg>
        ),
      },
    ];
  } else
    return [
      {
        to: `/binary/` + market,
        name: 'Trade',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Trade,
      },
      {
        to: `/history`,
        name: 'History',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.History,
        mobileOnly: true,
      },
      {
        to: `/earn`,
        name: 'Earn',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Earn,
      },
      {
        to: `https://optopi.buffer.finance/`,
        name: 'NFT',
        subTabs: [],
        isExternalLink: true,
        icon: TabIcon.NFT,
      },
      {
        to: `/faucet`,
        name: 'Faucet',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Faucet,
      },
      {
        to: `/leaderboard/weekly`,
        name: 'Competitions',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Leaderbaord,
      },

      {
        to: `/dashboard`,
        name: 'Dashboard',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Dashboard,
      },
      {
        to: `/referral`,
        name: 'Referral',
        subTabs: [],
        isExternalLink: false,
        icon: TabIcon.Referral,
      },
    ];
};
