"use client";

import { FormEvent, useState } from "react";
import { generateVfxPlan, type VfxPlan } from "@/lib/generator";
import { StageCard } from "@/components/StageCard";

const samplePrompt =
  "A rain-soaked cyberpunk alley in Mumbai at midnight, neon signs flickering, stealthy heroine weaving through smoke while drones scan the streets.";

const stageTitles = [
  "Scene Layout / सेट डिझाईन",
  "Simulation Specs / पार्टिकल नियंत्रण",
  "Lighting / प्रकाश व्यवस्था",
  "Camera Craft / कॅमेरा रचना",
  "Render Engine / रेंडर सेटअप",
  "Compositing / कलर ग्रेड",
  "Delivery / एक्स्पोर्ट निर्देश"
];

export default function HomePage() {
  const [input, setInput] = useState(samplePrompt);
  const [plan, setPlan] = useState<VfxPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsGenerating(true);
    setError(null);
    try {
      const nextPlan = generateVfxPlan(input);
      setPlan(nextPlan);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unexpected error. पुन्हा प्रयत्न करा."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12">
      <header className="space-y-5">
        <p className="text-sm uppercase tracking-[0.35em] text-slate-400">
          VFX Director Console
        </p>
        <h1 className="font-display text-5xl md:text-6xl">
          <span className="aurora-text">
            Cinematic Marathi x English VFX Blueprint
          </span>
        </h1>
        <p className="max-w-3xl text-base text-slate-300">
          Marathi poetic cues + English technical sharpness. Input तुमचे सिनेमॅटिक
          ब्रिफ आणि मिळवा production-ready breakdown across pipeline stages —
          ready for Houdini, Unreal, Nuke, आणि Vercel visualization.
        </p>
      </header>

      <form
        className="grid gap-4 rounded-3xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur"
        onSubmit={handleSubmit}
      >
        <label className="space-y-3">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-400">
            Scene Input / दृश्य तपशील
          </span>
          <textarea
            className="min-h-[160px] w-full rounded-2xl border border-slate-700 bg-slate-950/60 p-4 text-sm leading-relaxed text-slate-100 outline-none transition focus:border-aurora"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Describe the scene here in detail — location, mood, characters, effects, time of day, camera style…"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            type="submit"
            className="rounded-full bg-aurora px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-950 transition hover:opacity-90"
            disabled={isGenerating}
          >
            {isGenerating ? "Generating…" : "Generate Blueprint"}
          </button>
          <button
            type="button"
            className="text-xs uppercase tracking-[0.3em] text-slate-400 underline-offset-4 hover:text-aurora hover:underline"
            onClick={() => setInput(samplePrompt)}
          >
            Load Sample Vision
          </button>
        </div>
        {error ? (
          <p className="rounded-xl border border-red-500/60 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        ) : null}
      </form>

      {plan ? (
        <section className="grid gap-6 pb-16">
          <StageCard title={stageTitles[0]} accent="aurora">
            <p className="text-slate-100">{plan.sceneSynopsis}</p>
            <ul className="space-y-2">
              {plan.narrativeBeats.map((beat, index) => (
                <li key={index} className="text-sm leading-relaxed">
                  {beat}
                </li>
              ))}
            </ul>
          </StageCard>

          <StageCard title={stageTitles[1]} accent="ember">
            <div className="grid gap-4 md:grid-cols-3">
              {plan.simulationParams.map((block) => (
                <article
                  key={block.name}
                  className="rounded-2xl border border-ember/40 bg-slate-950/40 p-4"
                >
                  <h3 className="font-semibold text-amber-300">{block.name}</h3>
                  <ul className="mt-2 space-y-2 text-xs text-slate-200">
                    {block.details.map((detail) => (
                      <li key={detail}>{detail}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </StageCard>

          <StageCard title={stageTitles[2]}>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>{plan.lightingSetup.hdri}</li>
              <li>{plan.lightingSetup.key}</li>
              <li>{plan.lightingSetup.fill}</li>
              <li>{plan.lightingSetup.rim}</li>
              <li>{plan.lightingSetup.practicals}</li>
              <li>{plan.lightingSetup.notes}</li>
            </ul>
          </StageCard>

          <StageCard title={stageTitles[3]}>
            <div className="grid gap-4 md:grid-cols-2">
              {plan.cameraPlan.map((shot) => (
                <article
                  key={shot.label}
                  className="rounded-2xl border border-slate-700/80 bg-slate-950/40 p-4"
                >
                  <h3 className="font-semibold text-aurora">{shot.label}</h3>
                  <p className="mt-2 text-sm text-slate-200">
                    {shot.description}
                  </p>
                  <ul className="mt-3 space-y-2 text-xs text-slate-300">
                    {shot.settings.map((setting) => (
                      <li key={setting}>{setting}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </StageCard>

          <StageCard title={stageTitles[4]}>
            <ul className="space-y-2 text-sm text-slate-200">
              <li>{plan.renderSettings.resolution}</li>
              <li>{plan.renderSettings.frameRate}</li>
              <li>{plan.renderSettings.samples}</li>
              <li>{plan.renderSettings.denoiser}</li>
              <li>{plan.renderSettings.motionBlur}</li>
              <li>{plan.renderSettings.cache}</li>
              <li>{plan.renderSettings.notes}</li>
            </ul>
          </StageCard>

          <StageCard title={stageTitles[5]}>
            <div className="grid gap-4 md:grid-cols-3">
              {plan.compositingSetup.map((pass) => (
                <article
                  key={pass.name}
                  className="rounded-2xl border border-slate-700 bg-slate-950/30 p-4"
                >
                  <h3 className="font-semibold text-slate-100">{pass.name}</h3>
                  <ul className="mt-2 space-y-2 text-xs text-slate-300">
                    {pass.layers.map((layer) => (
                      <li key={layer}>{layer}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-amber-200">{pass.blend}</p>
                </article>
              ))}
            </div>
          </StageCard>

          <StageCard title={stageTitles[6]}>
            <p className="text-sm text-slate-200">
              Master Export: {plan.exportPlan.format}
            </p>
            <p className="text-sm text-slate-200">
              Editorial Delivery: {plan.exportPlan.editorial}
            </p>
            <ul className="space-y-2 text-xs text-slate-300">
              {plan.exportPlan.delivery.map((tip) => (
                <li key={tip}>• {tip}</li>
              ))}
            </ul>
          </StageCard>
        </section>
      ) : (
        <p className="pb-16 text-sm text-slate-400">
          दृश्य वर्णन लिहा आणि “Generate Blueprint” क्लिक करा. प्रत्येक आउटपुटमध्ये
          Marathi इमोशनल डायरेक्शन + English technical नोंदी मिळतील.
        </p>
      )}
    </main>
  );
}
