import React, { useEffect } from "react";

export default function CpuGauge({ cpu }) {

    useEffect(() => {
        window.drawGauge("cpuGauge", cpu, "CPU");
    }, [cpu]);

    return <canvas id="cpuGauge" width="200" height="200"></canvas>;
}

