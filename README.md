# KGEES FSR – installable app wrapper

This folder turns the existing FSR Apps Script web app into an installable phone app (PWA),
hosted free on GitHub Pages. The FSR code in Apps Script does not change, except one line in `doGet`.

## What's in here

| File | What it does |
|---|---|
| `index.html` | The app's front page. Shows a splash, then loads FSR inside it. **You edit one line here.** |
| `manifest.json` | Tells the phone the app's name, icon and colours, and to open full-screen. |
| `sw.js` | Service worker. Makes the app installable and shows a "No signal" screen when offline. |
| `icons/` | KGEES Fine Foods logo (`logo.png`, used on the splash screen) and the app icons (logo with "KGEES FSR" below). |

---

## Step 1 – Allow FSR to open inside the wrapper (Apps Script)

By default Google blocks Apps Script pages from being shown inside another site.
Open the FSR project in Apps Script, find `doGet`, and add `.setXFrameOptionsMode(...)` to what it returns.

Before (yours may look slightly different):

```js
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('KGEES FSR');
}
```

After:

```js
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('KGEES FSR')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

Then **Deploy → Manage deployments → ✏️ Edit → Version: New version → Deploy**.
Copy the **Web app URL** (ends in `/exec`).

> If `doGet` returns different pages for different modules, add the line to every `return`.

## Step 2 – Paste the URL into `index.html`

Open `index.html`, find this line near the bottom and replace the placeholder:

```js
const FSR_URL = 'PASTE_YOUR_APPS_SCRIPT_EXEC_URL_HERE';
```

## Step 3 – Create the GitHub repo

1. Go to github.com → **New repository**.
2. Name it, e.g. `kgees-fsr-app`. Set it to **Public** (GitHub Pages is free only for public repos).
   This is safe: the repo only holds the wrapper and your `/exec` link, not FSR's code or data.
   Anyone with the link still has to pass whatever access FSR already has.
3. Click **Create repository** → **uploading an existing file**.
4. Drag in `index.html`, `manifest.json`, `sw.js`, `README.md` **and the `icons` folder**.
5. Click **Commit changes**.

## Step 4 – Turn on GitHub Pages

1. In the repo: **Settings → Pages**.
2. Under **Build and deployment → Source**: *Deploy from a branch*.
3. Branch: **main**, folder **/ (root)** → **Save**.
4. Wait 1–2 minutes, refresh. You'll see:
   `Your site is live at https://<your-username>.github.io/kgees-fsr-app/`

That link is the app.

## Step 5 – Test on your own phone first

1. Open the link in **Chrome** on Android.
2. FSR should appear after the green splash. Check: Start Day, odometer photo, shop visit, End Day DSR upload.
3. Tap the **Install** banner at the bottom (or Chrome menu ⋮ → **Install app** / **Add to Home screen**).
4. Open it from the new home-screen icon – no browser bar, full screen.
5. Turn on airplane mode and open it – you should see the **No signal** screen, not Chrome's dinosaur.

## Step 6 – Roll out to SAs

Send them the github.io link on WhatsApp with:
"Open in Chrome → tap Install → use the KGEES FSR icon from now on."

---

## Troubleshooting

**Blank white screen or "script.google.com refused to connect"**
- Step 1 not done, or you didn't deploy a **new version** after adding the line.
- Or FSR requires SAs to **sign in with Google** – Google's sign-in page never loads inside a frame.
  Fix: in `index.html` change `const MODE = 'frame';` to `const MODE = 'redirect';`.
  The app still installs with its own icon and opens FSR; it just shows a thin bar with the Google address on top.

**Camera button doesn't open the camera**
- The wrapper already allows camera access. If the SA earlier blocked camera for the site,
  long-press the app icon → App info → Permissions → Camera → Allow.

**I changed something but phones show the old version**
- Open `sw.js` and change `kgees-fsr-v3` to `kgees-fsr-v4` (then v5, etc.), and upload again.
  Phones pick it up the next time they open the app with signal.
- Changes to FSR itself (in Apps Script) show up immediately after a new deployment – no change needed here.

**The /exec URL changed**
- Only happens if you create a *new deployment* instead of editing the existing one.
  Always use **Manage deployments → Edit → New version** so the URL stays the same.

## Optional later – APK file

Once the github.io link works, go to **pwabuilder.com**, paste the link, choose **Android → Generate**.
It gives a free APK you can send to SAs directly on WhatsApp (they'll need to allow "Install unknown apps" once).
