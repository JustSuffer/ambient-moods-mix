const https = require('https');

const searchUrl = "https://archive.org/advancedsearch.php?q=collection:opensource_audio+AND+format:VBR+MP3+AND+title:(brook+OR+thunder+OR+ocean+OR+coffee+OR+library+OR+train+OR+keyboard+OR+drone+OR+lofi+OR+classical+OR+chimes+OR+tavern+OR+zen+OR+noise)&fl[]=identifier&fl[]=title&sort[]=downloads+desc&rows=200&output=json";

https.get(searchUrl, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    const docs = json.response.docs;
    docs.forEach(doc => {
      const id = doc.identifier;
      const title = doc.title;
      // Get the files list for this identifier
      https.get(`https://archive.org/metadata/${id}`, (res2) => {
        let data2 = '';
        res2.on('data', (chunk) => data2 += chunk);
        res2.on('end', () => {
          try {
            const meta = JSON.parse(data2);
            const mp3s = meta.files.filter(f => f.name.endsWith('.mp3'));
            if (mp3s.length > 0) {
              console.log(`${title} -> https://archive.org/download/${id}/${mp3s[0].name}`);
            }
          } catch(e) {}
        });
      });
    });
  });
});
