"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui"

interface ThemeIconProps {
  className?: string; 
}

const useHandleThemeChange = () => {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return { theme, handleThemeChange }
}

const ThemeIconButton:React.FC<ThemeIconProps> = ({ className }: ThemeIconProps) => {
  const { theme, handleThemeChange } = useHandleThemeChange()

  return (
    <Button variant="outline" size="icon" className={`bg-transparent hover:bg-accent border-0 ${className}`} onClick={handleThemeChange}>
      {theme === "dark" ? (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      )}
    </Button>
  )
}

const ThemeIcon:React.FC<ThemeIconProps> = ({ className }: ThemeIconProps) => {
  const { theme } = useHandleThemeChange()

  return (
    <>
      {theme === "dark" ? (
        <Moon className={`h-[1.2rem] w-[1.2rem] ${className}`} />
      ) : (
        <Sun className={`h-[1.2rem] w-[1.2rem] ${className}`} />
      )}
    </>
  )
}

export { ThemeIconButton, ThemeIcon }