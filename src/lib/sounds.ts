import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";
import bgCoffee from "@/assets/bg-coffeeshop.jpg";
import bgLibrary from "@/assets/bg-library.jpg";
import bgTrain from "@/assets/bg-train.jpg";
import bgWoods from "@/assets/bg-woods.jpg";
import bgThunder from "@/assets/bg-thunder.jpg";
import bgSurf from "@/assets/bg-surf.jpg";
import bgClassical from "@/assets/bg-classical.jpg";
import bgStrings from "@/assets/bg-strings.jpg";
import bgChimes from "@/assets/bg-chimes.jpg";
import bgDojo from "@/assets/bg-dojo.jpg";
import bgTavern from "@/assets/bg-tavern.jpg";
import bgKeyboard from "@/assets/bg-keyboard.jpg";
import bgWhiteNoise from "@/assets/bg-whitenoise.jpg";

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
  { id: "rain", title: "Window Rain", subtitle: "Soft drops tapping the glass",
    tag: "rain", section: "Nature", bg: bgRain, accent: "from-sky-300/60 to-slate-100/10",
    src: "https://archive.org/download/aporee_2104_35714/berlinBuerkner9HhofEisregen160223.mp3" },
  { id: "fire", title: "Fireplace", subtitle: "Crackling flames · warm embers",
    tag: "fire", section: "Nature", bg: bgFire, accent: "from-orange-400/70 to-yellow-200/10",
    src: "https://archive.org/download/crackling-fireplace_daniel-simion/crackling-fireplace_daniel-simion.mp3" },
  { id: "woods", title: "Morning Woods", subtitle: "Distant birdsong, soft breeze",
    tag: "forest", section: "Nature", bg: bgWoods, accent: "from-lime-300/60 to-amber-100/10",
    src: mix(1210) },
  { id: "thunder", title: "Distant Thunderstorm", subtitle: "Slow rolling thunder far away",
    tag: "storm", section: "Nature", bg: bgThunder, accent: "from-indigo-400/60 to-slate-100/10",
    src: mix(1258) },
  { id: "surf", title: "Midnight Surf", subtitle: "Long, slow ocean breaths",
    tag: "ocean", section: "Nature", bg: bgSurf, accent: "from-blue-400/60 to-indigo-200/10",
    src: mix(1172) },

  // ───────── Urban & Life ─────────
  { id: "coffee", title: "Quiet Coffee Shop", subtitle: "Distant murmur, soft cups",
    tag: "café", section: "Urban & Life", bg: bgCoffee, accent: "from-amber-400/60 to-orange-100/10",
    src: mix(2440) },
  { id: "library", title: "Old Library", subtitle: "Pages turning in silence",
    tag: "silence", section: "Urban & Life", bg: bgLibrary, accent: "from-stone-300/60 to-amber-100/10",
    src: mix(1158) },
  { id: "train", title: "Night Train Journey", subtitle: "Soft rhythmic rails",
    tag: "travel", section: "Urban & Life", bg: bgTrain, accent: "from-yellow-300/50 to-zinc-200/10",
    src: mix(1628) },
  { id: "keyboard", title: "Soft Keyboard", subtitle: "Gentle distant typing",
    tag: "productivity", section: "Urban & Life", bg: bgKeyboard, accent: "from-rose-400/60 to-violet-200/10",
    src: mix(1386) },

  // ───────── Music ─────────
  { id: "lofi", title: "Sofi's Room", subtitle: "Lofi beats · late night study",
    tag: "lofi", section: "Music", bg: bgLofi, accent: "from-rose-300/60 to-rose-100/10",
    src: "https://archive.org/download/jamendo-429174/01-1817528-Alexey%20Anisimov-Lo-Fi%20Chill%20Hip-Hop%20_Instrumental_.mp3" },
  { id: "classical", title: "Classical Stillness", subtitle: "Slow ambient piano",
    tag: "classical", section: "Music", bg: bgClassical, accent: "from-amber-300/60 to-yellow-100/10",
    src: mix(1189) },
  { id: "strings", title: "Meditative Strings", subtitle: "Long, peaceful bowing",
    tag: "strings", section: "Music", bg: bgStrings, accent: "from-violet-300/60 to-rose-100/10",
    src: mix(1046) },
  { id: "chimes", title: "Wind Chimes", subtitle: "Random meditative tones",
    tag: "meditation", section: "Music", bg: bgChimes, accent: "from-pink-300/60 to-amber-100/10",
    src: mix(1247) },

  // ───────── Fantasy & Focus ─────────
  { id: "darksouls", title: "Middle Earth", subtitle: "Ancient calm of distant hills",
    tag: "fantasy", section: "Fantasy & Focus", bg: bgDarkSouls, accent: "from-amber-300/60 to-amber-100/10",
    src: mix(2459) },
  { id: "tavern", title: "Tavern of Acoria", subtitle: "Distant lute, low hearth",
    tag: "tavern", section: "Fantasy & Focus", bg: bgTavern, accent: "from-orange-400/60 to-yellow-100/10",
    src: mix(1190) },
  { id: "dojo", title: "Zen Dojo", subtitle: "Bamboo whisper · disciplined calm",
    tag: "zen", section: "Fantasy & Focus", bg: bgDojo, accent: "from-emerald-300/60 to-stone-200/10",
    src: mix(1153) },

  // ───────── Pure Frequency ─────────
  { id: "whitenoise", title: "Deep White Noise", subtitle: "Pure acoustic frequency mask",
    tag: "white noise", section: "Pure Frequency", bg: bgWhiteNoise, accent: "from-zinc-300/60 to-zinc-100/10",
    src: mix(1041) },
];

export const SECTIONS = ["Nature", "Urban & Life", "Music", "Fantasy & Focus", "Pure Frequency"] as const;
export const MAX_ACTIVE = 2;
