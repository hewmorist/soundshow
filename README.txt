SOUNDSHOW 0.1

Files required by the app:
  index.html
  style.css
  slideshow.js
  slideshow.json

The two images are embedded directly in slideshow.json as WebP/Base64 data URLs.
Audio is loaded from SoundCloud.

TEST LOCALLY
Do not double-click index.html, because slideshow.json is loaded with fetch().
From this folder run, for example:
  python3 -m http.server 8000
Then open:
  http://localhost:8000

GITHUB PAGES
Upload the four app files to a repository and enable GitHub Pages for the branch/folder.

NOTE
SoundCloud/browser autoplay policies can vary. The Start button supplies the initial
user gesture; the prototype requests autoplay when each track is loaded.
