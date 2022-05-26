Change URL in `const url` to your preference.

Adapt to your environment or comment out lines:
```js
childProcess.execSync(`google-chrome ${fullUrl}`);
childProcess.execSync('paplay /usr/share/sounds/freedesktop/stereo/trash-empty.oga');
childProcess.execSync(`zenity --info --text="HATA!"`);
```

Also comment it on first run to avoid getting notification on every currently existing offer on the page.

# Usage
```bash
npm install
./index.js
```
