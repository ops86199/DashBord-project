import React, { useEffect, useState } from "react";
import GlassCard from "../components/GlassCard";
import CpuGauge from "../components/CpuGauge";
import MemoryGauge from "../components/MemoryGauge";
import NetworkSpeedometer from "../components/NetworkSpeedometer";
import DigitalMeter from "../components/DigitalMeter";

export default function Dashboard() {

    const [cpu, setCpu] = useState(0);
    const [memory, setMemory] = useState(0);
    const [download, setDownload] = useState(0);
    const [upload, setUpload] = useState(0);

    useEffect(() => {
        const fetchMetrics = () => {
            fetch("http://backend-svc:8081/metrics/summary")
                .then(res => res.json())
                .then(data => {
                    setCpu(data.cpu);
                    setMemory(data.memoryPercent);
                    setDownload(Number((data.downloadBytesPerSec / 1024).toFixed(1))); // KB/s
                    setUpload(Number((data.uploadBytesPerSec / 1024).toFixed(1)));
                });
        };

        fetchMetrics();
        const interval = setInterval(fetchMetrics, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1 className="heading">🚀 System Monitoring Dashboard (Glass UI)</h1>

            <div className="dashboard-grid">
                <GlassCard><CpuGauge cpu={cpu} /></GlassCard>
                <GlassCard><MemoryGauge memory={memory} /></GlassCard>
                <GlassCard><NetworkSpeedometer speed={download} /></GlassCard>

                <GlassCard>
                    <DigitalMeter label="Download Speed" value={download + " KB/s"} />
                </GlassCard>

                <GlassCard>
                    <DigitalMeter label="Upload Speed" value={upload + " KB/s"} />
                </GlassCard>

                <GlassCard>
                    <DigitalMeter label="CPU %" value={cpu + "%"} />
                </GlassCard>
            </div>
        </div>
    );
}

