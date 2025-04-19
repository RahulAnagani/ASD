import { useEffect, useState } from "react";
import "./fancy.css";

function getInitialTheme(): "light" | "dark" {
  if (typeof localStorage !== "undefined" && localStorage.theme) {
    return localStorage.theme as "light" | "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

const RappaRappa = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="toggle-switch rsp">
      <label className="switch-label">
        <input
          type="checkbox"
          className="checkbox"
          checked={theme === "light"}
          onChange={toggleTheme}
        />
        <span className="slider"></span>
      </label>
    </div>
  );
};

export default RappaRappa;
