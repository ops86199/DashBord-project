import React, { useEffect } from "react";

export default function NetworkSpeedometer({ speed }) {

    useEffect(() => {
        window.drawSpeedometer("netSpeed", speed);
    }, [speed]);

    return <canvas id="netSpeed" width="200" height="200"></canvas>;
}

