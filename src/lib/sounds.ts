import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";
import bgTrain from "@/assets/bg-train.jpg";
import bgWoods from "@/assets/bg-woods.jpg";
import bgThunder from "@/assets/bg-thunder.jpg";
import bgSurf from "@/assets/bg-surf.jpg";
import bgDojo from "@/assets/bg-dojo.jpg";
import bgWhiteNoise from "@/assets/bg-whitenoise.jpg";
import bgPinkNoise from "@/assets/bg-pinknoise.jpg";
import bgBrownNoise from "@/assets/bg-brownnoise.jpg";

import pinkNoiseWav from "@/assets/pinknoise.wav";
import brownNoiseWav from "@/assets/brownnoise.wav";
import hz432Wav from "@/assets/432hz.wav";
import hz528Wav from "@/assets/528hz.wav";

export interface SoundDef {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  bg: string;
  src: string;
  accent: string;
  section: string;
}

const mix = (id: number) => `https://assets.mixkit.co/active_storage/sfx/${id}/${id}-preview.mp3`;

export const SOUNDS: SoundDef[] = [
  // ───────── Nature ─────────
  {
    id: "rain",
    title: "Window Rain",
    subtitle: "Soft drops tapping the glass",
    tag: "rain",
    section: "Nature",
    bg: bgRain,
    accent: "from-sky-300/60 to-slate-100/10",
    src: "https://archive.org/download/aporee_2104_35714/berlinBuerkner9HhofEisregen160223.mp3",
  },
  {
    id: "fire",
    title: "Fireplace",
    subtitle: "Crackling flames · warm embers",
    tag: "fire",
    section: "Nature",
    bg: bgFire,
    accent: "from-orange-400/70 to-yellow-200/10",
    src: "https://archive.org/download/crackling-fireplace_daniel-simion/crackling-fireplace_daniel-simion.mp3",
  },
  {
    id: "woods",
    title: "Morning Woods",
    subtitle: "Distant birdsong, soft breeze",
    tag: "forest",
    section: "Nature",
    bg: bgWoods,
    accent: "from-lime-300/60 to-amber-100/10",
    src: mix(1210),
  },
  {
    id: "thunder",
    title: "Distant Thunderstorm",
    subtitle: "Slow rolling thunder far away",
    tag: "storm",
    section: "Nature",
    bg: bgThunder,
    accent: "from-indigo-400/60 to-slate-100/10",
    src: mix(1258),
  },
  {
    id: "surf",
    title: "Midnight Surf",
    subtitle: "Long, slow ocean breaths",
    tag: "ocean",
    section: "Nature",
    bg: bgSurf,
    accent: "from-blue-400/60 to-indigo-200/10",
    src: mix(1172),
  },

  // ───────── Urban & Life ─────────
  {
    id: "train",
    title: "Night Train Journey",
    subtitle: "Soft rhythmic rails",
    tag: "travel",
    section: "Urban & Life",
    bg: bgTrain,
    accent: "from-yellow-300/50 to-zinc-200/10",
    src: mix(1628),
  },

  // ───────── Music ─────────
  {
    id: "lofi",
    title: "Sofi's Room",
    subtitle: "Lofi beats · late night study",
    tag: "lofi",
    section: "Music",
    bg: bgLofi,
    accent: "from-rose-300/60 to-rose-100/10",
    src: mix(130),
  },

  // ───────── Fantasy & Focus ─────────
  {
    id: "darksouls",
    title: "Middle Earth",
    subtitle: "Ancient calm of distant hills",
    tag: "fantasy",
    section: "Fantasy & Focus",
    bg: bgDarkSouls,
    accent: "from-amber-300/60 to-amber-100/10",
    src: mix(2459),
  },
  {
    id: "dojo",
    title: "Zen Dojo",
    subtitle: "Bamboo whisper · disciplined calm",
    tag: "zen",
    section: "Fantasy & Focus",
    bg: bgDojo,
    accent: "from-emerald-300/60 to-stone-200/10",
    src: mix(1153),
  },

  // ───────── Pure Frequency ─────────
  {
    id: "whitenoise",
    title: "Deep White Noise",
    subtitle: "Full-spectrum acoustic mask",
    tag: "white noise",
    section: "Pure Frequency",
    bg: bgWhiteNoise,
    accent: "from-zinc-300/60 to-zinc-100/10",
    src: mix(1041),
  },
  {
    id: "432hz",
    title: "432 Hz Harmonic Tone",
    subtitle: "Healing frequency · pairs with Pink Noise",
    tag: "432 hz",
    section: "Pure Frequency",
    bg: bgPinkNoise,
    accent: "from-purple-400/60 to-fuchsia-200/10",
    src: hz432Wav,
  },
  {
    id: "528hz",
    title: "528 Hz Deep Tone",
    subtitle: "Solfeggio frequency · pairs with Brown Noise",
    tag: "528 hz",
    section: "Pure Frequency",
    bg: bgBrownNoise,
    accent: "from-emerald-700/60 to-teal-300/10",
    src: hz528Wav,
  },
];

export const SECTIONS = [
  "Nature",
  "Urban & Life",
  "Music",
  "Fantasy & Focus",
  "Pure Frequency",
] as const;
export const MAX_ACTIVE = 2;
