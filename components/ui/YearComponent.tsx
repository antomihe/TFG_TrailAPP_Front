'use client';
import React from 'react'
import { useEffect, useState } from "react";

export default function YearComponent () {

    const [year, setYear] = useState<number | null>(null);

    useEffect(() => {
        setYear(new Date().getFullYear());
    }, []);
    return (
        <span>{year}</span>
    )
}

