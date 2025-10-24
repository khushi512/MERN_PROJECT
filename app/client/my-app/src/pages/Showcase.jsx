import React, { useState } from "react";

function Section({ title, children }) {
  return (
    <div className="card p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function BeforeNavbarPreview() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-xl px-6 py-3 flex items-center justify-between">
      <span
        className="text-transparent bg-clip-text font-extrabold text-xl tracking-wide"
        style={{ backgroundImage: "linear-gradient(to right, #48c6ef, #6f86d6)" }}
      >
        DesignHire
      </span>
      <div className="flex gap-4 text-gray-700">
        <span className="hover:text-blue-600">Home</span>
        <span className="hover:text-blue-600">Explore</span>
        <span className="hover:text-blue-600">Saved</span>
        <span className="hover:text-blue-600">Profile</span>
      </div>
    </div>
  );
}

function AfterNavbarPreview() {
  return (
    <div className="glass rounded-2xl px-6 py-3 flex items-center justify-between">
      <span className="brand-gradient-text font-extrabold text-xl tracking-wide">DesignHire</span>
      <div className="flex gap-4 text-slate-700">
        <span className="hover:text-teal-700">Home</span>
        <span className="hover:text-teal-700">Explore</span>
        <span className="hover:text-teal-700">Saved</span>
        <span className="hover:text-teal-700">Profile</span>
      </div>
    </div>
  );
}

function BeforeHero() {
  return (
    <div className="min-h-56 rounded-2xl flex flex-col items-center justify-center text-center px-6 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600">
      <h2 className="text-white text-3xl sm:text-4xl font-extrabold mb-2">Welcome to DesignHire</h2>
      <p className="text-white/95 max-w-xl">Connect with top creative talent and discover stunning interior design projects.</p>
      <div className="mt-5 flex gap-3">
        <button className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-lg shadow hover:bg-gray-100 transition">Get Started</button>
        <button className="text-white font-semibold px-5 py-2.5 rounded-lg border border-white hover:bg-white hover:text-blue-600 transition">Sign In</button>
      </div>
    </div>
  );
}

function AfterHero() {
  return (
    <div className="min-h-56 rounded-2xl flex flex-col items-center justify-center text-center px-6 brand-gradient-bg">
      <h2 className="text-white text-3xl sm:text-4xl font-extrabold mb-2 drop-shadow">Welcome to DesignHire</h2>
      <p className="text-white/95 max-w-xl">Connect with top creative talent and discover stunning interior design projects.</p>
      <div className="mt-5 flex gap-3">
        <button className="btn-primary">Get Started</button>
        <button className="btn-outline border-white/70 text-white hover:bg-white hover:text-teal-700">Sign In</button>
      </div>
    </div>
  );
}

function BeforeButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="bg-blue-700 hover:bg-blue-800 text-white py-2.5 px-5 rounded-lg">Primary</button>
      <button className="border border-blue-700 text-blue-700 hover:bg-blue-50 py-2.5 px-5 rounded-lg">Outline</button>
      <button className="bg-gray-200 hover:bg-gray-300 py-2.5 px-5 rounded-lg">Ghost</button>
    </div>
  );
}

function AfterButtons() {
  return (
    <div className="flex flex-wrap gap-3">
      <button className="btn-primary">Primary</button>
      <button className="btn-outline">Outline</button>
      <button className="btn-ghost">Ghost</button>
    </div>
  );
}

function BeforeCard() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h4 className="text-lg font-semibold text-gray-900 mb-1">Card Title</h4>
      <p className="text-gray-600 mb-3">This is a basic card with neutral styles.</p>
      <div className="flex gap-2">
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">AutoCAD</span>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">3D</span>
      </div>
    </div>
  );
}

function AfterCard() {
  return (
    <div className="card p-6">
      <h4 className="text-lg font-semibold text-slate-900 mb-1">Card Title</h4>
      <p className="text-slate-600 mb-3">This is a themed card with brand tokens.</p>
      <div className="flex gap-2">
        <span className="badge">AutoCAD</span>
        <span className="badge">3D</span>
      </div>
    </div>
  );
}

function BeforeForm() {
  return (
    <form className="bg-white rounded-xl shadow p-6 flex flex-col gap-3">
      <input placeholder="Username" className="h-[44px] px-3 rounded-md border border-neutral-300" />
      <input placeholder="Password" type="password" className="h-[44px] px-3 rounded-md border border-neutral-300" />
      <button className="h-[44px] bg-[#0095F6] text-white rounded-lg font-semibold hover:bg-[#0086dd] transition">Sign in</button>
    </form>
  );
}

function AfterForm() {
  return (
    <form className="card p-6 flex flex-col gap-3">
      <input placeholder="Username" className="h-[44px] px-3 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none" />
      <input placeholder="Password" type="password" className="h-[44px] px-3 rounded-md border border-gray-300 focus:border-teal-400 focus:ring-1 focus:ring-teal-400 outline-none" />
      <button className="h-[44px] btn-primary">Sign in</button>
    </form>
  );
}

export default function Showcase() {
  const [mode, setMode] = useState("split"); // 'before' | 'after' | 'split'

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-teal-50 pt-20 pb-16">
      <div className="section">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Design Uplift Showcase</h1>
            <p className="text-slate-600">Compare the previous look with the new bluish-green theme.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setMode("before")} className={`btn-ghost ${mode === "before" ? "bg-slate-100" : ""}`}>Before</button>
            <button onClick={() => setMode("after")} className={`btn-ghost ${mode === "after" ? "bg-slate-100" : ""}`}>After</button>
            <button onClick={() => setMode("split")} className={`btn-primary ${mode === "split" ? "opacity-100" : "opacity-95"}`}>Split</button>
          </div>
        </div>

        {mode === "split" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Section title="Navbar (Before)"><BeforeNavbarPreview /></Section>
            <Section title="Navbar (After)"><AfterNavbarPreview /></Section>

            <Section title="Hero (Before)"><BeforeHero /></Section>
            <Section title="Hero (After)"><AfterHero /></Section>

            <Section title="Buttons (Before)"><BeforeButtons /></Section>
            <Section title="Buttons (After)"><AfterButtons /></Section>

            <Section title="Card (Before)"><BeforeCard /></Section>
            <Section title="Card (After)"><AfterCard /></Section>

            <Section title="Form (Before)"><BeforeForm /></Section>
            <Section title="Form (After)"><AfterForm /></Section>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <Section title={`Navbar (${mode})`}>
              {mode === "before" ? <BeforeNavbarPreview /> : <AfterNavbarPreview />}
            </Section>
            <Section title={`Hero (${mode})`}>
              {mode === "before" ? <BeforeHero /> : <AfterHero />}
            </Section>
            <Section title={`Buttons (${mode})`}>
              {mode === "before" ? <BeforeButtons /> : <AfterButtons />}
            </Section>
            <Section title={`Card (${mode})`}>
              {mode === "before" ? <BeforeCard /> : <AfterCard />}
            </Section>
            <Section title={`Form (${mode})`}>
              {mode === "before" ? <BeforeForm /> : <AfterForm />}
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}
