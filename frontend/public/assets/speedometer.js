window.drawSpeedometer = function (canvasId, speed) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let maxSpeed = 5000; // 5 MB/s
    let angle = (speed / maxSpeed) * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // base arc
    ctx.beginPath();
    ctx.arc(100, 100, 80, Math.PI, Math.PI * 2);
    ctx.strokeStyle = "#444";
    ctx.lineWidth = 12;
    ctx.stroke();

    // speed needle
    ctx.beginPath();
    ctx.arc(100, 100, 80, Math.PI, Math.PI + angle);
    ctx.strokeStyle = "#ff007b";
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.fillStyle = "#ff007b";
    ctx.font = "24px Poppins";
    ctx.fillText(speed + " KB/s", 55, 120);
};

