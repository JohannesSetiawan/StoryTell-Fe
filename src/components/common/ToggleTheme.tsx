import { Sun, Moon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function ToggleTheme() {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());

  const applyTheme = useCallback(() => {
    if (currentTheme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [currentTheme]);

  useEffect(() => {
    applyTheme();
  }, [applyTheme]);

  function getInitialTheme() {
    let userTheme = null;
    let systemTheme = true;
    if (typeof window !== "undefined" && window.localStorage) {
      userTheme = localStorage.getItem("theme");
      systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return userTheme ?? (systemTheme ? "dark" : "light");
  }

  function toggleTheme() {
    setCurrentTheme(currentTheme === "dark" ? "light" : "dark");
  }

  return (
    <div>
      {currentTheme === "dark" ? (
        <Sun width="24px" height="24px" onClick={toggleTheme} />
      ) : (
        <Moon width="24px" height="24px" onClick={toggleTheme} />
      )}
    </div>
  );
}