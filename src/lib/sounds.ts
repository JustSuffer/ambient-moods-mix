import bgDarkSouls from "@/assets/bg-darksouls.png";
import bgLofi from "@/assets/bg-lofi.png";
import bgFire from "@/assets/bg-fire.png";
import bgRain from "@/assets/bg-rain.jpg";
import bgCoffee from "@/assets/bg-coffeeshop.jpg";
import bgLibrary from "@/assets/bg-library.jpg";
import bgTrain from "@/assets/bg-train.jpg";
import bgBrook from "@/assets/bg-brook.jpg";
import bgWoods from "@/assets/bg-woods.jpg";
import bgThunder from "@/assets/bg-thunder.jpg";
import bgSurf from "@/assets/bg-surf.jpg";
import bgClassical from "@/assets/bg-classical.jpg";
import bgStrings from "@/assets/bg-strings.jpg";
import bgChimes from "@/assets/bg-chimes.jpg";
import bgDojo from "@/assets/bg-dojo.jpg";
import bgElden from "@/assets/bg-elden.jpg";
import bgTavern from "@/assets/bg-tavern.jpg";
import bgKeyboard from "@/assets/bg-keyboard.jpg";
import bgServer from "@/assets/bg-server.jpg";
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
  { id: "rain", title: "Window Rain", subtitle: "Gentle drops · steady, far away",
    tag: "rain", section: "Nature", bg: bgRain, accent: "from-sky-300/60 to-slate-100/10",
    src: mix(2515) },
  { id: "fire", title: "Fireplace", subtitle: "Slow embers · soft crackle",
    tag: "fire", section: "Nature", bg: bgFire, accent: "from-orange-400/70 to-yellow-200/10",
    src: mix(2807) },
  { id: "brook", title: "Babbling Brook", subtitle: "Clear stream over mossy stones",
    tag: "water", section: "Nature", bg: bgBrook, accent: "from-emerald-300/60 to-cyan-100/10",
    src: mix(1180) },
  { id: "woods", title: "Morning Woods", subtitle: "Distant birdsong · soft wind",
    tag: "forest", section: "Nature", bg: bgWoods, accent: "from-lime-300/60 to-amber-100/10",
    src: mix(2473) },
  { id: "thunder", title: "Distant Thunderstorm", subtitle: "Rolling thunder beyond the plains",
    tag: "storm", section: "Nature", bg: bgThunder, accent: "from-indigo-400/60 to-slate-100/10",
    src: mix(1258) },
  { id: "surf", title: "Midnight Surf", subtitle: "Slow deep ocean waves",
    tag: "ocean", section: "Nature", bg: bgSurf, accent: "from-blue-400/60 to-indigo-200/10",
    src: mix(1172) },

  // ───────── Urban & Life ─────────
  { id: "coffee", title: "Bustling Coffee Shop", subtitle: "Espresso hisses and quiet chatter",
    tag: "café", section: "Urban & Life", bg: bgCoffee, accent: "from-amber-400/60 to-orange-100/10",
    src: mix(133) },
  { id: "library", title: "Old Library", subtitle: "Turning pages, silent halls",
    tag: "silence", section: "Urban & Life", bg: bgLibrary, accent: "from-stone-300/60 to-amber-100/10",
    src: mix(123) },
  { id: "train", title: "Night Train Journey", subtitle: "Soft rhythmic wheels · cabin hum",
    tag: "travel", section: "Urban & Life", bg: bgTrain, accent: "from-yellow-300/50 to-zinc-200/10",
    src: mix(1162) },
  { id: "keyboard", title: "Mechanical Keyboard", subtitle: "Tactile clack of focused typing",
    tag: "productivity", section: "Urban & Life", bg: bgKeyboard, accent: "from-rose-400/60 to-violet-200/10",
    src: mix(1386) },
  { id: "server", title: "Server Room Hum", subtitle: "Low hypnotic machine drone",
    tag: "drone", section: "Urban & Life", bg: bgServer, accent: "from-cyan-400/60 to-blue-200/10",
    src: mix(2636) },

  // ───────── Music ─────────
  { id: "lofi", title: "Sofi's Room", subtitle: "Soft lofi · late night study",
    tag: "lofi", section: "Music", bg: bgLofi, accent: "from-rose-300/60 to-rose-100/10",
    src: mix(2517) },
  { id: "classical", title: "Classical Masterpieces", subtitle: "Mind-opening, mathematical pieces",
    tag: "classical", section: "Music", bg: bgClassical, accent: "from-amber-300/60 to-yellow-100/10",
    src: mix(1941) },
  { id: "strings", title: "Melancholic Strings", subtitle: "Solo piano and violin reflections",
    tag: "strings", section: "Music", bg: bgStrings, accent: "from-violet-300/60 to-rose-100/10",
    src: "https://archive.org/download/MoonlightSonata_755/Beethoven-MoonlightSonata.mp3" },
  { id: "chimes", title: "Wind Chimes", subtitle: "Random meditative wooden tones",
    tag: "meditation", section: "Music", bg: bgChimes, accent: "from-pink-300/60 to-amber-100/10",
    src: mix(1046) },

  // ───────── Fantasy & Focus ─────────
  { id: "darksouls", title: "Middle Earth", subtitle: "Boss fight · grand orchestral dread",
    tag: "dark fantasy", section: "Fantasy & Focus", bg: bgDarkSouls, accent: "from-amber-300/60 to-amber-100/10",
    src: "https://archive.org/download/great-grey-wolf-sif/Gwyn%2C%20Lord%20of%20Cinder.mp3" },
  { id: "elden", title: "Elden's Echo", subtitle: "Ancient ruined world · golden silence",
    tag: "epic", section: "Fantasy & Focus", bg: bgElden, accent: "from-yellow-400/60 to-amber-100/10",
    src: mix(2279) },
  { id: "tavern", title: "Tavern of Acoria", subtitle: "Dim inn · fire, mugs, distant lute",
    tag: "tavern", section: "Fantasy & Focus", bg: bgTavern, accent: "from-orange-400/60 to-yellow-100/10",
    src: mix(1958) },
  { id: "dojo", title: "Zen Dojo", subtitle: "Bamboo whisper · disciplined calm",
    tag: "zen", section: "Fantasy & Focus", bg: bgDojo, accent: "from-emerald-300/60 to-stone-200/10",
    src: mix(1153) },

  // ───────── Pure Frequency ─────────
  { id: "whitenoise", title: "Deep White Noise", subtitle: "Soft pink-noise mask · steady hush",
    tag: "white noise", section: "Pure Frequency", bg: bgWhiteNoise, accent: "from-zinc-300/60 to-zinc-100/10",
    src: mix(2528) },
];

export const SECTIONS = ["Nature", "Urban & Life", "Music", "Fantasy & Focus", "Pure Frequency"] as const;
export const MAX_ACTIVE = 2;
