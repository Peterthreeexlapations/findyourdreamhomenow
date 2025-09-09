"use client";
import { useEffect, useMemo, useState } from "react";

// ===== EDIT THESE =====
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby1jFyAjBuD4s_Oji3545eapChDUoqnh8xTAlkIIb6JYTfdC_n5zpo28Qbu6s76hIA/exec"; // paste your Web App URL when ready
const BRAND = "Suncoast Home Lists";
const CITY = "South Florida";
const PRICE_POINT = 50000000;
const PHONE = "(954) 770-2500";
// ======================

export default function LandingPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [maxPrice, setMaxPrice] = useState(PRICE_POINT);
  const [zip, setZip] = useState("");
  const [form, setForm] = useState({
    first_name: "", last_name: "", email: "", phone: "",
    timeline: "0-3", financing: "preapproved", must_haves: ""
  });

  // Capture UTMs (for your own attribution)
  const utms = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
    const out = {};
    keys.forEach(k=>{const v=params.get(k); if(v) out[k]=v;});
    return out;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const z = new URLSearchParams(window.location.search).get("zip");
      if (z) setZip(z);
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = { ...form, zip, max_price: maxPrice, ...utms };
      if (APPS_SCRIPT_WEB_APP_URL) {
        await fetch(APPS_SCRIPT_WEB_APP_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        await new Promise(r => setTimeout(r, 600)); // demo mode
      }
      setSent(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#0b1220" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1200px 600px at 10% -20%, #1e293b 20%, transparent), radial-gradient(1200px 600px at 110% 120%, #1e293b 20%, transparent)" }} />
        <div className="container" style={{ padding: "72px 20px", position: "relative" }}>
          <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ height: 40, width: 40, borderRadius: 14, background: "#22c55e", color: "#0b1220", display: "grid", placeItems: "center", fontWeight: 800 }}>SL</div>
              <div>
                <div style={{ fontWeight: 700, letterSpacing: 0.2 }}>{BRAND}</div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>Curated {CITY} home lists</div>
              </div>
            </div>
          </header>

          <div className="grid-hero">
            <div>
              <div style={{ display: "inline-flex", padding: "6px 10px", border: "1px solid #334155", color: "#cbd5e1", borderRadius: 999, fontSize: 12 }}>
                Price drops • New construction • Motivated sellers
              </div>
              <h1 className="h1-fluid" style={{ marginTop: 14 }}>
                Daily list of {CITY} homes under ${PRICE_POINT.toLocaleString()}
              </h1>
              <p style={{ marginTop: 12, color: "#94a3b8", fontSize: 16 }}>
                Tell us your budget and must‑haves. We’ll send tailored homes by email and text you fast if something hot hits the market.
              </p>
              <ul style={{ marginTop: 14, color: "#cbd5e1", fontSize: 14, paddingLeft: 16 }}>
                <li>• Only real, available listings — updated daily</li>
                <li>• Tour-ready options and builder incentives</li>
                <li>• No spam. Opt out any time.</li>
              </ul>
            </div>

            <div>
              {!sent ? (
                <FormCard
                  onSubmit={handleSubmit}
                  submitting={submitting}
                  form={form}
                  setForm={setForm}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  zip={zip}
                  setZip={setZip}
                />
              ) : (
                <ThanksCard />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Popular picks */}
      <section style={{ background: "#0b1220" }}>
        <div className="container" style={{ padding: "40px 20px" }}>
          <h3 style={{ fontSize: 22, fontWeight: 800 }}>Popular picks</h3>
          <div className="picks-grid" style={{ marginTop: 12 }}>
            {[
              {t:`New construction under $${PRICE_POINT.toLocaleString()}`, d:"Credits + incentives"},
              {t:"Homes with seller credits", d:"Great for rate buydowns"},
              {t:`${CITY} townhomes with garages`, d:"HOA under $350/mo"},
              {t:"FHA‑friendly condos", d:"Starter‑friendly"}
            ].map((c,i)=>(
              <div key={i} style={{ border: "1px solid #1f2937", background: "linear-gradient(180deg,#0f172a,#0b1220)", padding: 16, borderRadius: 16 }}>
                <div style={{ color: "#94a3b8", fontSize: 12 }}>Curated list</div>
                <div style={{ fontWeight: 700, marginTop: 4 }}>{c.t}</div>
                <div style={{ color: "#a3b2c7", marginTop: 6 }}>{c.d}</div>
                <a href="#lead" style={{ marginTop: 8, display: "inline-block", textDecoration: "underline" }}>Get this list →</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1f2a44", color: "#94a3b8" }}>
        <div className="container" style={{ padding: "24px 20px", display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between" }}>
          <div>© {new Date().getFullYear()} {BRAND}. All rights reserved.</div>
          <div style={{ fontSize: 13 }}>You’ll receive home lists by email and timely texts if something urgent hits the market.</div>
        </div>
      </footer>
    </div>
  );
}

function FormCard({ onSubmit, submitting, form, setForm, maxPrice, setMaxPrice, zip, setZip }) {
  return (
    <form id="lead" onSubmit={onSubmit} style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 18, padding: 18 }}>
      <div style={{ fontWeight: 800, fontSize: 18 }}>Get your custom {CITY} list</div>
      <div style={{ color: "#a3b2c7", fontSize: 13, marginTop: 4 }}>We’ll email matching homes and text fast if something urgent comes up.</div>
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="First name" name="first_name" value={form.first_name} onChange={v=>setForm(s=>({...s, first_name:v}))} autoComplete="given-name" autoCapitalize="words" enterKeyHint="next" required />
          <Input label="Last name" name="last_name" value={form.last_name} onChange={v=>setForm(s=>({...s, last_name:v}))} autoComplete="family-name" autoCapitalize="words" enterKeyHint="next" required />
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="Email" type="email" name="email" value={form.email} onChange={v=>setForm(s=>({...s, email:v}))} autoComplete="email" inputMode="email" enterKeyHint="next" required />
          <Input label="Mobile" type="tel" name="phone" value={form.phone} onChange={v=>setForm(s=>({...s, phone:v}))} autoComplete="tel" inputMode="tel" enterKeyHint="next" required />
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="Target ZIP or area" name="zip" value={zip} onChange={v=>setZip(v)} autoComplete="postal-code" inputMode="numeric" enterKeyHint="next" />
          <div>
            <Label>Max price: ${maxPrice.toLocaleString()}</Label>
            <input type="range" min={150000} max={50000000} step={5000} value={maxPrice} onChange={e=>setMaxPrice(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <Label>Move‑in time</Label>
            <select value={form.timeline} onChange={e=>setForm(s=>({...s, timeline:e.target.value}))} name="timeline" style={inputStyle}>
              <option value="0-3">0–3 months</option>
              <option value="3-6">3–6 months</option>
              <option value="6-12">6–12 months</option>
              <option value=">12">12+ months</option>
            </select>
          </div>
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <div>
            <Label>Financing</Label>
            <select value={form.financing} onChange={e=>setForm(s=>({...s, financing:e.target.value}))} name="financing" style={inputStyle}>
              <option value="preapproved">Pre‑approved</option>
              <option value="cash">Cash</option>
              <option value="need-lender">Need lender intro</option>
            </select>
          </div>
          <Input label="Top 3 must‑haves" name="must_haves" value={form.must_haves} onChange={v=>setForm(s=>({...s, must_haves:v}))} placeholder="Garage, fenced yard, updated kitchen" />
        </div>
        <button type="submit" disabled={submitting} style={{ background: "#22c55e", color: "#0b1220", fontWeight: 800, padding: "12px", borderRadius: 12, opacity: submitting?0.7:1 }}>
          {submitting?"Sending…":"Send My List"}
        </button>
      </div>
    </form>
  );
}

function ThanksCard(){
  return (
    <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 18, padding: 18, textAlign: "center" }}>
      <div style={{ display: "inline-grid", placeItems: "center", height: 56, width: 56, borderRadius: 999, background: "#22c55e", color: "#0b1220", fontSize: 28, fontWeight: 900 }}>✓</div>
      <div style={{ fontSize: 20, fontWeight: 800, marginTop: 10 }}>Request received!</div>
      <div style={{ color: "#a3b2c7", marginTop: 6 }}>We’ll email your list and text you ASAP if something urgent fits your criteria.</div>
    </div>
  );
}

function Input({ label, type="text", value, onChange, name, placeholder, required, autoComplete, autoCapitalize, inputMode, enterKeyHint }){
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={e=>onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        autoCapitalize={autoCapitalize}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        style={inputStyle}
      />
    </div>
  );
}

function Label({ children }){
  return <div style={{ color: "#cbd5e1", fontSize: 12, marginBottom: 4 }}>{children}</div>;
}

const inputStyle = { padding: "10px 12px", background: "#0f172a", border: "1px solid #1f2937", borderRadius: 10, color: "#e2e8f0", outline: "none" };
