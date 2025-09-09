"use client";
import { useEffect, useMemo, useRef, useState } from "react";

// ===== EDIT THIS URL =====
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwm-ORJDMhGvxqPqLFYUpdO7nIf3gz0kdcJrbB-f739as8ZCuDKAFNK49dhFdtmVaA/exec";
// =========================

const BRAND = "Suncoast Home Lists";
const CITY = "South Florida";
const PRICE_POINT = 50000000;

export default function LandingPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [maxPrice, setMaxPrice] = useState(PRICE_POINT);
  const [zip, setZip] = useState("");

  // Track if we actually submitted (to ignore iframe's initial about:blank load)
  const submittedRef = useRef(false);

  // Optional UTM capture
  const utms = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const keys = [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_content",
      "utm_term",
      "gclid",
      "fbclid",
    ];
    const out = {};
    keys.forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  }, []);

  // Optional: prefill zip with ?zip=33431
  useEffect(() => {
    const z =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("zip")
        : null;
    if (z) setZip(z);
  }, []);

  function onSubmitForm() {
    submittedRef.current = true; // form is posting into the iframe
    setSubmitting(true);
  }

  function onIframeLoad() {
    if (!submittedRef.current) return; // ignore first blank load
    setSent(true);
    setSubmitting(false);
    submittedRef.current = false;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#0b1220", color: "#e2e8f0" }}>
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "72px 20px" }}>
        <header
          style={{
            marginBottom: 28,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              height: 40,
              width: 40,
              borderRadius: 14,
              background: "#22c55e",
              color: "#0b1220",
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
            }}
          >
            SL
          </div>
          <div>
            <div style={{ fontWeight: 800 }}>{BRAND}</div>
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Curated {CITY} home lists
            </div>
          </div>
        </header>

        <h1
            style={{
              fontSize: "clamp(28px, 6vw, 44px)",
              lineHeight: 1.1,
              fontWeight: 900,
            }}
          >
            Daily list of {CITY} homes under ${PRICE_POINT.toLocaleString()}
        </h1>
        <p style={{ marginTop: 10, color: "#94a3b8", maxWidth: 720 }}>
          Tell us your budget and must-haves. We’ll send tailored homes by email
          and text you fast if something hot hits the market.
        </p>

        {!sent ? (
          <form
            action={APPS_SCRIPT_WEB_APP_URL || undefined}
            method="POST"
            target={APPS_SCRIPT_WEB_APP_URL ? "hidden_iframe" : undefined}
            onSubmit={onSubmitForm}
            style={{
              marginTop: 20,
              display: "grid",
              gap: 12,
              maxWidth: 700,
              background: "#111827",
              border: "1px solid #1f2937",
              borderRadius: 14,
              padding: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              <Input label="First name" name="first_name" required />
              <Input label="Last name" name="last_name" required />
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              <Input label="Email" type="email" name="email" required />
              <Input label="Mobile" type="tel" name="phone" required />
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              <Input
                label="Target ZIP or area"
                name="zip"
                value={zip}
                onChange={(v) => setZip(v)}
              />
              <div>
                <Label>Max price: ${maxPrice.toLocaleString()}</Label>
                <input
                  type="range"
                  name="max_price"
                  min={150000}
                  max={50000000}
                  step={5000}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>
              <div>
                <Label>Move-in time</Label>
                <select name="timeline" style={inputStyle}>
                  <option value="0-3">0–3 months</option>
                  <option value="3-6">3–6 months</option>
                  <option value="6-12">6–12 months</option>
                  <option value=">12">12+ months</option>
                </select>
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
                gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              }}
            >
              <div>
                <Label>Financing</Label>
                <select name="financing" style={inputStyle}>
                  <option value="preapproved">Pre-approved</option>
                  <option value="cash">Cash</option>
                  <option value="need-lender">Need lender intro</option>
                </select>
              </div>
              <Input
                label="Top 3 must-haves"
                name="must_haves"
                placeholder="Garage, fenced yard, updated kitchen"
              />
            </div>

            {/* Hidden UTM fields (optional) */}
            {Object.entries(utms).map(([k, v]) => (
              <input key={k} type="hidden" name={k} value={v || ""} />
            ))}

            <button
              type="submit"
              disabled={submitting}
              style={{
                background: "#22c55e",
                color: "#0b1220",
                fontWeight: 800,
                padding: 12,
                borderRadius: 12,
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? "Sending…" : "Send My List"}
            </button>

            {/* Hidden iframe prevents navigation to JSON and signals success when loaded */}
            {APPS_SCRIPT_WEB_APP_URL && (
              <iframe
                name="hidden_iframe"
                onLoad={onIframeLoad}
                style={{ display: "none" }}
              />
            )}
          </form>
        ) : (
          <div
            style={{
              marginTop: 20,
              padding: 18,
              border: "1px solid #1f2937",
              background: "#111827",
              borderRadius: 14,
              maxWidth: 640,
            }}
          >
            <div
              style={{
                display: "inline-grid",
                placeItems: "center",
                height: 48,
                width: 48,
                borderRadius: 999,
                background: "#22c55e",
                color: "#0b1220",
                fontWeight: 900,
              }}
            >
              ✓
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, marginTop: 8 }}>
              Request received!
            </h3>
            <p style={{ color: "#a3b2c7", marginTop: 6 }}>
              We’ll email your {CITY} list and text you ASAP if something urgent
              fits your criteria.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function Input({ label, type = "text", name, required, value, onChange, placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={value}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}

function Label({ children }) {
  return <div style={{ color: "#cbd5e1", fontSize: 12, marginBottom: 4 }}>{children}</div>;
}

const inputStyle = {
  padding: "10px 12px",
  background: "#0f172a",
  border: "1px solid #1f2937",
  borderRadius: 10,
  color: "#e2e8f0",
  outline: "none",
};
