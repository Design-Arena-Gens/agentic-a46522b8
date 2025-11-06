import { z } from "zod";

const moodKeywords = [
  "tense",
  "mysterious",
  "epic",
  "romantic",
  "melancholic",
  "hopeful",
  "dark",
  "chaotic",
  "serene"
] as const;

type MoodKeyword = (typeof moodKeywords)[number];

const timeKeywords = [
  "dawn",
  "sunrise",
  "noon",
  "afternoon",
  "sunset",
  "dusk",
  "night",
  "midnight"
] as const;

type TimeKeyword = (typeof timeKeywords)[number];

const weatherKeywords = [
  "rain",
  "storm",
  "snow",
  "fog",
  "wind",
  "sand",
  "ash"
] as const;

type WeatherKeyword = (typeof weatherKeywords)[number];

const cinematicStyles = [
  "handheld",
  "steadicam",
  "drone",
  "dolly",
  "crane",
  "locked-off"
] as const;

type CinematicStyle = (typeof cinematicStyles)[number];

const requestSchema = z.object({
  details: z.string().min(10, "कृपया अधिक तपशील द्या / please add more detail.")
});

export type VfxPlan = ReturnType<typeof buildPlan>;

interface SceneTraits {
  mood: MoodKeyword | "ambient";
  timeOfDay: TimeKeyword | "magic hour";
  weather: WeatherKeyword | "clear";
  hasCharacters: boolean;
  style: CinematicStyle | "hybrid";
  effects: string[];
  location: string;
}

function detectKeyword<T extends string>(
  list: readonly T[],
  text: string
): T | null {
  const lower = text.toLowerCase();
  for (const item of list) {
    if (lower.includes(item)) {
      return item;
    }
  }
  return null;
}

