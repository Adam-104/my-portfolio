# Alamuri Adamu, portfolio

A dark, motion-driven portfolio built on the MIT-licensed
[masterPortfolio](https://github.com/ashutosh1919/masterPortfolio) template
by Ashutosh Hathidara (see LICENSE). The layout, styling and components are
new. React 18, React Router 6 and GSAP.

    npm install
    npm start          # dev server on http://localhost:3000
    npm run build      # production build in build/

## What is on the page

- **Intro:** a dot drops in and becomes an underline, the letters of "ADAMU"
  fly in, then the word scrambles into "PORTFOLIO". Plays once per browser
  session and can be skipped.
- **Home:** dust that gathers into a particle portrait of your photo. It
  reacts to the mouse and scatters as you scroll.
- **About, Skills, Projects, Play, Contact:** flat bordered panels, a tilted
  tech ticker, a numbered skills list, laptop project mockups, and a pixel
  text breakout game.

## Change the content

Everything you read on the site is in `src/portfolio.js`: your name, intro
words, skills, projects, links, contact details and the game text.

- Turn the intro off: `settings.isIntro = false`.
- Turn the portrait off (dust only): `settings.portrait = false`.
- The intro word is `greeting.introWord`. If it contains an "I" the dot lands
  there, otherwise the dot becomes an underline. The top bar uses
  `greeting.displayName`.
- Project screenshots: put an image in `public/projects/` and add
  `image: "/projects/typequest.png"` to that project. Without it the laptop
  screen shows the project's numbers.

## Change the portrait

The portrait is built from `public/portrait-density.png` (white = more
particles). To make one from another photo with a plain light background:

    pip install numpy opencv-python scipy
    python3 tools/make_portrait.py your-photo.jpg public/portrait-density.png

## Deploy

Import the repo on Vercel or Netlify. Both are already configured:

- **Vercel:** `vercel.json` rewrites every path to `index.html`. Framework preset
  "Create React App", build `npm run build`, output `build`.
- **Netlify:** `netlify.toml` sets the build command, output directory, Node
  version and the SPA redirect, so `/resume` works on a refresh.

To test the production build locally: `npm run build && npx serve -s build`.

## Resume

Replace `public/Alamuri_Adamu_Resume.pdf` with a new file of the same name.
