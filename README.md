# 🎲 Decision Dungeon

**Let fate decide.**

Decision Dungeon is an interactive fantasy-themed decision maker built
with **React, TypeScript and Vite**.\
Write a question, add between 2 and 20 possible choices, roll the D20,
and let the dungeon choose your path.

The project combines a real animated 3D D20, bilingual UI, ambient
audio, fantasy visual effects and a **Best of 3** duel mode in a
responsive web experience.

------------------------------------------------------------------------

## ✨ Features

-   🎲 **Interactive 3D D20**
    -   Real 3D die rendered in the browser.
    -   The visible face matches the number assigned to the winning
        option.
    -   Slow floating idle animation before the first roll.
    -   Dynamic launch, spin and settling animation while rolling.
    -   The die remains still after revealing the result.
-   ⚔️ **Best of 3**
    -   The first result becomes the first contender.
    -   A second different contender is selected.
    -   The final roll decides between both contenders.
    -   The D20 finishes on the original number of the winning choice.
-   📝 **Custom decisions**
    -   A question is required before rolling.
    -   Add from **2 to 20 choices**.
    -   Remove choices at any time.
    -   Each choice is mapped directly to a D20 result.
-   🌎 **English / Spanish**
    -   Complete bilingual interface.
    -   Language preference is saved locally.
    -   The entrance screen can also switch between EN and ES.
-   🏰 **Enter the Dungeon**
    -   Dedicated fantasy entrance screen.
    -   The main interface remains hidden until entering.
    -   Ambient music begins only after pressing **Enter the Dungeon /
        Entrar a la Mazmorra**, providing consistent audio behavior
        across browsers.
-   🔊 **Audio**
    -   Looping medieval fantasy ambience.
    -   Dice-roll sound synchronized with the D20 animation.
    -   Independent music and SFX controls.
-   ✨ **Fantasy presentation**
    -   Deep blue, black and metallic-gold visual identity.
    -   Embossed medieval typography.
    -   Animated magical background.
    -   Star field with independent twinkling groups.
    -   Rotating astrolabe decorations.
    -   Arcane runes and vortex effects.
-   📱 **Responsive design**
    -   Designed for desktop and smaller screens.
    -   Hidden decorative scrollbars.
    -   Internal scrolling for long choice lists.
-   🏅 **Credits modal**
    -   Built-in attribution for development, music, sound effects and
        the 3D asset.

------------------------------------------------------------------------

## 🎮 How to Use

1.  Enter the dungeon.
2.  Write the decision you want help with.
3.  Add at least two possible choices.
4.  Press **Roll the Dice**.
5.  Watch the D20 determine your result.
6.  Accept fate or challenge the result with **Best of 3**.

> The number shown by the D20 corresponds directly to the number
> assigned to the selected option.

------------------------------------------------------------------------

## 🛠️ Built With

-   **React**
-   **TypeScript**
-   **Vite**
-   **Three.js**
-   **React Three Fiber**
-   **React Three Drei**
-   **HTML5 Audio**
-   **CSS3**
-   **WebM visual effects**
-   **Local Storage**

------------------------------------------------------------------------

## 📂 Main Project Structure

``` text
decision-dungeon/
├── public/
│   ├── audio/
│   │   ├── dice-roll.mp3
│   │   └── dungeon-ambience.mp3
│   ├── effects/
│   │   ├── arcane-left.webm
│   │   ├── arcane-right.webm
│   │   └── dice-vortex.webm
│   ├── fonts/
│   ├── images/
│   │   ├── astrolabe-left.png
│   │   └── astrolabe-right.png
│   ├── models/
│   │   └── d20.glb
│   ├── apple-touch-icon.png
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   ├── favicon.ico
│   └── favicon.png
├── src/
│   ├── App.css
│   ├── App.tsx
│   └── ...
├── index.html
├── package.json
└── README.md
```

------------------------------------------------------------------------

## 🚀 Running Locally

Clone the repository:

``` bash
git clone <YOUR-REPOSITORY-URL>
cd decision-dungeon
```

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

Create a production build:

``` bash
npm run build
```

Preview the production build:

``` bash
npm run preview
```

------------------------------------------------------------------------

## 🎲 How the D20 Works

Decision Dungeon does not simply display a random decorative die face.

If there are `N` available choices, the standard roll generates a number
between `1` and `N`. That number selects the corresponding choice, and
the 3D D20 rotates until the same number is facing the player.

This keeps the visual result and the actual decision synchronized.

------------------------------------------------------------------------

## ⚔️ Best of 3 Logic

The Best of 3 mode works as a final duel:

1.  The original result becomes **Contender 1**.
2.  A new roll selects a different option as **Contender 2**.
3.  The final roll chooses between those two contenders.
4.  The D20 settles on the original option number belonging to the
    winner.

------------------------------------------------------------------------

## 🌐 Language

Decision Dungeon currently supports:

-   🇬🇧 English
-   🇪🇸 Spanish

The selected language is stored in the browser so the preference
persists between visits.

User-entered questions and choices are never automatically translated.

------------------------------------------------------------------------

## 🎨 Typography

The project uses fantasy-oriented fonts distributed with their
respective licenses:

-   **MedievalSharp**
-   **Uncial Antiqua**

Font license files are included with the project assets.

------------------------------------------------------------------------

## 🎵 Audio Credits

### Fantasy Medieval Ambient

Music by **DeusLower**\
Source: Pixabay\
License: **Pixabay Content License**

https://pixabay.com/users/deuslower-45666444/

### RPG Dice, Rolling

Sound effect by **brkdwnb3njo (Freesound)**\
Distributed through Pixabay / `freesound_community`\
License: **Pixabay Content License**

https://pixabay.com/users/freesound_community-46691455/

Pixabay Content License summary:

https://pixabay.com/service/license-summary/

------------------------------------------------------------------------

## 🎲 3D Asset Credit

**D20 Blue Metal Dice**\
Created by **Guilherme Guimaraes**\
Source: Sketchfab\
License: **CC BY 4.0**

Model:

https://sketchfab.com/3d-models/d20-blue-metal-dice-03a6d62b028241bfa11cd280665e3d43

Creator:

https://sketchfab.com/guimaraesmartinsguilherme

CC BY 4.0:

https://creativecommons.org/licenses/by/4.0/

------------------------------------------------------------------------

## 👨‍💻 Development

**Developed by Edgardo Villalba**

Decision Dungeon was designed and developed as an interactive web
project combining frontend development, 3D rendering, animation, sound
design and responsive UI/UX.

------------------------------------------------------------------------

## 📜 Asset Licenses

Third-party assets remain subject to their respective licenses.

The D20 model is used under **Creative Commons Attribution 4.0 (CC BY
4.0)**.\
Audio assets are used under the **Pixabay Content License**.\
Font license files are included alongside the corresponding font assets.

------------------------------------------------------------------------

## 🗝️ Final Words

> Ask the question.\
> Choose your paths.\
> Roll the dice.\
> **Let fate decide.**
