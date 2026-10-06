# MD Jaseem & Kulsum Jahan — Interactive Wedding Invitation

This is the polished first build based on the agreed specification.

## Included
- Royal emerald + antique-gold opening
- Tap-to-open invitation
- Uploaded Jashn-E-Bahaaraa instrumental as background music (MP3 in repository root)
- Music control
- Arabic Bismillah
- Groom and bride names + parents on opening
- Scratch-to-reveal Walima card
- Live countdown to 11 November 2026, 9:00 PM IST
- Nikah details
- Walima/Dinner details
- Exact Google Maps link
- Final dua and elegant closing
- Mobile-first responsive layout
- No RSVP and no photo gallery for now

## Important
This is a static website. It does not require a database or paid software.

## Local preview
Open `index.html` in a modern browser. For best results, publish the folder using free static hosting (for example GitHub Pages).

## Future edits
Photos, additional wording, animations, or other sections can be added later without changing the overall architecture.


### Music playback
The music logic is designed for mobile browsers: it attempts playback after the Tap to Open gesture, retries on the next user interaction if needed, and provides a dedicated play/pause control.


Final visual refinements: centered Jaseem weds Kulsum opening, centered couple names on final screen, embedded venue map, and mobile music playback handling.


## Latest v5 changes
- Opening screen is held for a guaranteed 2.6 seconds after “Tap to Open” before it closes.
- Added a new thumbnail filename `invitation-preview-v2.jpg` to help social apps fetch the new preview instead of using a cached older image.
- Open Graph and Twitter preview metadata point to the new thumbnail.

### GitHub upload
Upload/replace `index.html`, `script.js`, `style.css`, and add `invitation-preview-v2.jpg`. Keep `jashn-e-bahaaraa.mp3` in the repository root.
