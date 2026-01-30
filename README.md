# Valentine Surprise — React (Vite)

Simple personal Valentine’s Day surprise site built with React + plain CSS.

Quick start

1. Install deps:

```bash
npm install
```

2. Run dev server:

```bash
npm run dev
```

3. (Optional) Add a romantic MP3 at `public/music/celebrate.mp3` to use a full song.

Structure

- `src/` — React source
- `src/components` — components (Countdown, PreReveal, Reveal, MusicToggle)
- `src/styles.css` — styling and animations

Notes

- The countdown targets Feb 14 00:00 local time. Before then you see teasers; at/after that time the reveal content and animations appear.
- The music toggle tries `/music/celebrate.mp3` and falls back to a short WebAudio melody if no file or play is blocked.

Music playlist support

 - To use a folder of songs, place them in `public/music/love/`.
 - Add a `tracks.json` file in that folder listing filenames in order, for example:

```
[
	"track1.mp3",
	"track2.mp3"
]
```

The app will fetch `/music/love/tracks.json` in development and use those files as a playlist. If `tracks.json` is not present, the dev server may provide a directory listing the toggle can parse (Vite dev).
