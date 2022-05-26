import childProcess from 'child_process';
import fs from 'fs';
import fetch from "node-fetch";
import cheerio from "cheerio";

const PAUSE = 60000;

const url = `https://www.otodom.pl/uk/oferty/wynajem/mieszkanie/wiele-lokalizacji?locations%5B0%5D%5BregionId%5D=11&locations%5B0%5D%5BsubregionId%5D=278&locations%5B0%5D%5BcityId%5D=206&locations%5B1%5D%5BregionId%5D=11&locations%5B1%5D%5BsubregionId%5D=439&locations%5B1%5D%5BcityId%5D=40&locations%5B2%5D%5BregionId%5D=11&locations%5B2%5D%5BsubregionId%5D=280&locations%5B2%5D%5BcityId%5D=208&priceMin=3000&priceMax=6000&areaMin=40&areaMax=80&roomsNumber=%5BTWO%2CTHREE%5D&locations=%5Bcities_6-206%2Ccities_6-40%2Ccities_6-208%5D`
const baseUrl = `https://www.otodom.pl`;

let db = [];
try {
  db = JSON.parse(fs.readFileSync('./db.json'));
} catch (err) {
  console.log(err);
}

const write = () => {
  fs.writeFileSync('./db.json', JSON.stringify(db, null, 2));
}

const iteration = async () => {
  console.log(new Date(), 'Start of iteration');
  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const offers = $(`[role="main"] > [data-cy="search.listing"] [data-cy="listing-item-link"]`);
  const urls = offers.map((i, el) => $(el).attr('href')).get();
  const initialCount = db.length;
  urls.map((url) => {
    const match = url.match(/(?<=-)[^-]*$/);
    if (match) {
      const id = match[0];
      const exists = db.find(({id: _id}) => _id === id);
      if (!exists) {
        const fullUrl = baseUrl + url;
        console.log(new Date(), fullUrl);
        childProcess.execSync(`google-chrome ${fullUrl}`);
        childProcess.execSync('paplay /usr/share/sounds/freedesktop/stereo/trash-empty.oga');
        childProcess.execSync(`zenity --info --text="HATA!"`);
        db.push({id, url: fullUrl});
      }
    } else {
      console.log('Wrong URL of offer:', url);
    }
  });
  console.log(new Date(), db.length);
  if (db.length !== initialCount) {
    write(db);
  }
}

const main = async () => {
  while (true) {
    await iteration();
    await new Promise((resolve) => setTimeout(resolve, PAUSE));
  }
};

main();
