import { IoMdSunny } from "react-icons/io";
import { IoMoonSharp } from "react-icons/io5";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">(getInitialTheme);

  function getInitialTheme() {
    if (typeof localStorage !== "undefined" && localStorage.theme) {
      return localStorage.theme as "light" | "dark";
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <div className="text-lg cursor-pointer">
      <AnimatePresence mode="wait" initial={true}>
        {theme === "dark" ? (
          <motion.div
            key="moon"
            onClick={toggleTheme}
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <IoMoonSharp />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            onClick={toggleTheme}
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.4 }}
          >
            <IoMdSunny />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeToggle;
