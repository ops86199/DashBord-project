package com.system.monitor.controller;

import com.system.monitor.service.MetricsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Exposes metrics endpoints.
 * Main endpoint: /metrics/summary
 */
@RestController
public class MetricsController {

    private final MetricsService metricsService;

    public MetricsController() {
        // simple direct instantiation (no Spring @Service wiring) to keep setup minimal
        this.metricsService = new MetricsService();
    }

    /**
     * Returns recent CPU / memory / network snapshot as JSON.
     * Frontend should poll this endpoint every ~1 second to get speeds.
     */
    @GetMapping("/metrics/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        Map<String, Object> m = metricsService.fetchSummary();
        return ResponseEntity.ok(m);
    }
}

