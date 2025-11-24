export default function DigitalMeter({ label, value }) {
    return (
        <div style={{ fontSize: "24px", textAlign: "center" }}>
            <strong style={{ color: "#00eaff" }}>{label}: </strong>
            <span>{value}</span>
        </div>
    );
}

