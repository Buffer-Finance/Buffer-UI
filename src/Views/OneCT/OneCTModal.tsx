import { useAtomValue, useSetAtom } from 'jotai';
import { ModalBase } from 'src/Modals/BaseModal';
import { isOneCTModalOpenAtom } from './OneCTButton';
import { useState } from 'react';
import { useOneCTWallet } from './useOneCTWallet';
import { CloseOutlined } from '@mui/icons-material';
import { BlueBtn } from '@Views/Common/V2-Button';
import { useToast } from '@Contexts/Toast';
import { SVGProps } from 'react';
import { useAccount } from 'wagmi';
import { useActiveChain } from '@Hooks/useActiveChain';
import NumberTooltip from '@Views/Common/Tooltips';
import { appConfig, baseUrl } from '@Views/TradePage/config';
import { showOnboardingAnimationAtom } from '@Views/TradePage/atoms';
import { getWalletFromOneCtPk } from '@Views/TradePage/utils/generateTradeSignature';
import axios from 'axios';
import { getAddress, zeroAddress } from 'viem';
import { EIP712Domain } from './useOneCTWallet';
import { signTypedData } from '@wagmi/core';

const features = [
  {
    desc: 'Zero gas',
    img: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_689_150)">
          <path
            d="M24.0833 0H9.91667C4.43984 0 0 4.43984 0 9.91667V24.0833C0 29.5602 4.43984 34 9.91667 34H24.0833C29.5602 34 34 29.5602 34 24.0833V9.91667C34 4.43984 29.5602 0 24.0833 0Z"
            fill="url(#paint0_linear_689_150)"
            fill-opacity="0.25"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M20.4635 7.96808C20.5635 8.00148 20.6302 8.03489 20.7301 8.06829C21.2966 8.30212 21.6965 8.70298 21.8631 9.30426C21.8964 9.43788 21.8964 9.5715 21.8964 9.70511C21.8964 10.6738 21.9298 11.6426 21.9298 12.6113C21.9298 13.9809 21.9298 15.3505 21.9298 16.7201C21.9298 16.7535 21.9298 16.7869 21.9298 16.8203C22.0297 16.8537 22.0964 16.8537 22.1964 16.8871C22.9628 17.1209 23.4293 17.6554 23.6626 18.4237C23.6959 18.5573 23.6959 18.6909 23.6959 18.858C23.6959 19.4258 23.7292 20.0271 23.7292 20.595C23.7292 20.7286 23.7292 20.8956 23.7625 21.0292C23.8292 21.3967 24.0625 21.6973 24.3624 21.8978C25.1621 22.3988 26.2618 21.998 26.4617 21.0961C26.5284 20.8622 26.5284 20.6284 26.5284 20.3612C26.5284 19.6263 26.5284 18.858 26.5284 18.1231C26.5284 18.0897 26.4951 18.0228 26.4617 17.9894C25.9619 17.455 25.4287 16.9539 24.9289 16.4194C24.9289 16.4194 24.9289 16.386 24.8955 16.386C24.529 16.052 24.3624 15.6177 24.3624 15.1166C24.3624 14.2481 24.3624 13.3462 24.3624 12.4777C24.3624 12.4109 24.329 12.3441 24.2957 12.3107C23.6626 11.676 23.0628 11.0747 22.4296 10.44C22.3963 10.4066 22.363 10.4066 22.363 10.3732C22.5296 10.2062 22.6962 10.0392 22.8628 9.87214C22.9628 10.0058 23.0961 10.106 23.2294 10.2396C24.2957 11.3085 25.3621 12.3775 26.4284 13.4464C26.595 13.6134 26.7616 13.8139 26.9283 14.0143C27.0949 14.2147 27.1615 14.4486 27.1615 14.6824C27.2282 16.6867 27.1948 18.7243 27.1615 20.7286C27.1282 21.6973 26.6283 22.3988 25.7619 22.6995C24.529 23.1337 23.2627 22.332 23.0294 21.1963C22.9628 20.9624 22.9961 20.7286 22.9961 20.4948C22.9961 19.9269 22.9628 19.3924 22.9628 18.8246C22.9628 18.6575 22.9295 18.5239 22.8628 18.3903C22.7295 18.1565 22.5629 17.9226 22.3297 17.7556C22.1964 17.6554 22.0297 17.5886 21.8964 17.5886C21.8964 19.5595 21.8964 21.5637 21.8964 23.568C22.0297 23.568 22.1297 23.6014 22.263 23.6014C22.3963 23.6014 22.4963 23.7016 22.5962 23.7684C22.6296 23.8018 22.6296 23.8352 22.6296 23.8686C22.6296 24.3697 22.6296 24.9042 22.6296 25.4052C22.6296 25.4721 22.5962 25.5055 22.5629 25.5389C22.4963 25.6391 22.363 25.6725 22.263 25.6725C21.6632 25.6725 21.0634 25.6725 20.4635 25.6725C20.4302 25.6725 20.3969 25.6725 20.3636 25.6725C17.3312 25.6725 14.2988 25.6725 11.233 25.6725C11.0331 25.6725 10.8331 25.6725 10.6332 25.6391C10.3666 25.6391 10.2666 25.5389 10.2333 25.2716C10.2333 24.9042 10.2 24.5367 10.2 24.1693C10.2 24.0691 10.2 24.0023 10.2 23.902C10.2333 23.6682 10.3333 23.568 10.5999 23.5346C10.6998 23.5346 10.7998 23.5346 10.8998 23.5346C10.8998 23.4678 10.8998 23.4344 10.8998 23.401C10.8998 20.8956 10.8998 18.4237 10.8998 15.9184C10.8998 14.0143 10.8998 12.1436 10.8998 10.2396C10.8998 9.97235 10.8998 9.67171 10.9331 9.40447C11.0997 8.50255 11.9661 7.90127 12.6659 7.93467C12.8659 7.93467 13.0325 7.93467 13.2324 7.93467C15.6983 7.96808 18.0976 7.96808 20.4635 7.96808ZM21.23 23.5346C21.23 23.5012 21.23 23.4678 21.23 23.4344C21.23 18.8246 21.23 14.2481 21.1967 9.6383C21.1967 9.6049 21.1967 9.5715 21.1967 9.53809C21.0634 9.20405 20.8968 8.93681 20.5635 8.76979C20.3969 8.70298 20.2303 8.63617 20.0637 8.63617C19.5971 8.63617 19.1306 8.63617 18.6641 8.63617C18.0643 8.63617 17.4645 8.63617 16.8646 8.63617C15.4984 8.63617 14.1655 8.63617 12.7992 8.63617C12.2994 8.63617 11.8995 8.93681 11.7329 9.43788C11.6662 9.67171 11.6662 9.90554 11.6662 10.1394C11.6662 14.5822 11.6662 18.9916 11.6329 23.4344C11.6329 23.4678 11.6329 23.5012 11.6329 23.5346C14.8652 23.5346 18.031 23.5346 21.23 23.5346ZM10.9998 24.971C14.6653 24.971 18.2975 24.971 21.9298 24.971C21.9298 24.7372 21.9298 24.5033 21.9298 24.2695C18.2975 24.2695 14.632 24.2695 10.9998 24.2695C10.9998 24.5033 10.9998 24.7372 10.9998 24.971ZM25.1621 13.1124C25.1621 13.8473 25.1621 14.5488 25.1621 15.2837C25.1621 15.4841 25.2288 15.6511 25.3621 15.8181C25.7286 16.1856 26.0952 16.5864 26.4617 16.9539C26.4617 16.9539 26.4951 16.9873 26.5284 16.9873C26.5284 16.9539 26.5284 16.9539 26.5284 16.9205C26.5284 16.219 26.5284 15.4841 26.5284 14.7826C26.5284 14.6156 26.4617 14.4486 26.3284 14.3149C25.9619 13.9141 25.562 13.5132 25.1621 13.1124Z"
            fill="#98A9FF"
            stroke="#98A9FF"
            strokeWidth="0.3"
          />
          <circle cx="16.4333" cy="17.5666" r="3.46667" stroke="#98A9FF" />
          <line
            x1="19.3848"
            y1="15.3169"
            x2="13.4348"
            y2="19.9446"
            stroke="#98A9FF"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_689_150"
            x1="17"
            y1="0"
            x2="17"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#0038FF" />
            <stop offset="1" stop-color="#0038FF" stop-opacity="0.17" />
          </linearGradient>
          <clipPath id="clip0_689_150">
            <rect width="34" height="34" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    tooltip: `Trade gas-free without worrying about fluctuating gas price`,
  },
  {
    desc: 'Instant',
    img: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_235_11474)">
          <path
            d="M24.0833 0H9.91667C4.43984 0 0 4.43984 0 9.91667V24.0833C0 29.5602 4.43984 34 9.91667 34H24.0833C29.5602 34 34 29.5602 34 24.0833V9.91667C34 4.43984 29.5602 0 24.0833 0Z"
            fill="url(#paint0_linear_235_11474)"
            fill-opacity="0.25"
          />
          <path
            d="M21.6132 6.88181L21.5987 6.91238L21.5884 6.94465L19.1757 14.5076L18.998 15.0646L19.5759 15.1537L22.5892 15.6184L22.6271 15.6242H22.6654C22.9608 15.6242 23.1862 15.7891 23.2665 15.9809C23.3396 16.1555 23.2946 16.3739 23.101 16.5282L23.085 16.5409L23.0702 16.5549L13.6229 25.4314C13.392 25.6019 13.0524 25.6136 12.8089 25.4533C12.5717 25.2971 12.517 25.0474 12.6101 24.8516L12.6232 24.8241L12.6329 24.7952L15.0038 17.6974L15.1991 17.1126L14.5865 17.0423L11.3915 16.6757L11.3631 16.6725H11.3345C11.0444 16.6725 10.8143 16.5058 10.7334 16.3126C10.6603 16.138 10.7053 15.9196 10.8989 15.7653L10.9186 15.7497L10.9366 15.7321L20.6037 6.29961C20.8346 6.13143 21.1721 6.12061 21.4144 6.28016C21.6516 6.43629 21.7064 6.68604 21.6132 6.88181Z"
            stroke="#FFE200"
          />
        </g>
        <defs>
          <linearGradient
            id="paint0_linear_235_11474"
            x1="17"
            y1="0"
            x2="17"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#F7931A" />
            <stop offset="1" stop-color="#F7931A" stop-opacity="0.17" />
          </linearGradient>
          <clipPath id="clip0_235_11474">
            <rect width="34" height="34" fill="white" />
          </clipPath>
        </defs>
      </svg>
    ),
    tooltip: `Get instant trade confirmation without waiting for block to be mined`,
  },
  {
    desc: '1 Click',
    img: (
      <svg
        width="34"
        height="34"
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.0833 0H9.91667C4.43984 0 0 4.43984 0 9.91667V24.0833C0 29.5602 4.43984 34 9.91667 34H24.0833C29.5602 34 34 29.5602 34 24.0833V9.91667C34 4.43984 29.5602 0 24.0833 0Z"
          fill="url(#paint0_linear_235_11475)"
          fill-opacity="0.25"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.9513 16.9496C18.0372 16.6071 18.5307 16.7294 19.3204 17.4878C19.5919 17.3165 19.9127 17.1942 20.2582 17.1697C20.8751 17.1208 21.4427 17.2676 21.8869 17.7079C21.961 17.7813 21.9856 17.7813 22.0843 17.7324C22.6519 17.4633 23.2689 17.3899 23.8612 17.659C24.5028 17.9526 24.8483 18.4908 24.9223 19.1758C24.947 19.3226 24.9223 19.4938 24.9223 19.6651C24.9223 21.3776 24.9223 23.09 24.9223 24.8025C24.9223 26.0013 24.1573 26.9309 22.9728 27.1511C22.8247 27.1755 22.6519 27.2 22.5039 27.2C20.0114 27.2 17.4942 27.2 15.0018 27.2C14.7797 27.2 14.6316 27.1266 14.4589 26.9798C13.3237 25.8545 12.1885 24.7291 11.0533 23.6038C10.6091 23.1634 10.313 22.6252 10.2142 21.9892C10.0909 21.084 10.7818 20.2767 11.6949 20.2033C12.3119 20.1544 12.8054 20.3501 13.2496 20.7904C13.2743 20.8149 13.3237 20.8638 13.3977 20.9127C13.3977 20.8149 13.3977 20.766 13.3977 20.717C13.3977 18.5887 13.3977 16.4847 13.3977 14.3564C13.3977 13.5735 13.8666 12.8885 14.5576 12.5949C15.5694 12.1791 16.7045 12.8151 16.9513 13.916C16.976 14.0873 17.0007 14.234 17.0007 14.4053C17.0007 15.1881 17.0007 15.971 17.0007 16.7538C16.9513 16.8272 16.9513 16.8762 16.9513 16.9496ZM14.3108 18.1238C14.3108 19.396 14.3108 20.6926 14.3108 21.9647C14.3108 22.1849 14.2367 22.3561 14.0146 22.4295C13.8172 22.5029 13.6445 22.454 13.4717 22.3072C13.2496 22.087 13.0275 21.8668 12.8054 21.6467C12.682 21.5243 12.5586 21.402 12.4106 21.2797C12.1144 21.0351 11.6949 21.0351 11.3741 21.2552C11.1273 21.4265 11.0286 21.7201 11.152 22.1115C11.2507 22.454 11.4481 22.7231 11.6949 22.9677C12.7808 24.0441 13.8666 25.1206 14.9524 26.1725C15.0018 26.2214 15.1005 26.2704 15.1745 26.2704C17.6176 26.2704 20.0854 26.2704 22.5285 26.2704C23.3429 26.2704 23.9846 25.6343 23.9846 24.827C23.9846 23.0166 23.9846 21.2308 23.9846 19.4204C23.9846 19.029 23.8365 18.6865 23.491 18.5153C23.1208 18.3195 22.7507 18.4174 22.4052 18.6131C22.3064 18.662 22.2571 18.7354 22.2818 18.8578C22.2818 19.0779 22.2818 19.2981 22.2818 19.5427C22.2818 19.8363 22.0843 20.032 21.8129 20.032C21.5414 20.032 21.344 19.8363 21.344 19.5183C21.344 19.2247 21.344 18.9311 21.344 18.6376C21.344 18.4663 21.27 18.344 21.1466 18.2462C20.8011 17.977 20.2088 17.977 19.8387 18.2217C19.6906 18.3195 19.5919 18.4663 19.6166 18.662C19.6166 18.9556 19.6166 19.2247 19.6166 19.5183C19.6166 19.8119 19.4191 20.0076 19.1477 20.0076C18.8762 20.0076 18.6788 19.8119 18.6788 19.5183C18.6788 19.1513 18.6788 18.8088 18.6788 18.4419C18.6788 18.2706 18.6294 18.0994 18.5307 17.977C18.3086 17.6835 17.8644 17.5856 17.4942 17.7079C17.1241 17.8303 16.9513 18.0749 16.9513 18.4908C16.9513 18.8333 16.9513 19.2003 16.9513 19.5427C16.9513 19.8608 16.7046 20.032 16.4084 19.9831C16.1863 19.9586 16.0382 19.7629 16.0382 19.4938C16.0382 17.7813 16.0382 16.0688 16.0382 14.3564C16.0382 14.2585 16.0382 14.1362 16.0136 14.0383C15.8655 13.3778 15.1005 13.1087 14.6316 13.5735C14.4342 13.7692 14.3355 14.0139 14.3355 14.3074C14.3108 15.604 14.3108 16.8762 14.3108 18.1238Z"
          fill="#00E3D1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M13.6 10.518C13.6 10.9325 13.4869 11.1585 13.2892 11.2716C13.0631 11.3846 12.8654 11.347 12.6958 11.1209C12.272 10.5933 11.8765 10.0281 11.4809 9.50055C11.1137 9.01069 10.7464 8.52083 10.3791 8.03097C10.1813 7.7672 10.153 7.46574 10.2661 7.16429C10.4356 6.74979 10.8594 6.67443 11.1419 7.01356C11.6222 7.65415 12.1025 8.29474 12.6111 8.93533C12.8936 9.31215 13.2044 9.68896 13.4587 10.0658C13.5152 10.2165 13.5717 10.4426 13.6 10.518Z"
          fill="#00E3D1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.8368 7.93466C15.8368 8.48712 15.8368 9.06865 15.8368 9.62111C15.8368 9.8828 15.6877 10.0863 15.4491 10.1736C15.2403 10.2317 14.9719 10.2026 14.8526 9.9991C14.7929 9.8828 14.7333 9.73741 14.7333 9.62111C14.7333 8.48712 14.7333 7.35313 14.7333 6.24822C14.7333 5.8993 14.9719 5.66669 15.2999 5.66669C15.5982 5.66669 15.8666 5.8993 15.8666 6.21914C15.8368 6.7716 15.8368 7.35313 15.8368 7.93466Z"
          fill="#00E3D1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.9934 7.11972C19.9655 7.19365 19.9096 7.41544 19.8257 7.52634C19.043 8.56136 18.2603 9.59639 17.4776 10.6314C17.254 10.9271 16.9465 10.9271 16.7509 10.6314C16.5552 10.3727 16.5272 9.92907 16.7509 9.63335C17.5335 8.59833 18.3162 7.5633 19.0989 6.52828C19.2667 6.30649 19.4623 6.26952 19.686 6.38042C19.8816 6.52828 19.9655 6.75007 19.9934 7.11972Z"
          fill="#00E3D1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M19.2667 12.4667C18.7145 12.4667 18.1624 12.4667 17.5812 12.4667C17.2325 12.4667 17 12.2523 17 11.8847C17 11.5478 17.2325 11.3334 17.5812 11.3334C18.7145 11.3334 19.8188 11.3334 20.9521 11.3334C21.3009 11.3334 21.5333 11.5784 21.5333 11.9154C21.5333 12.2523 21.3009 12.4667 20.9231 12.4667C20.3709 12.4667 19.8188 12.4667 19.2667 12.4667Z"
          fill="#00E3D1"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M10.2023 12.4667C9.62171 12.4667 9.0411 12.4667 8.48952 12.4667C8.25728 12.4667 8.05407 12.3136 7.96698 12.0685C7.87989 11.8235 7.96698 11.5478 8.17019 11.4253C8.25728 11.364 8.40243 11.3334 8.48952 11.3334C9.62171 11.3334 10.7539 11.3334 11.8861 11.3334C12.2344 11.3334 12.4667 11.5784 12.4667 11.9154C12.4667 12.2523 12.2344 12.4667 11.8861 12.4667C11.3345 12.4667 10.7539 12.4667 10.2023 12.4667Z"
          fill="#00E3D1"
        />
        <defs>
          <linearGradient
            id="paint0_linear_235_11475"
            x1="17"
            y1="0"
            x2="17"
            y2="39"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#5FFFBC" />
            <stop offset="1" stop-color="#5FFFBC" stop-opacity="0" />
            <stop offset="1" stop-color="#00DD80" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tooltip: `Say goodbye to wallet confirmations and hello to 2x faster trading`,
  },

  {
    desc: 'Non Custodial',
    img: (
      <svg
        width="34"
        height="35"
        viewBox="0 0 34 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M24.0833 0H9.91667C4.43984 0 0 4.43984 0 9.91667V24.0833C0 29.5602 4.43984 34 9.91667 34H24.0833C29.5602 34 34 29.5602 34 24.0833V9.91667C34 4.43984 29.5602 0 24.0833 0Z"
          fill="url(#paint0_linear_235_11327)"
          fill-opacity="0.25"
        />
        <g filter="url(#filter0_d_235_11327)">
          <path
            d="M9.58083 14.9656L9.08083 14.9673L9.58083 14.9656L9.56828 11.1134H9.63624C11.8764 11.1134 14.5276 10.1944 16.7303 8.69059C16.7303 8.69059 16.7303 8.69058 16.7303 8.69058L16.9562 8.53637L17.2571 8.73673C19.4989 10.2298 22.0534 11.1124 24.2536 11.1132C24.2536 11.1132 24.2536 11.1132 24.2536 11.1132L24.3447 11.1132V14.78C24.3447 17.0775 24.3445 18.2034 24.3087 18.8633C24.2912 19.1877 24.2658 19.3804 24.2324 19.5337C24.1987 19.6884 24.1542 19.8172 24.0796 20.0298C23.596 21.409 22.6047 22.7855 21.1732 24.0137C19.7282 25.2534 18.2187 25.9803 17.0948 26.067C16.5032 26.1126 15.6409 25.87 14.6683 25.3446C13.7112 24.8276 12.7084 24.0695 11.8508 23.1713C10.7619 22.0307 10.0359 20.8089 9.68282 19.562C9.6808 19.5548 9.67881 19.5479 9.67686 19.5411C9.64306 19.4233 9.62049 19.3446 9.60662 18.8018C9.5916 18.2139 9.58789 17.1328 9.58083 14.9656Z"
            stroke="#C86DFF"
            shape-rendering="crispEdges"
          />
        </g>
        <path
          d="M13.6 17.4772L15.9263 19.8035L20.9666 13.6"
          stroke="#C86DFF"
          strokeWidth="1.2"
        />
        <defs>
          <filter
            id="filter0_d_235_11327"
            x="5.06665"
            y="7.93333"
            width="23.7781"
            height="26.6391"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood flood-opacity="0" result="BackgroundImageFix" />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset dy="4" />
            <feGaussianBlur stdDeviation="2" />
            <feComposite in2="hardAlpha" operator="out" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_235_11327"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_235_11327"
              result="shape"
            />
          </filter>
          <linearGradient
            id="paint0_linear_235_11327"
            x1="17"
            y1="0"
            x2="17"
            y2="34"
            gradientUnits="userSpaceOnUse"
          >
            <stop stop-color="#B85FFF" />
            <stop offset="1" stop-color="#B85FFF" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
    tooltip: `Trade with full custody of your funds. No deposit or signups required.`,
  },
];
const desc = 'text-2';
const OneCTModal: React.FC<any> = ({}) => {
  const { address } = useAccount();
  const isModalOpen = useAtomValue(isOneCTModalOpenAtom);
  const setModal = useSetAtom(isOneCTModalOpenAtom);
  const [laoding, setLaoding] = useState(false);
  const { activeChain } = useActiveChain();
  const configData =
    appConfig[activeChain.id as unknown as keyof typeof appConfig];
  const {
    generatePk,
    oneCtAddress,
    nonce,
    registeredOneCT,
    createLoading,
    oneCtPk,
  } = useOneCTWallet();
  const toastify = useToast();
  const setOnboardingAnimation = useSetAtom(showOnboardingAnimationAtom);

  const handleRegister = async () => {
    if (registeredOneCT) {
      return toastify({
        msg: 'You have already registered your 1CT Account. You can start 1CT now!',
        type: 'success',
        id: 'registeredOneCT',
      });
    }
    if (typeof oneCtPk !== 'string')
      return toastify({
        msg: 'Please create your 1CT Account first',
        type: 'error',
        id: 'oneCtPk',
      });

    if (
      !oneCtAddress ||
      !address ||
      nonce === undefined ||
      nonce === null ||
      !activeChain
    )
      return toastify({
        msg: 'Someting went wrong. Please try again later',
        type: 'error',
        id: 'noparams',
      });
    try {
      setLaoding(true);

      const wallet = getWalletFromOneCtPk(oneCtPk);

      const domain = {
        name: 'Validator',
        version: '1',
        chainId: activeChain.id,
        verifyingContract: getAddress(configData.signer_manager),
      } as const;

      const types = {
        EIP712Domain,
        RegisterAccount: [
          { name: 'oneCT', type: 'address' },
          { name: 'user', type: 'address' },
          { name: 'nonce', type: 'uint256' },
        ],
      };
      const msgParams = {
        primaryType: 'RegisterAccount',
        domain: domain,
        value: {
          oneCT: wallet.address,
          user: address,
          nonce: nonce,
        },
      };
      const signature = await signTypedData({
        types,
        domain,
        value: {
          oneCT: wallet.address,
          user: address,
          nonce: nonce,
        },
      });

      console.log('signature', signature);
      if (!signature) {
        setLaoding(false);
        return toastify({
          msg: 'User rejected to sign.',
          type: 'error',
          id: 'signature',
        });
      }

      const apiParams = {
        one_ct: wallet.address,
        account: address,
        nonce: nonce,
        registration_signature: signature,
        environment: activeChain.id,
      };

      const resp = await axios.post(baseUrl + 'register/', null, {
        params: apiParams,
      });

      console.log(resp, 'resp');
      if (resp?.data?.one_ct && resp.data.one_ct !== zeroAddress) {
        setOnboardingAnimation(true);
      }
    } catch (e) {
      console.log(e, 'register api error');
      toastify({
        msg: `Error in register API. please try again later. ${e}`,
        type: 'error',
        id: 'registerapi',
      });
    }
    setLaoding(false);
  };

  return (
    <ModalBase
      open={isModalOpen}
      onClose={() => setModal((m) => false)}
      className="max-w-[600px]"
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <h3 className="font-[500] text-f20  ml-[20px]">
            Activate your Trading Account
          </h3>
        </div>
        <button
          className="p-3 text-1 rounded-full bg-2"
          onClick={() => setModal((m) => false)}
        >
          <CloseOutlined className="!scale-125" />
        </button>
      </div>

      <div className="flex-col mt-[25px] text-3 text-f14 font-[500]">
        <div className="flex  justify-between mb-4 ">
          {features.map((s, idx) => {
            return (
              <NumberTooltip key={s.tooltip} content={s.tooltip}>
                <div
                  className={`flex  flex-col content-center items-center ${
                    idx == 0
                      ? 'pr-[30px]'
                      : idx + 1 == features.length
                      ? 'pl-[30px]'
                      : 'px-[30px]'
                  } ${idx < features.length - 1 ? 'border-right' : ''}`}
                >
                  {s.img}
                  <div className="mt-3">{s.desc}</div>
                </div>
              </NumberTooltip>
            );
          })}
        </div>
        <Card>
          <>
            <div className="flex flex-col items-start">
              Create your account
              <div className={desc}>Sign using a web 3 wallet</div>
            </div>
            <BlueBtn
              className={` !w-[120px] px-[15px] ${oneCtPk ? '!bg-green' : ''}`}
              onClick={
                oneCtPk
                  ? () => {
                      toastify({
                        msg: `Already created `,
                        type: 'success',
                        id: 'alreadycreated',
                      });
                    }
                  : generatePk
              }
              isLoading={createLoading}
            >
              {oneCtPk ? (
                <div className="flex items-center">
                  {' '}
                  <GreenTickMark /> Created
                </div>
              ) : (
                'Create'
              )}
            </BlueBtn>
          </>
        </Card>
        <Card>
          <>
            <div className="flex flex-col items-start">
              Register your account
              <div className={desc}>No gas required</div>
            </div>
            <BlueBtn
              className={`${
                registeredOneCT ? '!bg-green' : ''
              } !w-[120px] px-[15px]`}
              onClick={
                registeredOneCT
                  ? () => {
                      toastify({
                        msg: ` ${oneCtAddress} already registered `,
                        type: 'success',
                        id: 'alreadyregistered',
                      });
                    }
                  : handleRegister
              }
              isLoading={laoding}
            >
              {registeredOneCT ? (
                <div className="flex items-center">
                  {' '}
                  <GreenTickMark /> Registered
                </div>
              ) : (
                'Register'
              )}
            </BlueBtn>
          </>
        </Card>
      </div>
    </ModalBase>
  );
};

export { OneCTModal };

const Card = ({ children }: { children: JSX.Element }) => (
  <div className="w-full bg-[#2C2C41] w-[360px] p-[20px] flex items-center justify-between rounded-[10px] mt-[12px] text-1 text-f16 font-[500]">
    {children}
  </div>
);

const GreenTickMark = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={17}
    fill="none"
    {...props}
  >
    <path
      fill="#3FB68B"
      d="M0 3a3 3 0 0 1 3-3h11.657a3 3 0 0 1 3 3v10.041a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V3Z"
    />
    <path stroke="#fff" strokeWidth={2} d="m4 9 3 3 6.5-8" />
  </svg>
);
