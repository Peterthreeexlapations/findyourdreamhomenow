import os, json, zipfile, textwrap

base = "/mnt/data/homebuyer-iframe"
app_dir = os.path.join(base, "app")
os.makedirs(app_dir, exist_ok=True)

# package.json
package_json = {
  "name": "homebuyer-landing-iframe",
  "private": True,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.5",
    "react": "18.2.0",
    "react-dom": "18.2.0"
  }
}
with open(os.path.join(base, "package.json"), "w") as f:
    json.dump(package_json, f, indent=2)

# next.config.js
with open(os.path.join(base, "next.config.js"), "w") as f:
    f.write("/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nmodule.exports = nextConfig;\n")

# .gitignore
with open(os.path.join(base, ".gitignore"), "w") as f:
    f.write("node_modules/\n.next/\nout/\n.DS_Store\n.env*\n")

# README
with open(os.path.join(base, "README.md"), "w") as f:
    f.write(textwrap.dedent("""\
    # Homebuyer Landing — Hidden Iframe Submit (CORS-proof)
    
    Deploy:
    1) Push to GitHub.
    2) Import to Vercel.
    3) In `app/page.jsx`, set `APPS_SCRIPT_WEB_APP_URL` to your Google Apps Script Web App URL
       (Web app deployment URL ending with /exec).
    """))

# app/globals.css
with open(os.path.join(app_dir, "globals.css"), "w") as f:
    f.write(textwrap.dedent("""\
    .container { max-width: 1100px; margin: 0 auto; padding: 0 16px; }
    .grid-hero { display: grid; grid-template-columns: 1.2fr 1fr; gap: 24px; }
    @media (max-width: 820px) { .grid-hero { grid-template-columns: 1fr; } }
    button, input, select { font-size: 16px; min-height: 44px; }
    .h1-fluid { font-size: clamp(28px, 6vw, 44px); line-height: 1.1; font-weight: 900; }
    .picks-grid { display: grid; gap: 16px; grid-template-columns: repeat(4, 1fr); }
    @media (max-width: 1024px) { .picks-grid { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 600px)  { .picks-grid { grid-template-columns: 1fr; } }
    """))

# app/layout.jsx
with open(os.path.join(app_dir, "layout.jsx"), "w") as f:
    f.write(textwrap.dedent("""\
    import "./globals.css";

    export const metadata = {
      title: "Suncoast Home Lists",
      description: "Curated South Florida home lists with fast alerts.",
    };

    export default function RootLayout({ children }) {
      return (
        <html lang="en">
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          </head>
          <body
            style={{
              fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial",
              paddingTop: "env(safe-area-inset-top)",
              paddingRight: "env(safe-area-inset-right)",
              paddingBottom: "env(safe-area-inset-bottom)",
              paddingLeft: "env(safe-area-inset-left)",
              background: "#0b1220",
              color: "#e2e8f0",
            }}
          >
            {children}
          </body>
        </html>
      );
    }
    """))

