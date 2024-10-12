'useClient'

import { useTheme } from "next-themes";

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button";

const ThemeIcon = ({ ...props }) => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  }

  return (
    <Button 
      onClick={toggleTheme} 
      variant='link' 
      className={`${props} transition-transform duration-300 ease-in-out transform hover:scale-110`}
    >
      {theme === "light" ? <Sun /> : <Moon />}
    </Button>
  );
}



export default ThemeIcon;
