'use client';
import React, { useEffect, useState } from "react";

const YearComponent: React.FC = () => {
    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);

    return <span>{year}</span>;
}

export { YearComponent };