# app/page.jsx with hidden iframe submission
page_code = """\
\"use client\";
import { useEffect, useMemo, useState } from "react";

// ===== EDIT THIS URL =====
const APPS_SCRIPT_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwu5r7H29c_f69z-cfKZmWqYaTAsKv_MrQYdlTx_jAHu36emTfM4dgjOzgBh-n4KnM/exec"; // paste your Web App URL ending with /exec
// =========================

const BRAND = "Suncoast Home Lists";
const CITY = "South Florida";
const PRICE_POINT = 750000;

export default function LandingPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [maxPrice, setMaxPrice] = useState(PRICE_POINT);
  const [zip, setZip] = useState("");

  // UTM capture (optional)
  const utms = useMemo(() => {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    const keys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","gclid","fbclid"];
    const out = {};
    keys.forEach(k=>{ const v = params.get(k); if (v) out[k]=v; });
    return out;
  }, []);

  useEffect(() => {
    const z = typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("zip")
      : null;
    if (z) setZip(z);
  }, []);

  function handleIframeSubmit() {
    // Don't prevent default: the browser will POST the form into the hidden iframe.
    setSubmitting(true);
    setTimeout(() => {
      setSent(true);      // show thank-you UI after a short beat
      setSubmitting(false);
    }, 900);
  }

  return (
    <div>
      {/* Hero */}
      <section style={{ position: "relative", overflow: "hidden", background: "#0b1220" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(1200px 600px at 10% -20%, #1e293b 20%, transparent), radial-gradient(1200px 600px at 110% 120%, #1e293b 20%, transparent)" }} />
        <div className="container" style={{ padding: "72px 20px", position: "relative" }}>
          <header style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
            <div style={{ height: 40, width: 40, borderRadius: 14, background: "#22c55e", color: "#0b1220", display: "grid", placeItems: "center", fontWeight: 800 }}>SL</div>
            <div>
              <div style={{ fontWeight: 800 }}>{BRAND}</div>
              <div style={{ fontSize: 12, color: "#94a3b8" }}>Curated {CITY} home lists</div>
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
            </div>

            <div>
              {!sent ? (
                <LeadForm
                  actionUrl={APPS_SCRIPT_WEB_APP_URL}
                  submitting={submitting}
                  onSubmit={handleIframeSubmit}
                  zip={zip}
                  setZip={setZip}
                  maxPrice={maxPrice}
                  setMaxPrice={setMaxPrice}
                  utms={utms}
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

function LeadForm({ actionUrl, submitting, onSubmit, zip, setZip, maxPrice, setMaxPrice, utms }) {
  return (
    <form
      id="lead"
      action={actionUrl || undefined}
      method="POST"
      target={actionUrl ? "hidden_iframe" : undefined}
      onSubmit={onSubmit}
      style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 18, padding: 18 }}
    >
      <div style={{ fontWeight: 800, fontSize: 18 }}>Get your custom {CITY} list</div>
      <div style={{ color: "#a3b2c7", fontSize: 13, marginTop: 6 }}>We’ll email matching homes and text fast if something urgent comes up.</div>

      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="First name" name="first_name" required />
          <Input label="Last name" name="last_name" required />
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="Email" type="email" name="email" required />
          <Input label="Mobile" type="tel" name="phone" required />
        </div>
        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <Input label="Target ZIP or area" name="zip" value={zip} onChange={v=>setZip(v)} />
          <div>
            <Label>Max price: ${maxPrice.toLocaleString()}</Label>
            <input type="range" name="max_price" min={150000} max={1500000} step={5000} value={maxPrice} onChange={e=>setMaxPrice(parseInt(e.target.value))} style={{ width: "100%" }} />
          </div>
          <div>
            <Label>Move‑in time</Label>
            <select name="timeline" style={inputStyle}>
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
            <select name="financing" style={inputStyle}>
              <option value="preapproved">Pre‑approved</option>
              <option value="cash">Cash</option>
              <option value="need-lender">Need lender intro</option>
            </select>
          </div>
          <Input label="Top 3 must‑haves" name="must_haves" placeholder="Garage, fenced yard, updated kitchen" />
        </div>

        {/* Hidden UTM fields */}
        {Object.entries(utms).map(([k,v]) => (
          <input key={k} type="hidden" name={k} value={v || ""} />
        ))}

        <button type="submit" disabled={submitting} style={{ background: "#22c55e", color: "#0b1220", fontWeight: 800, padding: "12px", borderRadius: 12, opacity: submitting?0.7:1 }}>
          {submitting ? "Sending…" : "Send My List"}
        </button>
      </div>

      {/* Prevent navigation to JSON response */}
      {actionUrl && <iframe name="hidden_iframe" style={{ display: "none" }} />}
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

function Input({ label, type="text", name, required, value, onChange, placeholder }){
  return (
    <div>
      <Label>{label}</Label>
      <input
        type={type}
        name={name}
        required={required}
        defaultValue={value}
        onChange={onChange ? (e)=>onChange(e.target.value) : undefined}
        placeholder={placeholder}
        style={inputStyle}
      />
    </div>
  );
}
function Label({ children }){ return <div style={{ color: "#cbd5e1", fontSize: 12, marginBottom: 4 }}>{children}</div>; }
const inputStyle = { padding: "10px 12px", background: "#0f172a", border: "1px solid #1f2937", borderRadius: 10, color: "#e2e8f0", outline: "none" };
"""
with open(os.path.join(app_dir, "page.jsx"), "w") as f:
    f.write(page_code)

# Zip it
zip_path = "/mnt/data/homebuyer-iframe.zip"
with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for root, dirs, files in os.walk(base):
        for file in files:
            abs_path = os.path.join(root, file)
            rel_path = os.path.relpath(abs_path, base)
            z.write(abs_path, arcname=os.path.join("homebuyer-landing", rel_path))

zip_path
