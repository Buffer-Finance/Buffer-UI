import React from "react";
import { Background } from "./style";
import { Switch } from "@mui/material";
interface IToggleButton {}
export default function ToggleButton({
  onChange,
  value,
  className,
}: {
  onChange: () => void;
  value: boolean;
  className?: string;
}) {
  return (
    <Background className={`${className ? className : ""}`}>
      <label className="theme-switcher">
        <div className="background">
          <p className="theme-switcher-image">Yes</p>
          <p className="theme-switcher-image">No</p>
        </div>
        <input
          checked={value}
          type="checkbox"
          // id="themeswitch"
          onChange={onChange}
        />
        <div className="switch"> </div>
      </label>
    </Background>
  );
}
