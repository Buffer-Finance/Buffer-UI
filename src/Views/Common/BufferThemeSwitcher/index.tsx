// @ts-nocheck
import { useEffect, useState } from "react";
import { Background } from "./styles";
import { useGlobal } from "@Contexts/Global";

const ThemeSwitcher = () => {
  const { state, dispatch } = useGlobal();

  function toggleDarkMode() {
    localStorage.setItem("theme", `${state.isDarkMode ? 0 : 1}`);
    dispatch({ type: "UPDATE_IS_DARK_MODE", payload: !state.isDarkMode });
  }

  useEffect(() => {
    let theme = localStorage.getItem("theme");
    if (theme)
      dispatch({
        type: "UPDATE_IS_DARK_MODE",
        payload: theme === "1" ? true : false,
      });
  }, []);

  return (
    <Background>
      <label className="theme-switcher" htmlFor="themeswitch">
        <div className="background">
          <svg
            className="theme-switcher-image"
            width="18"
            height="18"
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13.8859 10.1045C13.3795 10.2304 12.8732 10.2934 12.3668 10.2934C9.20218 10.2934 6.67047 7.77427 6.67047 4.62532C6.67047 4.12149 6.73377 3.61766 6.86035 3.11383C6.92364 2.92489 6.86035 2.67298 6.67047 2.48404C6.48059 2.2951 6.29072 2.23212 6.03754 2.2951C3.06278 3.17681 0.974121 5.94788 0.974121 9.03385C0.974121 12.8756 4.07547 15.9615 7.93633 15.9615C11.0377 15.9615 13.8226 13.8832 14.6454 10.8602C14.7087 10.6713 14.6454 10.4194 14.4555 10.2304C14.3289 10.1045 14.0757 10.0415 13.8859 10.1045Z"
              fill="#808191"
            />
            <path
              d="M9.20251 3.36584H9.83544V3.99563C9.83544 4.3735 10.0886 4.62542 10.4684 4.62542C10.8481 4.62542 11.1013 4.3735 11.1013 3.99563V3.36584H11.7342C12.114 3.36584 12.3671 3.11392 12.3671 2.73605C12.3671 2.35817 12.114 2.10626 11.7342 2.10626H11.1013V1.47647C11.1013 1.0986 10.8481 0.84668 10.4684 0.84668C10.0886 0.84668 9.83544 1.0986 9.83544 1.47647V2.10626H9.20251C8.82275 2.10626 8.56958 2.35817 8.56958 2.73605C8.56958 3.11392 8.82275 3.36584 9.20251 3.36584Z"
              fill="#808191"
            />
            <path
              d="M15.5321 5.88458H14.8991V5.25479C14.8991 4.87692 14.646 4.625 14.2662 4.625C13.8865 4.625 13.6333 4.87692 13.6333 5.25479V5.88458H13.0004C12.6206 5.88458 12.3674 6.13649 12.3674 6.51437C12.3674 6.89224 12.6206 7.14416 13.0004 7.14416H13.6333V7.77395C13.6333 8.15182 13.8865 8.40374 14.2662 8.40374C14.646 8.40374 14.8991 8.15182 14.8991 7.77395V7.14416H15.5321C15.9118 7.14416 16.165 6.89224 16.165 6.51437C16.165 6.13649 15.9118 5.88458 15.5321 5.88458Z"
              fill="#808191"
            />
          </svg>
          <svg
            className="theme-switcher-image"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.05875 9.38224H2.50787"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.39491 3.74664L4.41944 4.77117"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.02975 1.41284V2.86196"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14.6641 3.74664L13.6396 4.77117"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 9.38224H15.5509"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M13.3772 9.38255C13.3772 6.98136 11.431 5.03519 9.02984 5.03519C6.62865 5.03519 4.68248 6.98136 4.68248 9.38255C4.68248 11.2744 5.89322 12.88 7.58072 13.477V16.6281H10.479V13.477C12.1665 12.88 13.3772 11.2744 13.3772 9.38255Z"
              fill="#808191"
              stroke="#808191"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <input
          checked={!state.isDarkMode}
          type="checkbox"
          id="themeswitch"
          onChange={toggleDarkMode}
        />
        <div className="switch"> </div>
      </label>
    </Background>
  );
};

export default ThemeSwitcher;
