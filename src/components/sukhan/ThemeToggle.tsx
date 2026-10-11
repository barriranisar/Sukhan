import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  // Yahan default state ko 'true' (light theme) kar diya gaya ha
  const [day, setDay] = useState(true); 

  useEffect(() => {
    // Agar local storage mein 'night' save nahi ha, tu hamesha 'day' (light) hi rahega
    const savedTheme = localStorage.getItem("sukhan-theme");
    setDay(savedTheme !== "night");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light", day);
    document.documentElement.classList.toggle("dark", !day);
  }, [day]);

  return (
    <button
      aria-label={day ? "Switch to Night View" : "Switch to Day View"}
      onClick={() => {
        const next = !day;
        localStorage.setItem("sukhan-theme", next ? "day" : "night");
        setDay(next);
      }}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-primary transition-transform hover:scale-105"
    >
      {/* Agar day ha tu Moon ka icon dikhega (raat mein switch karne ke liye), warna Sun */}
      {day ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
    </button>
  );
}