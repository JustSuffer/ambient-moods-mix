const fetch = require('node-fetch');

const files = [
  "File:Babbling_brook.ogg",
  "File:Thunderstorm_sound_effect.ogg",
  "File:Ocean_Waves_on_Beach.ogg",
  "File:Coffee_shop_ambiance.ogg",
  "File:Library_Ambience.ogg",
  "File:Typing_on_a_keyboard.ogg",
  "File:Brown_noise.ogg",
  "File:Erik_Satie_-_gymnopedie_no._1.ogg",
  "File:Bach_-_Cello_Suite_1_-_Prelude.ogg",
  "File:Wind_chimes_sound.ogg",
  "File:Ambient_Drone.ogg",
  "File:Tavern_ambiance.ogg",
  "File:Bamboo_forest_wind.ogg"
];

async function run() {
  for (const file of files) {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(file)}&prop=imageinfo&iiprop=url&format=json`;
    try {
      const res = await fetch(url);
      const json = await res.json();
      const pages = json.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pageId === "-1") {
        console.log(`NOT FOUND: ${file}`);
      } else {
        const fileUrl = pages[pageId].imageinfo[0].url;
        console.log(`${file} -> ${fileUrl}`);
      }
    } catch(e) {
      console.log(`ERROR ${file}: ${e.message}`);
    }
  }
}
run();
