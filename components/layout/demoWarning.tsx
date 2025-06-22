'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { AlertTriangle } from "lucide-react";

const STORAGE_KEY = "demoWarningDismissed";

export default function DemoToast() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const fetchUrl = `${apiUrl}/health`;
  const docsUrl = `${apiUrl}/docs`;

  useEffect(() => {
    if (pathname !== "/" || !apiUrl) return;

    const prefetchBackend = async () => {
      try {
        await fetch(fetchUrl, { method: "GET" });
      } catch {
        // ignorar errores
      }
    };

    prefetchBackend();
  }, [pathname, apiUrl]);

  useEffect(() => {
    if (pathname === "/" || !apiUrl) return;

    const alreadyDismissed = sessionStorage.getItem(STORAGE_KEY);
    if (alreadyDismissed) return;

    const checkBackend = async () => {
      try {
        const res = await fetch(fetchUrl, { method: "GET" });
        if (res.status !== 204) {
          setVisible(true);
        }
      } catch {
        setVisible(true);
      }
    };

    checkBackend();
  }, [pathname, apiUrl]);

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 60000);

    return () => clearTimeout(timer);
  }, [visible]);

  const handleClose = () => {
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  if (pathname === "/" || !visible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in transition-opacity duration-300">
      <div className="flex items-start gap-3 bg-yellow-100 text-yellow-900 border border-yellow-300 p-4 rounded-2xl shadow-xl max-w-sm">
        <AlertTriangle className="w-6 h-6 mt-1 text-yellow-700" />
        <div className="flex-1 text-sm leading-relaxed">
          <strong className="block mb-1">¡ATENCIÓN - MODO DEMO!</strong>
          El backend puede estar “durmiendo” y tardar hasta <strong>50s</strong> en responder.
          <br />
          Para saber si está despierto, visita{" "}
          <a
            href={docsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-semibold"
          >
            esta página de documentación
          </a>{" "}
          y asegúrate de que no ves una pantalla de carga.
        </div>
        <button
          onClick={handleClose}
          aria-label="Cerrar aviso"
          className="ml-2 font-bold text-xl leading-none hover:text-yellow-600"
        >
          ×
        </button>
      </div>
    </div>
  );
}
