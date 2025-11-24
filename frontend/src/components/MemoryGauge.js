import React, { useEffect } from "react";

export default function MemoryGauge({ memory }) {

    useEffect(() => {
        window.drawGauge("memGauge", memory, "Memory");
    }, [memory]);

    return <canvas id="memGauge" width="200" height="200"></canvas>;
}

