window.drawGauge = function (canvasId, value, label) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const angle = (value / 100) * Math.PI;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(100, 100, 80, Math.PI, Math.PI * 2);
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(100, 100, 80, Math.PI, Math.PI + angle);
    ctx.strokeStyle = "#00eaff";
    ctx.lineWidth = 15;
    ctx.stroke();

    ctx.fillStyle = "#00eaff";
    ctx.font = "24px Poppins";
    ctx.fillText(value + "%", 70, 120);

    ctx.font = "16px Poppins";
    ctx.fillText(label, 70, 150);
};