function extractLocation(text: string): string {
  const match = text.match(
    /(in|at|inside|within)\s+([A-Za-z\s'-]{3,})(?:,|\.)?/i
  );
  if (match?.[2]) {
    return match[2].trim();
  }
  const firstSentence = text.split(/[.?!]/)[0];
  return firstSentence.length > 5 ? firstSentence.trim() : "vast cinematic expanse";
}

function extractEffects(text: string): string[] {
  const known = [
    "fire",
    "smoke",
    "rain",
    "snow",
    "magic",
    "sparks",
    "embers",
    "debris",
    "water",
    "mist",
    "nebula",
    "shockwave",
    "lightning",
    "glow",
    "hologram",
    "particles"
  ];
  const lower = text.toLowerCase();
  const selected = known.filter((kw) => lower.includes(kw));
  if (selected.length === 0) {
    return ["atmospheric dust motes", "volumetric light shafts"];
  }
  return selected;
}

function inferTraits(details: string): SceneTraits {
  const mood = detectKeyword(moodKeywords, details) ?? "ambient";
  const timeOfDay = detectKeyword(timeKeywords, details) ?? "magic hour";
  const weather = detectKeyword(weatherKeywords, details) ?? "clear";
  const style = detectKeyword(cinematicStyles, details) ?? "hybrid";
  const hasCharacters = /character|actor|creature|हिरो|नर्तक|soldier|crowd/i.test(
    details
  );
  const effects = extractEffects(details);
  const location = extractLocation(details);

  return { mood, timeOfDay, weather, style, hasCharacters, effects, location };
}

function buildStageLabel(index: number): string {
  const labels = [
    "Scene Layout / सेट डिझाईन",
    "FX Simulation / पार्टिकल डायनामिक्स",
    "Lighting & Shadows / प्रकाश व्यवस्था",
    "Cameras / सिनेमॅटिक लेन्स",
    "Animation / कॅरेक्टर ब्लॉकिंग",
    "Compositing / कलर सायन्स",
    "Final Output / अंतिम रेंडर"
  ];
  return labels[index] ?? `Stage ${index + 1}`;
}

function buildStageNarrative(traits: SceneTraits, details: string): string[] {
  const effects = traits.effects.join(", ");
  const base = [
    `• Marathi Vision: ${traits.location} मध्ये ${traits.mood} मूडची तयारी, प्रॉप्स आणि स्केल रेफरन्सेस सेट करा.`,
    `• English Technical: Blocking key set-pieces, establishing hero assets, and matching proportions for ${traits.style} coverage.`,
    `• Marathi Vision: ${effects} साठी नोड स्ट्रक्चर डिझाईन करा, लूपेबल सिल्म्युलेशन्स तयार करा.`,
    `• English Technical: Author flipbooks, cache volumes (VDB) and particle emitters tuned for ${traits.timeOfDay} ambience.`,
    `• Marathi Vision: नॅचरल + सिनेमॅटिक की लाईट, ${traits.weather} हवामानाला सपोर्ट करणारी रंग योजना.`,
    `• English Technical: Multi-camera previs beats aligning with client brief: ${details.slice(0, 160)}…`
  ];
  return base;
}

function buildSimulationParams(traits: SceneTraits) {
  return [
    {
      name: "Primary Emitter / मुख्य स्रोत",
      details: [
        `Emission Rate: ${(traits.effects.length * 1800).toFixed(0)} pts/sec`,
        "Initial Velocity: 6.5 m/s (directional, spread cone 38°)",
        `Lifetime: ${traits.weather === "clear" ? "4.2s" : "5.5s"} average with variance 35%`,
        "Temperature Attribute: activated for shading cross-link"
      ]
    },
    {
      name: "Forces / बल नियंत्रण",
      details: [
        "Gravity: -9.65 m/s² (custom tweak for scale realism)",
        `Turbulence: amplitude 0.65, frequency ${
          traits.mood === "chaotic" ? "18.0" : "9.5"
        } Hz, roughness 0.47`,
        `Wind: ${traits.weather === "wind" ? "9.4" : "3.1"} m/s from azimuth 58°, elevation 6°`,
        "Drag: 0.18 with ramp to 0.42 near emitter exit"
      ]
    },
    {
      name: "Secondary FX / दुय्यम प्रभाव",
      details: [
        "Spark pass: POP replicate every 12 frames, random life 16-42 frames",
        "Volumetric fog: density 0.045, scattering albedo 0.82",
        "Debris instancing: 3 shape variations, scale jitter ±22%"
      ]
    }
  ];
}

function buildLightingSetup(traits: SceneTraits) {
  return {
    hdri: `HDRI: ${
      traits.timeOfDay === "night"
        ? "Luminance City Night 4K"
        : traits.timeOfDay === "dawn" || traits.timeOfDay === "sunrise"
          ? "Sunrise Coastal V2 8K"
          : "Overcast Film Lot 8K"
    }`,
    key: `Key Light: 1.2 intensity, ${
      traits.timeOfDay === "night" ? "deep blue" : "warm amber"
    }, angle 35° camera left, softness 0.45`,
    fill: `Fill Light: 0.38 intensity, hue shift +18°, negative fill flags for Marathi sculpted cheeks`,
    rim: `Rim Light: ${
      traits.weather === "fog" ? "volumetric cylinder" : "spot"
    }, intensity 0.65, angle 120° behind subject`,
    practicals:
      "Practicals: emissive cards with ACEScg tint to motivate in-world sources",
    notes:
      "Color Management: ACEScg workflow, using IDT VFX Neutral, ODT Rec.709 + D65 white point."
  };
}

function buildCameraPlan(traits: SceneTraits) {
  return [
    {
      label: "Shot A / Establishing",
      description: `35mm anamorphic, ${traits.style} drift, horizon locked. Keyframe path easing for ${traits.timeOfDay} softness.`,
      settings: [
        "Focal: 28mm, T2.8, subtle barrel distortion",
        "Sensor Height: 24.89mm; Gate: ARRI Open Gate",
        "Shutter: 217°, motion blur sampling 0.5 frame offset"
      ]
    },
    {
      label: "Shot B / Hero Action",
      description: `55mm close-up with parallax sweep highlighting Marathi भावनिक बीट.`,
      settings: [
        "Focal: 55mm, T2.3",
        "Handheld noise layer amplitude 0.03, frequency 2.1 Hz",
        "Depth of Field: focus pull 12m → 6m over 48 frames"
      ]
    }
  ];
}

function buildRenderSettings(traits: SceneTraits) {
  return {
    resolution: "3840 x 2160 (Ultra HD)",
    frameRate: traits.style === "handheld" ? "24 fps + 3:2 pulldown option" : "24 fps true",
    samples: `Path Tracer Samples: ${
      traits.timeOfDay === "night" ? "6,144" : "4,096"
    } per pixel`,
    denoiser: "Intel OIDN with scene-referred albedo/normal passes",
    motionBlur: "Enabled, 0.45 shutter offset",
    cache: "Simulation caches stored as OpenVDB + Alembic, versioned per shot",
    notes:
      "Render on GPU farm (RTX 6000 Ada). Adopt checkpoint renders at 12% increments for Marathi creative approvals."
  };
}

function buildCompositingSetup(traits: SceneTraits) {
  return [
    {
      name: "Plate & CG Integration",
      layers: [
        "RAW Plate / बेस फुटेज",
        "CG Beauty (ACEScg) multiplied 1.0",
        "Utility AOVs: diffuse, specular, emission, sss"
      ],
      blend: "Linear Dodge (Add) सह नियंत्रण, Marathi आर्ट डायरेक्टर सोबत रिफरन्स."
    },
    {
      name: "Atmospherics",
      layers: [
        "Volume Light Pass",
        "FX Particles ID mattes",
        "Z-Depth for fog matte"
      ],
      blend: "Screen + Exponential Fog shader in Nuke."
    },
    {
      name: "Color & Finishing",
      layers: [
        "Primary Grade: ACES LMT for mood",
        "Secondary Grade: Power Windows on faces",
        "Film Grain: 35mm 500T scanned overlay"
      ],
      blend: "Overlay 35%, then LUT burn-in with Rec.709 trim pass."
    }
  ];
}

function buildExportPlan() {
  return {
    format: "EXR (ACEScg, 16-bit half) sequence for master",
    editorial: "ProRes 4444 XQ, 4K, 24fps, audio temp mix placeholders",
    delivery: [
      "Use OCIO configs for automatic conversions.",
      "Embed latest LUTs and camera reports in delivery package.",
      "Generate review MP4 (H.265, 15 Mbps) with burnt-in timecode Marathi + English labeling."
    ]
  };
}

function buildPlan(details: string) {
  const traits = inferTraits(details);
  return {
    sceneSynopsis: `Cinematic brief: ${traits.location} | Mood: ${traits.mood} | Time: ${traits.timeOfDay} | Weather: ${traits.weather}`,
    narrativeBeats: buildStageNarrative(traits, details),
    simulationParams: buildSimulationParams(traits),
    lightingSetup: buildLightingSetup(traits),
    cameraPlan: buildCameraPlan(traits),
    renderSettings: buildRenderSettings(traits),
    compositingSetup: buildCompositingSetup(traits),
    exportPlan: buildExportPlan(),
    traits
  };
}

export function generateVfxPlan(details: string) {
  const parsed = requestSchema.safeParse({ details });
  if (!parsed.success) {
    throw new Error(parsed.error.errors[0]?.message ?? "Invalid request.");
  }
  return buildPlan(details);
}
