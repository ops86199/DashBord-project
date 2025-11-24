package com.system.monitor.service;

import oshi.SystemInfo;
import oshi.hardware.CentralProcessor;
import oshi.hardware.GlobalMemory;
import oshi.hardware.NetworkIF;
import oshi.hardware.HardwareAbstractionLayer;

import java.util.HashMap;
import java.util.Map;

/**
 * Provides system metrics using OSHI.
 * Synchronized to protect previous-tick state when called from multiple threads.
 */
public class MetricsService {

    private final SystemInfo si;
    private final HardwareAbstractionLayer hal;
    private final CentralProcessor processor;
    private final GlobalMemory memory;

    // previous values for CPU ticks and network bytes
    private long[] prevCpuTicks;
    private long prevTotalRx = -1;
    private long prevTotalTx = -1;

    public MetricsService() {
        this.si = new SystemInfo();
        this.hal = si.getHardware();
        this.processor = hal.getProcessor();
        this.memory = hal.getMemory();
        this.prevCpuTicks = processor.getSystemCpuLoadTicks();
        // initialize prev network on first call
        updatePrevNetworkTotals();
    }

    private void updatePrevNetworkTotals() {
        long rx = 0, tx = 0;
        NetworkIF[] nets = hal.getNetworkIFs();
        if (nets != null) {
            for (NetworkIF nif : nets) {
                try {
                    nif.updateAttributes();
                    rx += nif.getBytesRecv();
                    tx += nif.getBytesSent();
                } catch (Throwable ignored) {
                }
            }
        }
        this.prevTotalRx = rx;
        this.prevTotalTx = tx;
    }

    /**
     * Get a snapshot summary of metrics:
     * - cpu (percent)
     * - memoryPercent
     * - downloadBytesPerSec
     * - uploadBytesPerSec
     *
     * This method is synchronized because it updates internal previous-state.
     */
    public synchronized Map<String, Object> fetchSummary() {
        Map<String, Object> out = new HashMap<>();

        // CPU % since last call
        double cpuLoad = 0.0;
        try {
            double loadBetween = processor.getSystemCpuLoadBetweenTicks(prevCpuTicks);
            cpuLoad = loadBetween * 100.0;
            prevCpuTicks = processor.getSystemCpuLoadTicks();
        } catch (Throwable t) {
            cpuLoad = 0.0;
        }

        // Memory %
        long totalMem = memory.getTotal();
        long availMem = memory.getAvailable();
        double memPercent = 0.0;
        if (totalMem > 0) {
            memPercent = ((double)(totalMem - availMem) / (double) totalMem) * 100.0;
        }

        // Network bytes delta since last call
        long rx = 0, tx = 0;
        NetworkIF[] nets = hal.getNetworkIFs();
        if (nets != null) {
            for (NetworkIF nif : nets) {
                try {
                    nif.updateAttributes();
                    rx += nif.getBytesRecv();
                    tx += nif.getBytesSent();
                } catch (Throwable ignored) {
                }
            }
        }

        long downloadDelta = 0;
        long uploadDelta = 0;
        if (prevTotalRx >= 0 && prevTotalTx >= 0) {
            downloadDelta = rx - prevTotalRx;
            uploadDelta = tx - prevTotalTx;
            if (downloadDelta < 0) downloadDelta = 0;
            if (uploadDelta < 0) uploadDelta = 0;
        }

        // store current totals as previous for next call
        prevTotalRx = rx;
        prevTotalTx = tx;

        // round to two decimals
        double cpuRounded = Math.round(cpuLoad * 100.0) / 100.0;
        double memRounded = Math.round(memPercent * 100.0) / 100.0;

        out.put("cpu", cpuRounded);
        out.put("memoryPercent", memRounded);
        out.put("downloadBytesPerSec", downloadDelta);
        out.put("uploadBytesPerSec", uploadDelta);

        // optionally add raw totals for debugging
        out.put("totalMemoryBytes", totalMem);
        out.put("availableMemoryBytes", availMem);

        return out;
    }
}

