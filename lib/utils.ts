import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dateToText(date: Date): string {
  date = new Date(date);

  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
  ];

  const days = date.getDate();
  const mes = months[date.getMonth()];
  const year = date.getFullYear();

  return `${days} de ${mes} de ${year}`;
}


