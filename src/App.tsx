import {
  useEffect,
  useRef,
  useState,
} from 'react'

import type {
  CSSProperties,
} from 'react'


import './App.css'

import D20 from './components/D20'


/* ==================================================
   ÍNDICE — APP.TSX

   1. Datos decorativos
   2. Estados
   3. Agregar opción
   4. Eliminar opción
   5. Tirar el dado
   6. Textos dinámicos
   7. Helpers visuales
   8. Interfaz
      8.1 Mundo exterior
      8.2 Panel izquierdo
      8.3 Panel derecho
      8.4 Créditos
================================================== */


/* ==================================================
   1. DATOS DECORATIVOS

   Estos valores sirven para las runas decorativas
   exteriores y la órbita secundaria.

   Más adelante podemos reemplazar las runas por
   otros símbolos si queremos.
================================================== */


const ARCANE_RUNES = [
  'ᚠ',
  'ᚢ',
  'ᚦ',
  'ᚨ',
  'ᚱ',
  'ᚲ',
  'ᚷ',
  'ᚹ',
  'ᚺ',
  'ᚾ',
  'ᛁ',
  'ᛃ',
  'ᛇ',
  'ᛈ',
  'ᛉ',
  'ᛋ',
  'ᛏ',
  'ᛒ',
  'ᛖ',
  'ᛗ',
]



/* ==================================================
   1.1 INTERNACIONALIZACIÓN — EN / ES

   - La interfaz completa puede cambiar entre inglés y español.
   - La elección de idioma se guarda en localStorage.
   - El idioma por defecto sigue siendo inglés.
   - La pregunta de ejemplo cambia sólo al entrar o hacer F5.
   - El placeholder NO cuenta como una pregunta real.
================================================== */

type Language =
  | 'en'
  | 'es'


const QUESTION_EXAMPLES:
  Record<
    Language,
    readonly string[]
  > = {

  en: [
    'What game should I play tonight?',
    'What should I do tonight?',
    'What should I eat tonight?',
    'What movie should I watch?',
    'What should I play next?',
    'What should I cook today?',
    'Where should I go this weekend?',
    'Which project should I work on?',
    'What should I buy?',
    'What should fate decide?',
  ],

  es: [
    '¿Qué juego debería jugar esta noche?',
    '¿Qué debería hacer esta noche?',
    '¿Qué debería comer esta noche?',
    '¿Qué película debería ver?',
    '¿Qué debería jugar después?',
    '¿Qué debería cocinar hoy?',
    '¿A dónde debería ir este fin de semana?',
    '¿En qué proyecto debería trabajar?',
    '¿Qué debería comprar?',
    '¿Qué debería decidir el destino?',
  ],

}


const UI_TEXT = {

  en: {
    tagline:
      'Let fate decide',

    questionTitle:
      'What must fate decide?',

    questionRequired:
      'A question is required to enter the dungeon.',

    questionRequiredShort:
      'Write a question before you roll.',

    choicesTitle:
      'Your choices',

    addChoice:
      'Add a choice...',

    maxChoices:
      'Maximum of 20 choices reached',

    add:
      'Add',

    choices:
      'choices',

    addTwoChoices:
      'Add at least two choices to roll.',

    remove:
      'Remove',

    awaitingFate:
      'Awaiting Fate',

    fateIsDeciding:
      'Fate Is Deciding...',

    diceHaveSpoken:
      'The Dice Have Spoken',

    firstContender:
      'First Contender',

    secondContender:
      'Second Contender',

    finalRoll:
      'Final Roll',

    firstContenderEnters:
      (option: string) =>
        `${option} enters the arena.`,

    rivalSummoned:
      'A rival path is being summoned.',

    versus:
      (
        first: string,
        second: string,
      ) =>
        `${first} vs ${second}`,

    weighingPaths:
      'The dungeon is weighing every path.',

    duelResolved:
      'Two contenders entered. One fate prevailed.',

    pathRevealed:
      'The path has been revealed.',

    needQuestion:
      'Give the dungeon a question before asking fate to decide.',

    needChoices:
      'Add at least two choices to awaken the dungeon.',

    ready:
      'Your question and choices are ready. Roll when you dare.',

    theQuestion:
      'The Question',

    waitingQuestion:
      'Your question will appear here.',

    bestOfThreeChose:
      'Best of 3 chose',

    fateChose:
      'Fate chose',

    firstContenderLabel:
      'First contender',

    secondContenderLabel:
      'Second contender',

    finalistsAria:
      'Best of 3 finalists',

    finalChose:
      'The final roll chose between the two contenders.',

    dungeonPath:
      'The dungeon believes this is your path.',

    rolling:
      'Rolling...',

    rollAgain:
      'Roll Again',

    rollDice:
      'Roll the Dice',

    bestOfThree:
      'Best of 3',

    bestOfThreeTitle:
      'The current roll becomes contender one. A second contender is drawn, then the final roll decides between them.',

    modelBy:
      'D20 model by',

    music:
      'Ambient music',

    soundEffects:
      'Dice sound',

    credits:
      'Credits',

    creditsTitle:
      'Credits',

    closeCredits:
      'Close credits',

    development:
      'Development',

    developedBy:
      'Developed by',

    musicCredit:
      'Music',

    diceSoundCredit:
      'Dice sound',

    threeDAsset:
      '3D asset',

    source:
      'Source',

    license:
      'License',

    enterDungeon:
      'Enter the Dungeon',

    entranceTagline:
      'Fate awaits beyond these doors...',
  },

  es: {
    tagline:
      'Deja que el destino decida',

    questionTitle:
      '¿Qué debe decidir el destino?',

    questionRequired:
      'Se necesita una pregunta para entrar a la mazmorra.',

    questionRequiredShort:
      'Escribe una pregunta antes de tirar.',

    choicesTitle:
      'Tus opciones',

    addChoice:
      'Agrega una opción...',

    maxChoices:
      'Se alcanzó el máximo de 20 opciones',

    add:
      'Agregar',

    choices:
      'opciones',

    addTwoChoices:
      'Agrega al menos dos opciones para tirar.',

    remove:
      'Eliminar',

    awaitingFate:
      'Esperando al destino',

    fateIsDeciding:
      'El destino está decidiendo...',

    diceHaveSpoken:
      'El dado ha hablado',

    firstContender:
      'Primer contendiente',

    secondContender:
      'Segundo contendiente',

    finalRoll:
      'Tirada final',

    firstContenderEnters:
      (option: string) =>
        `${option} entra a la arena.`,

    rivalSummoned:
      'Se está invocando un camino rival.',

    versus:
      (
        first: string,
        second: string,
      ) =>
        `${first} vs ${second}`,

    weighingPaths:
      'La mazmorra está sopesando cada camino.',

    duelResolved:
      'Dos contendientes entraron. Un destino prevaleció.',

    pathRevealed:
      'El camino ha sido revelado.',

    needQuestion:
      'Dale una pregunta a la mazmorra antes de pedirle al destino que decida.',

    needChoices:
      'Agrega al menos dos opciones para despertar la mazmorra.',

    ready:
      'Tu pregunta y tus opciones están listas. Tira cuando te atrevas.',

    theQuestion:
      'La pregunta',

    waitingQuestion:
      'Tu pregunta aparecerá aquí.',

    bestOfThreeChose:
      'Mejor de 3 eligió',

    fateChose:
      'El destino eligió',

    firstContenderLabel:
      'Primer contendiente',

    secondContenderLabel:
      'Segundo contendiente',

    finalistsAria:
      'Finalistas del mejor de 3',

    finalChose:
      'La tirada final eligió entre los dos contendientes.',

    dungeonPath:
      'La mazmorra cree que este es tu camino.',

    rolling:
      'Lanzando...',

    rollAgain:
      'Tirar de nuevo',

    rollDice:
      'Tirar el dado',

    bestOfThree:
      'Mejor de 3',

    bestOfThreeTitle:
      'La tirada actual se convierte en el primer contendiente. Se elige un segundo y la tirada final decide entre ambos.',

    modelBy:
      'Modelo D20 por',

    music:
      'Música ambiental',

    soundEffects:
      'Sonido del dado',

    credits:
      'Créditos',

    creditsTitle:
      'Créditos',

    closeCredits:
      'Cerrar créditos',

    development:
      'Desarrollo',

    developedBy:
      'Desarrollado por',

    musicCredit:
      'Música',

    diceSoundCredit:
      'Sonido del dado',

    threeDAsset:
      'Modelo 3D',

    source:
      'Fuente',

    license:
      'Licencia',

    enterDungeon:
      'Entrar a la Mazmorra',

    entranceTagline:
      'El destino aguarda tras estas puertas...',
  },

} as const


const getInitialLanguage =
  (): Language => {

    if (
      typeof window ===
      'undefined'
    ) {
      return 'en'
    }


    const saved =
      window.localStorage.getItem(
        'decision-dungeon:language',
      )


    return saved === 'es'
      ? 'es'
      : 'en'
  }


const getRandomQuestionIndex = (
  total: number,
) =>
  Math.floor(
    Math.random() *
    total,
  )


/*
  La pregunta de ejemplo inicial siempre cambia
  respecto de la carga anterior.

  IMPORTANTE:
  no rota sola durante la visita.
*/

const getFreshQuestionIndex = () => {

  const total =
    QUESTION_EXAMPLES.en.length


  if (
    total <= 1
  ) {
    return 0
  }


  const storageKey =
    'decision-dungeon:last-question'


  let previousIndex =
    -1


  if (
    typeof window !==
    'undefined'
  ) {

    const stored =
      window.localStorage.getItem(
        storageKey,
      )


    const parsed =
      stored !== null
        ? Number(stored)
        : NaN


    if (
      Number.isInteger(parsed) &&
      parsed >= 0 &&
      parsed < total
    ) {
      previousIndex =
        parsed
    }

  }


  let nextIndex =
    getRandomQuestionIndex(
      total,
    )


  while (
    nextIndex ===
    previousIndex
  ) {
    nextIndex =
      getRandomQuestionIndex(
        total,
      )
  }


  if (
    typeof window !==
    'undefined'
  ) {
    window.localStorage.setItem(
      storageKey,
      String(nextIndex),
    )
  }


  return nextIndex
}



/* ==================================================
   VIDEO EN LOOP SUAVE

   El atributo `loop` normal vuelve del último frame
   al primero de golpe. Como los WebM generados no
   terminan exactamente donde empiezan, se nota el salto.

   Solución:
   - usamos DOS copias del mismo video,
   - cuando la primera está por terminar,
   - arrancamos la segunda desde el comienzo,
   - hacemos crossfade entre ambas,
   - y repetimos indefinidamente.
================================================== */

type SeamlessVideoProps = {
  className: string
  src: string
  crossfade?: number

  /*
    Para los astrolabios laterales usamos true.

    En vez de mezclar el último frame con el primero
    (lo que hacía visible el "saltito hacia atrás"),
    el WebM se desvanece suavemente y deja ver durante
    una fracción de segundo el astrolabio CSS de fondo.

    Luego la siguiente copia aparece ya reiniciada.

    El vortex usa false porque ahí el crossfade normal
    funciona bien.
  */
  fadeThroughBackground?: boolean

  /*
    Pequeño offset opcional para evitar arrancar justo
    en el primer frame duro del video generado.
  */
  restartOffset?: number
}


function SeamlessVideo({
  className,
  src,
  crossfade = 0.8,
  fadeThroughBackground = false,
  restartOffset = 0,
}: SeamlessVideoProps) {

  const videoA =
    useRef<HTMLVideoElement | null>(
      null,
    )

  const videoB =
    useRef<HTMLVideoElement | null>(
      null,
    )


  const transitioning =
    useRef(false)


  const activeLayerRef =
    useRef<0 | 1>(0)


  const [
    activeLayer,
    setActiveLayer,
  ] =
    useState<0 | 1>(0)


  const [
    isFading,
    setIsFading,
  ] =
    useState(false)


  const setLayer = (
    layer: 0 | 1,
  ) => {

    activeLayerRef.current =
      layer

    setActiveLayer(
      layer,
    )

  }


  const beginTransition = (
    fromLayer: 0 | 1,
  ) => {

    if (
      transitioning.current ||
      fromLayer !==
        activeLayerRef.current
    ) {
      return
    }


    const currentVideo =
      fromLayer === 0
        ? videoA.current
        : videoB.current


    const nextLayer:
      0 | 1 =
        fromLayer === 0
          ? 1
          : 0


    const nextVideo =
      nextLayer === 0
        ? videoA.current
        : videoB.current


    if (
      !currentVideo ||
      !nextVideo
    ) {
      return
    }


    transitioning.current =
      true


    /*
      MODO LATERAL:
      fade-out -> se ve el astrolabio CSS ->
      reiniciamos la siguiente copia -> fade-in.

      Así NO vemos dos posiciones incompatibles del
      mismo astrolabio superpuestas durante el loop.
    */

    if (
      fadeThroughBackground
    ) {

      setIsFading(
        true,
      )


      window.setTimeout(
        () => {

          nextVideo.currentTime =
            Math.max(
              0,
              restartOffset,
            )

          void nextVideo.play()

          setLayer(
            nextLayer,
          )


          /*
            Dejamos pasar dos frames antes de volver
            a mostrar la nueva copia. Esto evita el
            flash del seek/currentTime.
          */

          window.requestAnimationFrame(
            () => {

              window.requestAnimationFrame(
                () => {

                  setIsFading(
                    false,
                  )

                },
              )

            },
          )


          window.setTimeout(
            () => {

              currentVideo.pause()

              currentVideo.currentTime =
                Math.max(
                  0,
                  restartOffset,
                )

              transitioning.current =
                false

            },
            crossfade * 650,
          )

        },
        crossfade * 500,
      )


      return

    }


    /*
      MODO NORMAL:
      crossfade entre dos copias.
      Lo conservamos para el vortex.
    */

    nextVideo.currentTime =
      Math.max(
        0,
        restartOffset,
      )

    void nextVideo.play()

    setLayer(
      nextLayer,
    )


    window.setTimeout(
      () => {

        currentVideo.pause()

        currentVideo.currentTime =
          Math.max(
            0,
            restartOffset,
          )

        transitioning.current =
          false

      },
      crossfade * 1000,
    )

  }


  const handleTimeUpdate = (
    layer: 0 | 1,
  ) => {

    if (
      layer !==
        activeLayerRef.current ||
      transitioning.current
    ) {
      return
    }


    const video =
      layer === 0
        ? videoA.current
        : videoB.current


    if (
      !video ||
      !Number.isFinite(
        video.duration,
      )
    ) {
      return
    }


    /*
      En fade-through-background empezamos un poco
      antes para que el corte real del archivo ocurra
      cuando el WebM ya está prácticamente invisible.
    */

    const safetyMargin =
      fadeThroughBackground
        ? 0.18
        : 0


    const remaining =
      video.duration -
      video.currentTime


    if (
      remaining <=
      crossfade +
      safetyMargin
    ) {

      beginTransition(
        layer,
      )

    }

  }


  return (

    <div
      className={
        `${className} seamless-video ${
          isFading
            ? 'seamless-video--fading'
            : ''
        }`
      }
      aria-hidden="true"
    >

      <video
        ref={videoA}
        className={
          `seamless-video-layer ${
            activeLayer === 0
              ? 'is-visible'
              : 'is-hidden'
          }`
        }
        autoPlay
        muted
        playsInline
        preload="auto"
        onTimeUpdate={
          () =>
            handleTimeUpdate(0)
        }
        onEnded={
          () =>
            beginTransition(0)
        }
      >
        <source
          src={src}
          type="video/webm"
        />
      </video>


      <video
        ref={videoB}
        className={
          `seamless-video-layer ${
            activeLayer === 1
              ? 'is-visible'
              : 'is-hidden'
          }`
        }
        muted
        playsInline
        preload="auto"
        onTimeUpdate={
          () =>
            handleTimeUpdate(1)
        }
        onEnded={
          () =>
            beginTransition(1)
        }
      >
        <source
          src={src}
          type="video/webm"
        />
      </video>

    </div>

  )

}


function App() {

  /* ==================================================
     2. ESTADOS
  ================================================== */

  const [
    question,
    setQuestion,
  ] =
    useState('')



  const [
    language,
    setLanguage,
  ] =
    useState<Language>(
      () =>
        getInitialLanguage(),
    )



  const musicRef =
    useRef<HTMLAudioElement | null>(
      null,
    )


  const diceSoundRef =
    useRef<HTMLAudioElement | null>(
      null,
    )


  const [
    musicEnabled,
    setMusicEnabled,
  ] =
    useState(true)


  const [
    sfxEnabled,
    setSfxEnabled,
  ] =
    useState(true)


  const [
    creditsOpen,
    setCreditsOpen,
  ] =
    useState(false)


  const [
    entranceVisible,
    setEntranceVisible,
  ] =
    useState(true)


  const [
    entranceLeaving,
    setEntranceLeaving,
  ] =
    useState(false)


  const t =
    UI_TEXT[
      language
    ]


  const changeLanguage = (
    nextLanguage:
      Language,
  ) => {

    setLanguage(
      nextLanguage,
    )


    if (
      typeof window !==
      'undefined'
    ) {
      window.localStorage.setItem(
        'decision-dungeon:language',
        nextLanguage,
      )
    }

  }



  useEffect(
    () => {

      if (
        musicRef.current
      ) {
        musicRef.current.volume =
          0.16
      }


      if (
        diceSoundRef.current
      ) {
        diceSoundRef.current.volume =
          0.72
      }

    },
    [],
  )


  /*
    Música ambiental:

    - El botón aparece como ON por defecto.
    - NO se reproduce al cargar la página.
    - NO se desbloquea con clicks o teclas generales.
    - La primera reproducción ocurre exclusivamente
      al pulsar ENTER THE DUNGEON dentro de enterDungeon().

    Así Chrome, Firefox y Edge tienen el mismo comportamiento.
  */


  /*
    Modal de créditos:
    - cierra con Escape;
    - bloquea el scroll mientras está abierto;
    - restaura el estado anterior al cerrar.
  */

  useEffect(
    () => {

      if (
        !creditsOpen
      ) {
        return
      }


      const previousOverflow =
        document.body.style.overflow


      const handleKeyDown = (
        event: KeyboardEvent,
      ) => {

        if (
          event.key === 'Escape'
        ) {
          setCreditsOpen(false)
        }

      }


      document.body.style.overflow =
        'hidden'

      window.addEventListener(
        'keydown',
        handleKeyDown,
      )


      return () => {

        document.body.style.overflow =
          previousOverflow

        window.removeEventListener(
          'keydown',
          handleKeyDown,
        )

      }

    },
    [
      creditsOpen,
    ],
  )


  const enterDungeon = async () => {

    /*
      ÚNICO punto de arranque inicial de la música.

      Este click es una interacción explícita del usuario,
      así que Firefox / Chrome / Edge pueden reproducir
      audio con sonido de forma confiable y consistente.
    */

    const audio =
      musicRef.current


    if (
      musicEnabled &&
      audio
    ) {

      try {

        audio.currentTime =
          0

        await audio.play()

      }
      catch {

        /*
          Si algún navegador igualmente lo rechaza,
          la app entra normalmente y el control de música
          sigue disponible.
        */

      }

    }


    setEntranceLeaving(true)


    window.setTimeout(
      () => {

        setEntranceVisible(false)

      },
      700,
    )

  }


  const toggleMusic =
    async () => {

      const audio =
        musicRef.current


      if (
        !audio
      ) {
        return
      }


      if (
        musicEnabled
      ) {

        audio.pause()

        setMusicEnabled(false)

        return
      }


      try {

        await audio.play()

        setMusicEnabled(true)

      }
      catch {

        setMusicEnabled(false)

      }

    }


  const playDiceSound = () => {

    if (
      !sfxEnabled
    ) {
      return
    }


    /*
      El sonido entra después del click para acompañar mejor
      el momento en que el D20 ya está en movimiento y empieza
      a golpear visualmente. Delay actual: 600 ms.
    */

    window.setTimeout(
      () => {

        const audio =
          diceSoundRef.current


        if (
          !audio
        ) {
          return
        }


        audio.currentTime =
          0


        void audio
          .play()
          .catch(
            () => {},
          )

      },
      700,
    )

  }


  const toggleSfx = () => {

    setSfxEnabled(
      current =>
        !current,
    )

  }



  /*
    La pregunta sugerida se decide una sola vez
    por carga de página.

    Si el usuario cambia EN / ES durante esa visita,
    conserva el mismo ejemplo pero traducido.
  */

  const [
    questionPlaceholderIndex,
  ] =
    useState(
      () =>
        getFreshQuestionIndex(),
    )


  const questionPlaceholder =
    QUESTION_EXAMPLES[
      language
    ][
      questionPlaceholderIndex
    ]


  const [
    newOption,
    setNewOption,
  ] =
    useState('')


  const [
    options,
    setOptions,
  ] =
    useState<string[]>([])


  const [
    result,
    setResult,
  ] =
    useState('')


  const [
    isRolling,
    setIsRolling,
  ] =
    useState(false)


  const [
    diceNumber,
    setDiceNumber,
  ] =
    useState<number>(20)


  /*
    Estado del modo BEST OF 3.

    Mecánica:
    - La tirada actual se convierte en el primer contendiente.
    - Una segunda tirada elige un contendiente distinto.
    - La tercera tirada decide 50/50 entre ambos.
    - El D20 termina mostrando el número ORIGINAL
      de la opción ganadora.
  */

  type BestOfThreeContender = {
    number: number
    option: string
  }


  type BestOfThreePhase =
    | 'idle'
    | 'first'
    | 'second'
    | 'final'
    | 'done'


  const [
    bestOfThreeFirst,
    setBestOfThreeFirst,
  ] =
    useState<
      BestOfThreeContender | null
    >(null)


  const [
    bestOfThreeSecond,
    setBestOfThreeSecond,
  ] =
    useState<
      BestOfThreeContender | null
    >(null)


  const [
    bestOfThreePhase,
    setBestOfThreePhase,
  ] =
    useState<BestOfThreePhase>(
      'idle',
    )


  const [
    isBestOfThreeResult,
    setIsBestOfThreeResult,
  ] =
    useState(false)


  /*
    Fase visual de las runas internas.

    Cambia automáticamente para que los símbolos
    del escenario parezcan estar "leyendo" el destino.
  */

  const [
    runePhase,
    setRunePhase,
  ] =
    useState(0)


  useEffect(
    () => {

      const intervalId =
        window.setInterval(
          () => {

            setRunePhase(
              current =>
                (
                  current + 1
                ) %
                ARCANE_RUNES.length,
            )

          },
          1350,
        )


      return () =>
        window.clearInterval(
          intervalId,
        )

    },
    [],
  )



  /* ==================================================
     3. AGREGAR OPCIÓN
  ================================================== */

  const addOption = () => {

    const cleanOption =
      newOption.trim()


    if (!cleanOption) {
      return
    }


    if (
      options.length >= 20
    ) {
      return
    }


    setOptions(
      currentOptions => [
        ...currentOptions,
        cleanOption,
      ],
    )


    /*
      Si cambia la lista,
      el resultado anterior deja de ser válido.
    */

    setResult('')


    setBestOfThreeFirst(null)

    setBestOfThreeSecond(null)

    setBestOfThreePhase('idle')

    setIsBestOfThreeResult(false)


    setNewOption('')

  }



  /* ==================================================
     4. ELIMINAR OPCIÓN
  ================================================== */

  const removeOption = (
    indexToRemove: number,
  ) => {

    setOptions(
      currentOptions =>
        currentOptions.filter(
          (_, index) =>
            index !==
            indexToRemove,
        ),
    )


    setResult('')


    setBestOfThreeFirst(null)

    setBestOfThreeSecond(null)

    setBestOfThreePhase('idle')

    setIsBestOfThreeResult(false)


  }



  /* ==================================================
     5. TIRAR EL DADO

     El resultado máximo coincide con la cantidad
     de opciones.

     5 opciones → números posibles 1–5.

     El número del D20 coincide directamente
     con la opción ganadora.
  ================================================== */

  const rollDice = () => {

    if (
      !question.trim() ||
      options.length < 2 ||
      isRolling
    ) {
      return
    }


    const rollingOptions = [
      ...options,
    ]


    playDiceSound()


    /*
      Una tirada normal empieza una resolución nueva,
      así que limpiamos cualquier Best of 3 anterior.
    */


    setBestOfThreeFirst(null)

    setBestOfThreeSecond(null)

    setBestOfThreePhase('idle')

    setIsBestOfThreeResult(false)


    setIsRolling(true)

    setResult('')


    window.setTimeout(
      () => {

        const finalDiceNumber =
          Math.floor(
            Math.random() *
              rollingOptions.length,
          ) + 1


        setDiceNumber(
          finalDiceNumber,
        )


        const selectedOption =
          rollingOptions[
            finalDiceNumber - 1
          ]


        setResult(
          selectedOption,
        )

        setIsRolling(false)

      },

      1200,
    )

  }



  /* ==================================================
     5.1 BEST OF 3

     La tirada que ya está visible cuenta como ronda 1.

     Después hacemos DOS tiradas adicionales.

     Regla:
     - La opción que aparezca más veces gana.
     - Si las tres tiradas son diferentes,
       la tercera tirada rompe el empate.

     De esta forma Best of 3 funciona incluso cuando
     hay más de dos opciones.
  ================================================== */

  const rollBestOfThree =
    async () => {

      if (
        !result ||
        options.length < 2 ||
        isRolling
      ) {
        return
      }


      const rollingOptions = [
        ...options,
      ]


      /*
        La tirada actual pasa a ser
        el PRIMER CONTENDIENTE.
      */

      const firstContender:
        BestOfThreeContender = {
          number:
            diceNumber,

          option:
            rollingOptions[
              diceNumber - 1
            ] ?? result,
        }


      setBestOfThreeFirst(
        firstContender,
      )

      setBestOfThreeSecond(
        null,
      )

      setBestOfThreePhase(
        'first',
      )

      setIsBestOfThreeResult(
        false,
      )

      setResult('')


      /*
        Pequeña pausa ceremonial:
        mostramos primero quién quedó
        como primer contendiente.
      */

      await new Promise<void>(
        resolve => {

          window.setTimeout(
            resolve,
            650,
          )

        },
      )


      /*
        SEGUNDO CONTENDIENTE

        Tiramos entre todas las opciones,
        pero repetimos si sale el mismo número
        del primer contendiente.
      */

      setBestOfThreePhase(
        'second',
      )


      playDiceSound()


      setIsRolling(
        true,
      )


      await new Promise<void>(
        resolve => {

          window.setTimeout(
            resolve,
            1200,
          )

        },
      )


      let secondNumber =
        Math.floor(
          Math.random() *
            rollingOptions.length,
        ) + 1


      while (
        secondNumber ===
        firstContender.number
      ) {

        secondNumber =
          Math.floor(
            Math.random() *
              rollingOptions.length,
          ) + 1

      }


      const secondContender:
        BestOfThreeContender = {
          number:
            secondNumber,

          option:
            rollingOptions[
              secondNumber - 1
            ],
        }


      setDiceNumber(
        secondNumber,
      )

      setBestOfThreeSecond(
        secondContender,
      )

      setIsRolling(
        false,
      )


      /*
        Dejamos ver el segundo contendiente
        antes del duelo final.
      */

      await new Promise<void>(
        resolve => {

          window.setTimeout(
            resolve,
            700,
          )

        },
      )


      /*
        FINAL ROLL

        La tercera tirada ya NO vuelve
        a recorrer todas las opciones.

        Es un 50/50 entre los dos finalistas.
      */

      setBestOfThreePhase(
        'final',
      )


      playDiceSound()


      setIsRolling(
        true,
      )


      await new Promise<void>(
        resolve => {

          window.setTimeout(
            resolve,
            1200,
          )

        },
      )


      const winner =
        Math.random() < 0.5
          ? firstContender
          : secondContender


      /*
        El dado aterriza mostrando el número
        ORIGINAL de la opción ganadora.
      */

      setDiceNumber(
        winner.number,
      )

      setResult(
        winner.option,
      )

      setBestOfThreePhase(
        'done',
      )

      setIsBestOfThreeResult(
        true,
      )

      setIsRolling(
        false,
      )

    }



  /* ==================================================
     6. TEXTOS DINÁMICOS
  ================================================== */

  const displayedQuestion =
    question.trim()


  const hasQuestion =
    displayedQuestion.length >
    0


  const canRoll =
    hasQuestion &&
    options.length >= 2 &&
    !isRolling



  const fateTitle =
    bestOfThreePhase === 'first'
      ? t.firstContender
      : bestOfThreePhase === 'second'
        ? t.secondContender
        : bestOfThreePhase === 'final'
          ? t.finalRoll
          : isRolling
            ? t.fateIsDeciding
            : result
              ? t.diceHaveSpoken
              : t.awaitingFate


  const fateSubtitle =
    bestOfThreePhase === 'first' &&
    bestOfThreeFirst
      ? t.firstContenderEnters(
          bestOfThreeFirst.option,
        )
      : bestOfThreePhase === 'second'
        ? t.rivalSummoned
        : bestOfThreePhase === 'final' &&
          bestOfThreeFirst &&
          bestOfThreeSecond
          ? t.versus(
              bestOfThreeFirst.option,
              bestOfThreeSecond.option,
            )
          : isRolling
            ? t.weighingPaths
            : result
              ? isBestOfThreeResult
                ? t.duelResolved
                : t.pathRevealed
              : !hasQuestion
                ? t.needQuestion
                : options.length < 2
                  ? t.needChoices
                  : t.ready





  const updateQuestion = (
    value: string,
  ) => {

    setQuestion(
      value,
    )

    /*
      Una pregunta nueva invalida
      la decisión anterior.
    */

    setResult('')


    setBestOfThreeFirst(null)

    setBestOfThreeSecond(null)

    setBestOfThreePhase('idle')

    setIsBestOfThreeResult(false)


  }



  /* ==================================================
     8. INTERFAZ
  ================================================== */

  return (

    <main
      className={
        `app ${
          isRolling
            ? 'app--rolling'
            : ''
        }`
      }
    >

      {
        entranceVisible &&
        (

          <div
            className={
              entranceLeaving
                ? 'dungeon-entrance dungeon-entrance--leaving'
                : 'dungeon-entrance'
            }
          >

            {/* ----------------------------------------------
                IDIOMA — LANDING
                Cambia la traducción sin iniciar la música.
            ---------------------------------------------- */}

            <div
              className="dungeon-entrance-language"
              aria-label="Language selector"
            >

              <button
                type="button"
                className={
                  language === 'en'
                    ? 'entrance-language-button entrance-language-button--active'
                    : 'entrance-language-button'
                }
                aria-pressed={
                  language === 'en'
                }
                onClick={
                  () =>
                    changeLanguage(
                      'en',
                    )
                }
              >
                EN
              </button>


              <span
                className="entrance-language-divider"
                aria-hidden="true"
              >
                /
              </span>


              <button
                type="button"
                className={
                  language === 'es'
                    ? 'entrance-language-button entrance-language-button--active'
                    : 'entrance-language-button'
                }
                aria-pressed={
                  language === 'es'
                }
                onClick={
                  () =>
                    changeLanguage(
                      'es',
                    )
                }
              >
                ES
              </button>

            </div>


            <div
              className="dungeon-entrance-stars"
              aria-hidden="true"
            />


            <div className="dungeon-entrance-content">

              <div
                className="dungeon-entrance-sigil"
                aria-hidden="true"
              >
                <span>✦</span>
              </div>


              <h1 className="dungeon-entrance-title">
                Decision Dungeon
              </h1>


              <p className="dungeon-entrance-tagline">
                {t.entranceTagline}
              </p>


              <button
                type="button"
                className="dungeon-entrance-button"
                onClick={
                  () =>
                    void enterDungeon()
                }
              >
                <span
                  className="dungeon-entrance-button-rune"
                  aria-hidden="true"
                >
                  ◈
                </span>

                {t.enterDungeon}

                <span
                  className="dungeon-entrance-button-rune"
                  aria-hidden="true"
                >
                  ◈
                </span>
              </button>


              <span
                className="dungeon-entrance-hint"
                aria-hidden="true"
              >
                ── ✦ ──
              </span>

            </div>

          </div>

        )
      }



      <audio
        ref={musicRef}
        src="/audio/dungeon-ambience.mp3"
        loop
        preload="auto"
      />


      <audio
        ref={diceSoundRef}
        src="/audio/dice-roll.mp3"
        preload="auto"
      />


      {/* ==================================================
          8.1 MUNDO EXTERIOR

          Todo esto vive FUERA del shell principal.

          Así llenamos los márgenes izquierdo y derecho
          sin agrandar la interfaz central.
      ================================================== */}


      {/* --------------------------------------------------
          NEBULOSAS / LUCES EXTERIORES
      -------------------------------------------------- */}

      <div
        className="
          world-nebula
          world-nebula--left
        "
        aria-hidden="true"
      />


      <div
        className="
          world-nebula
          world-nebula--right
        "
        aria-hidden="true"
      />



      {/* --------------------------------------------------
          ASTROLABIOS PNG — ROTACIÓN CSS REAL

          Ya no usamos:
          - arcane-left.webm
          - arcane-right.webm
          - crossfades
          - reinicios de video

          Cada PNG es un disco independiente y centrado.
          CSS lo hace girar continuamente, así que 0° y 360°
          son exactamente la misma posición y no hay saltos.
      -------------------------------------------------- */}

      <div
        className="
          world-astrolabe-wrap
          world-astrolabe-wrap--left
        "
        aria-hidden="true"
      >
        <img
          className="
            world-astrolabe
            world-astrolabe--left
          "
          src="/images/astrolabe-left.png"
          alt=""
          draggable="false"
        />
      </div>


      <div
        className="
          world-astrolabe-wrap
          world-astrolabe-wrap--right
        "
        aria-hidden="true"
      >
        <img
          className="
            world-astrolabe
            world-astrolabe--right
          "
          src="/images/astrolabe-right.png"
          alt=""
          draggable="false"
        />
      </div>



      {/* --------------------------------------------------
          NUBES DE RUNAS — ESTILO ARCANO DISPERSO

          Inspiradas en la referencia visual:
          - arriba derecha: azul / cyan
          - abajo izquierda: violeta / azul
          - sin órbitas rígidas
          - cada runa tiene posición, tamaño, blur,
            opacidad, rotación y velocidad propias
      -------------------------------------------------- */}

      <div
        className="
          rune-cloud
          rune-cloud--bottom-left
        "
        aria-hidden="true"
      >
        {ARCANE_RUNES
          .slice(
            0,
            12,
          )
          .map(
            (
              rune,
              index,
            ) => {

              const bottomLeftRunes = [
                { x: 8,  y: 18, size: 42, blur: 1.8, opacity: 0.82, rotate: -18, driftX: 10,  driftY: -18, duration: 7.8,  delay: -1.2 },
                { x: 24, y: 10, size: 24, blur: 0.4, opacity: 0.56, rotate: 11,  driftX: -8,  driftY: -10, duration: 9.4,  delay: -3.4 },
                { x: 18, y: 38, size: 34, blur: 1.2, opacity: 0.90, rotate: 7,   driftX: 9,   driftY: -13, duration: 8.1,  delay: -2.1 },
                { x: 4,  y: 54, size: 18, blur: 0,   opacity: 0.48, rotate: -9,  driftX: 5,   driftY: -7,  duration: 10.6, delay: -5.2 },
                { x: 34, y: 52, size: 54, blur: 2.4, opacity: 0.70, rotate: 16,  driftX: -12, driftY: -16, duration: 8.9,  delay: -0.9 },
                { x: 12, y: 72, size: 29, blur: 0.6, opacity: 0.82, rotate: -14, driftX: 8,   driftY: -11, duration: 9.8,  delay: -4.3 },
                { x: 42, y: 68, size: 20, blur: 0,   opacity: 0.54, rotate: 5,   driftX: -6,  driftY: -8,  duration: 11.2, delay: -2.8 },
                { x: 27, y: 86, size: 46, blur: 2.1, opacity: 0.76, rotate: -5,  driftX: 12,  driftY: -15, duration: 8.6,  delay: -6.1 },
                { x: 55, y: 82, size: 17, blur: 0,   opacity: 0.44, rotate: 13,  driftX: -5,  driftY: -7,  duration: 10.9, delay: -1.7 },
                { x: 48, y: 34, size: 23, blur: 0.2, opacity: 0.62, rotate: -3,  driftX: 7,   driftY: -10, duration: 9.1,  delay: -4.8 },
                { x: 62, y: 56, size: 33, blur: 1.1, opacity: 0.66, rotate: 9,   driftX: -9,  driftY: -12, duration: 8.4,  delay: -3.1 },
                { x: 70, y: 76, size: 16, blur: 0,   opacity: 0.40, rotate: -11, driftX: 4,   driftY: -6,  duration: 11.8, delay: -5.8 },
              ]

              const data =
                bottomLeftRunes[index]

              return (

                <span
                  className="rune-cloud-glyph"
                  style={{
                    '--rune-x':
                      `${data.x}%`,
                    '--rune-y':
                      `${data.y}%`,
                    '--rune-size':
                      `${data.size}px`,
                    '--rune-blur':
                      `${data.blur}px`,
                    '--rune-opacity':
                      data.opacity,
                    '--rune-rotate':
                      `${data.rotate}deg`,
                    '--rune-drift-x':
                      `${data.driftX}px`,
                    '--rune-drift-y':
                      `${data.driftY}px`,
                    '--rune-duration':
                      `${data.duration}s`,
                    '--rune-delay':
                      `${data.delay}s`,
                  } as CSSProperties}
                  key={`rune-cloud-bottom-${index}`}
                >
                  {rune}
                </span>

              )
            },
          )}
      </div>


      <div
        className="
          rune-cloud
          rune-cloud--top-right
        "
        aria-hidden="true"
      >
        {ARCANE_RUNES
          .slice(
            8,
            20,
          )
          .map(
            (
              rune,
              index,
            ) => {

              const topRightRunes = [
                { x: 18, y: 10, size: 18, blur: 0,   opacity: 0.44, rotate: -8,  driftX: 5,   driftY: 8,  duration: 11.1, delay: -3.2 },
                { x: 38, y: 4,  size: 26, blur: 0.5, opacity: 0.60, rotate: 9,   driftX: -7,  driftY: 12, duration: 9.8,  delay: -5.1 },
                { x: 62, y: 14, size: 48, blur: 1.7, opacity: 0.86, rotate: 13,  driftX: -12, driftY: 17, duration: 7.9,  delay: -1.4 },
                { x: 82, y: 8,  size: 20, blur: 0,   opacity: 0.42, rotate: -12, driftX: 5,   driftY: 8,  duration: 11.5, delay: -4.7 },
                { x: 26, y: 34, size: 32, blur: 0.6, opacity: 0.72, rotate: -5,  driftX: 8,   driftY: 13, duration: 9.2,  delay: -2.6 },
                { x: 50, y: 40, size: 62, blur: 2.5, opacity: 0.76, rotate: 8,   driftX: -11, driftY: 18, duration: 8.3,  delay: -6.0 },
                { x: 76, y: 33, size: 29, blur: 0.8, opacity: 0.68, rotate: -16, driftX: 9,   driftY: 11, duration: 9.7,  delay: -0.7 },
                { x: 14, y: 58, size: 21, blur: 0,   opacity: 0.46, rotate: 11,  driftX: -4,  driftY: 7,  duration: 10.8, delay: -3.9 },
                { x: 40, y: 67, size: 38, blur: 1.4, opacity: 0.80, rotate: -7,  driftX: 10,  driftY: 14, duration: 8.8,  delay: -2.0 },
                { x: 67, y: 61, size: 24, blur: 0.2, opacity: 0.58, rotate: 6,   driftX: -6,  driftY: 9,  duration: 10.2, delay: -5.6 },
                { x: 87, y: 70, size: 44, blur: 1.9, opacity: 0.68, rotate: 15,  driftX: -10, driftY: 15, duration: 8.5,  delay: -1.1 },
                { x: 54, y: 88, size: 18, blur: 0,   opacity: 0.42, rotate: -10, driftX: 4,   driftY: 6,  duration: 11.7, delay: -4.4 },
              ]

              const data =
                topRightRunes[index]

              return (

                <span
                  className="rune-cloud-glyph"
                  style={{
                    '--rune-x':
                      `${data.x}%`,
                    '--rune-y':
                      `${data.y}%`,
                    '--rune-size':
                      `${data.size}px`,
                    '--rune-blur':
                      `${data.blur}px`,
                    '--rune-opacity':
                      data.opacity,
                    '--rune-rotate':
                      `${data.rotate}deg`,
                    '--rune-drift-x':
                      `${data.driftX}px`,
                    '--rune-drift-y':
                      `${data.driftY}px`,
                    '--rune-duration':
                      `${data.duration}s`,
                    '--rune-delay':
                      `${data.delay}s`,
                  } as CSSProperties}
                  key={`rune-cloud-top-${index}`}
                >
                  {rune}
                </span>

              )
            },
          )}
      </div>



      {/* --------------------------------------------------
          ÓRBITA SECUNDARIA — MARGEN SUPERIOR DERECHO

          Rellena el espacio vacío de arriba a la derecha
          sin competir con el astrolabio principal.

          Números dorados y runas azules giran en sentidos
          opuestos, igual que en el lateral izquierdo.
      -------------------------------------------------- */}

      <div
        className="right-orbit-field"
        aria-hidden="true"
      >

        <div className="right-orbit right-orbit--numbers">

          {
            Array.from(
              {
                length: 12,
              },
              (
                _,
                index,
              ) =>
                index + 1,
            ).map(
              (
                number,
                index,
              ) => (

                <span
                  className="right-orbit-glyph right-orbit-glyph--number"
                  style={
                    {
                      '--orbit-index':
                        index,

                      '--orbit-total':
                        12,
                    } as CSSProperties
                  }
                  key={
                    `right-orbit-number-${number}`
                  }
                >
                  {number}
                </span>

              ),
            )
          }

        </div>


        <div className="right-orbit right-orbit--runes">

          {
            ARCANE_RUNES
              .slice(
                0,
                12,
              )
              .map(
                (
                  rune,
                  index,
                ) => (

                  <span
                    className="right-orbit-glyph right-orbit-glyph--rune"
                    style={
                      {
                        '--orbit-index':
                          index,

                        '--orbit-total':
                          12,
                      } as CSSProperties
                    }
                    key={
                      `right-orbit-rune-${index}`
                    }
                  >
                    {rune}
                  </span>

                ),
              )
          }

        </div>


        <span className="right-orbit-star right-orbit-star--1">
          ✦
        </span>

        <span className="right-orbit-star right-orbit-star--2">
          ✧
        </span>

        <span className="right-orbit-star right-orbit-star--3">
          ✦
        </span>

      </div>



      {/* --------------------------------------------------
          ESTRELLAS EXTERIORES
      -------------------------------------------------- */}

      <div
        className="world-stars"
        aria-hidden="true"
      >

        {
          Array.from(
            {
              length: 40,
            },
          ).map(
            (
              _,
              index,
            ) => (

              <span
                className={
                  `world-star world-star--${index + 1}`
                }
                key={index}
              />

            ),
          )
        }

      </div>



      {/* ==================================================
          SHELL CENTRAL
      ================================================== */}

      <section className="dungeon-shell">


        {/* ==================================================
            8.2 PANEL IZQUIERDO
        ================================================== */}

        <aside className="setup-panel">


          <header className="brand">

            <div
              className="brand-symbol"
              aria-hidden="true"
            >
              <span>
                ◇
              </span>
            </div>


            <div className="brand-copy">

              <h1>
                Decision Dungeon
              </h1>

              <p>
                {t.tagline}
              </p>

            </div>

          </header>


          <div className="divider" />



          {/* --------------------------------------------------
              PREGUNTA
          -------------------------------------------------- */}

          <section className="setup-section">

            <label
              className="section-title"
              htmlFor="question"
            >
              {t.questionTitle}
            </label>


            <input
              id="question"
              className="dungeon-input"
              type="text"
              placeholder={questionPlaceholder}
              value={question}
              onChange={
                event =>
                  updateQuestion(
                    event.target.value,
                  )
              }
            />


            {
              !hasQuestion &&
              (
                <p className="question-required">
                  {t.questionRequired}
                </p>
              )
            }

          </section>



          {/* --------------------------------------------------
              OPCIONES
          -------------------------------------------------- */}

          <section className="setup-section setup-section--choices">

            <h2 className="section-title">
              ⚔ {t.choicesTitle}
            </h2>


            <div
              className={
                `option-input ${
                  options.length >= 20
                    ? 'option-input--full'
                    : ''
                }`
              }
            >

              <input
                className="dungeon-input"
                type="text"
                placeholder={
                  options.length >= 20
                    ? t.maxChoices
                    : t.addChoice
                }
                value={newOption}
                disabled={
                  options.length >= 20
                }
                onChange={
                  event =>
                    setNewOption(
                      event.target.value,
                    )
                }
                onKeyDown={
                  event => {

                    if (
                      event.key ===
                      'Enter'
                    ) {
                      addOption()
                    }

                  }
                }
              />


              {
                options.length < 20 &&
                (
                  <button
                    className="add-button"
                    type="button"
                    onClick={addOption}
                  >
                    {t.add}
                  </button>
                )
              }

            </div>



            {/* --------------------------------------------------
                LISTA SCROLLEABLE
            -------------------------------------------------- */}

            <div className="options-scroll">

              <div className="options-list">

                {
                  options.map(
                    (
                      option,
                      index,
                    ) => (

                      <div
                        className="choice-card"
                        key={
                          `${option}-${index}`
                        }
                      >

                        <span className="choice-number">
                          {index + 1}
                        </span>


                        <span className="choice-name">
                          {option}
                        </span>


                        <button
                          className="remove-button"
                          type="button"
                          aria-label={
                            `${t.remove} ${option}`
                          }
                          onClick={
                            () =>
                              removeOption(
                                index,
                              )
                          }
                        >
                          ×
                        </button>

                      </div>

                    ),
                  )
                }

              </div>

            </div>


            <p className="choice-hint">

              ⓘ {options.length}/20 {t.choices}

              {
                !hasQuestion
                  ? ` — ${t.questionRequiredShort}`
                  : options.length < 2
                    ? ` — ${t.addTwoChoices}`
                    : ''
              }

            </p>

          </section>

        </aside>



        {/* ==================================================
            8.3 PANEL DERECHO
        ================================================== */}

        <section
          className={
            `fate-panel ${
              isRolling
                ? 'fate-panel--rolling'
                : ''
            } ${
              result
                ? 'fate-panel--revealed'
                : ''
            }`
          }
        >


          <div
            className="audio-controls"
            aria-label="Audio controls"
          >

            <button
              type="button"
              className={
                `audio-control ${
                  musicEnabled
                    ? 'audio-control--active'
                    : ''
                }`
              }
              aria-pressed={musicEnabled}
              aria-label={t.music}
              title={t.music}
              onClick={toggleMusic}
            >
              {
                musicEnabled
                  ? '♫'
                  : '♪'
              }
            </button>


            <button
              type="button"
              className={
                `audio-control ${
                  sfxEnabled
                    ? 'audio-control--active'
                    : ''
                }`
              }
              aria-pressed={sfxEnabled}
              aria-label={t.soundEffects}
              title={t.soundEffects}
              onClick={toggleSfx}
            >
              {
                sfxEnabled
                  ? '◆'
                  : '◇'
              }
            </button>

          </div>


          <div
            className="language-switch language-switch--corner"
            aria-label="Language selector"
          >

            <button
              type="button"
              className={
                language === 'en'
                  ? 'language-button language-button--active'
                  : 'language-button'
              }
              aria-pressed={
                language === 'en'
              }
              onClick={
                () =>
                  changeLanguage(
                    'en',
                  )
              }
            >
              EN
            </button>


            <span
              className="language-divider"
              aria-hidden="true"
            >
              /
            </span>


            <button
              type="button"
              className={
                language === 'es'
                  ? 'language-button language-button--active'
                  : 'language-button'
              }
              aria-pressed={
                language === 'es'
              }
              onClick={
                () =>
                  changeLanguage(
                    'es',
                  )
              }
            >
              ES
            </button>

          </div>


          <div className="fate-heading">

            <span
              className="ornament"
              aria-hidden="true"
            >
              ───── ✦ ─────
            </span>


            <h2
              className="fate-title"
              key={fateTitle}
            >
              {fateTitle}
            </h2>


            <p className="fate-subtitle">
              {fateSubtitle}
            </p>

          </div>



          {/* --------------------------------------------------
              PREGUNTA IMPRESA
          -------------------------------------------------- */}

          <div
            className={
              `fate-question ${
                hasQuestion
                  ? ''
                  : 'fate-question--empty'
              }`
            }
          >

            <span className="fate-question-label">
              {t.theQuestion}
            </span>

            <p>
              {
                hasQuestion
                  ? `“${displayedQuestion}”`
                  : t.waitingQuestion
              }
            </p>

          </div>



          {/* --------------------------------------------------
              ESCENARIO DEL D20
          -------------------------------------------------- */}

          <div className="dice-stage">


            {/* ----------------------------------------------
                ESTRELLAS Y PARTÍCULAS CERCA DEL DADO
            ---------------------------------------------- */}

            <div
              className="magic-particles"
              aria-hidden="true"
            >

              {
                Array.from(
                  {
                    length: 30,
                  },
                ).map(
                  (
                    _,
                    index,
                  ) => (

                    <span
                      className={
                        `magic-particle magic-particle--${index + 1}`
                      }
                      key={index}
                    />

                  ),
                )
              }

            </div>



            {/* ----------------------------------------------
                VORTEX ANIMADO

                También queda en loop permanente.
                Vive detrás del D20.
            ---------------------------------------------- */}

            <SeamlessVideo
              className="dice-vortex"
              src="/effects/dice-vortex.webm"
              crossfade={0.7}
            />


            {/* ----------------------------------------------
                CUATRO SELLOS RÚNICOS DINÁMICOS
            ---------------------------------------------- */}

            <div
              className="rune-sigils"
              aria-hidden="true"
            >
              <span className="rune-sigil rune-sigil--top-left">
                {ARCANE_RUNES[runePhase]}
              </span>

              <span className="rune-sigil rune-sigil--top-right">
                {
                  ARCANE_RUNES[
                    (runePhase + 5) %
                    ARCANE_RUNES.length
                  ]
                }
              </span>

              <span className="rune-sigil rune-sigil--bottom-left">
                {
                  ARCANE_RUNES[
                    (runePhase + 10) %
                    ARCANE_RUNES.length
                  ]
                }
              </span>

              <span className="rune-sigil rune-sigil--bottom-right">
                {
                  ARCANE_RUNES[
                    (runePhase + 15) %
                    ARCANE_RUNES.length
                  ]
                }
              </span>
            </div>



            <D20
              number={diceNumber}
              isRolling={isRolling}
            />

          </div>



          {/* --------------------------------------------------
              BOTÓN PRINCIPAL
          -------------------------------------------------- */}

          <button
            className="roll-button"
            type="button"
            disabled={
              !canRoll
            }
            onClick={rollDice}
          >

            <span aria-hidden="true">
              🎲
            </span>

            {
              isRolling
                ? t.rolling
                : result
                  ? t.rollAgain
                  : t.rollDice
            }

          </button>



          <div className="secondary-actions secondary-actions--single">

            <button
              type="button"
              disabled={
                !result ||
                isRolling
              }
              onClick={
                rollBestOfThree
              }
              title={t.bestOfThreeTitle}
            >
              🏆 {t.bestOfThree}
            </button>


          </div>



          {/* --------------------------------------------------
              RESULTADO
          -------------------------------------------------- */}

          {
            result &&
            !isRolling &&
            (

              <div
                className={
                  `result-card ${
                    isBestOfThreeResult
                      ? 'result-card--best-of-three'
                      : ''
                  }`
                }
                key={
                  `${result}-${isBestOfThreeResult}`
                }
              >

                <span className="result-eyebrow">
                  {
                    isBestOfThreeResult
                      ? t.bestOfThreeChose
                      : t.fateChose
                  }
                </span>


                <h3>
                  ✦ {result} ✦
                </h3>


                {
                  isBestOfThreeResult &&
                  bestOfThreeFirst &&
                  bestOfThreeSecond
                    ? (

                      <div
                        className="duel-result"
                        aria-label={t.finalistsAria}
                      >

                        <div
                          className={
                            `duel-contender ${
                              bestOfThreeFirst.option === result
                                ? 'duel-contender--winner'
                                : ''
                            }`
                          }
                        >
                          <span className="duel-label">
                            {t.firstContenderLabel}
                          </span>

                          <strong>
                            #{bestOfThreeFirst.number}
                          </strong>

                          <span>
                            {bestOfThreeFirst.option}
                          </span>
                        </div>


                        <div className="duel-versus">
                          ⚔
                        </div>


                        <div
                          className={
                            `duel-contender ${
                              bestOfThreeSecond.option === result
                                ? 'duel-contender--winner'
                                : ''
                            }`
                          }
                        >
                          <span className="duel-label">
                            {t.secondContenderLabel}
                          </span>

                          <strong>
                            #{bestOfThreeSecond.number}
                          </strong>

                          <span>
                            {bestOfThreeSecond.option}
                          </span>
                        </div>

                      </div>

                    )
                    : null
                }


                <p>
                  {
                    isBestOfThreeResult
                      ? t.finalChose
                      : t.dungeonPath
                  }
                </p>

              </div>

            )
          }





          {/* ==================================================
              8.4 CRÉDITOS
          ================================================== */}

          <footer className="credits">

            <button
              type="button"
              className="credits-trigger"
              onClick={
                () =>
                  setCreditsOpen(true)
              }
            >
              {t.credits}
            </button>

          </footer>

        </section>

      </section>


      {
        creditsOpen &&
        (

          <div
            className="credits-modal-backdrop"
            role="presentation"
            onMouseDown={
              event => {

                if (
                  event.target ===
                  event.currentTarget
                ) {
                  setCreditsOpen(false)
                }

              }
            }
          >

            <section
              className="credits-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="credits-modal-title"
            >

              <button
                type="button"
                className="credits-modal-close"
                aria-label={t.closeCredits}
                title={t.closeCredits}
                onClick={
                  () =>
                    setCreditsOpen(false)
                }
              >
                ×
              </button>


              <div className="credits-modal-heading">

                <span
                  className="credits-modal-ornament"
                  aria-hidden="true"
                >
                  ── ✦ ──
                </span>

                <h2 id="credits-modal-title">
                  {t.creditsTitle}
                </h2>

              </div>


              <div className="credits-modal-content">

                <article className="credit-entry">

                  <span className="credit-entry-label">
                    {t.development}
                  </span>

                  <strong>
                    {t.developedBy} Edgardo Villalba
                  </strong>

                  <span className="credit-entry-meta">
                    Decision Dungeon
                  </span>

                </article>


                <article className="credit-entry">

                  <span className="credit-entry-label">
                    {t.musicCredit}
                  </span>

                  <strong>
                    “Fantasy Medieval Ambient”
                  </strong>

                  <span className="credit-entry-meta">
                    {language === 'es'
                      ? 'por'
                      : 'by'}{' '}

                    <a
                      href="https://pixabay.com/users/deuslower-45666444/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      DeusLower
                    </a>
                  </span>

                  <span className="credit-entry-meta">
                    {t.source}:{' '}

                    <a
                      href="https://pixabay.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pixabay
                    </a>

                    {' · '}

                    <a
                      href="https://pixabay.com/service/license-summary/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pixabay Content License
                    </a>
                  </span>

                </article>


                <article className="credit-entry">

                  <span className="credit-entry-label">
                    {t.diceSoundCredit}
                  </span>

                  <strong>
                    “RPG Dice, Rolling”
                  </strong>

                  <span className="credit-entry-meta">
                    {language === 'es'
                      ? 'por'
                      : 'by'}{' '}

                    <span>
                      brkdwnb3njo (Freesound)
                    </span>
                  </span>

                  <span className="credit-entry-meta">
                    {t.source}:{' '}

                    <a
                      href="https://pixabay.com/users/freesound_community-46691455/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pixabay / freesound_community
                    </a>

                    {' · '}

                    <a
                      href="https://pixabay.com/service/license-summary/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Pixabay Content License
                    </a>
                  </span>

                </article>


                <article className="credit-entry">

                  <span className="credit-entry-label">
                    {t.threeDAsset}
                  </span>

                  <strong>
                    “D20 Blue Metal Dice”
                  </strong>

                  <span className="credit-entry-meta">
                    {language === 'es'
                      ? 'por'
                      : 'by'}{' '}

                    <a
                      href="https://sketchfab.com/guimaraesmartinsguilherme"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Guilherme Guimaraes
                    </a>
                  </span>

                  <span className="credit-entry-meta">
                    {t.source}:{' '}

                    <a
                      href="https://sketchfab.com/3d-models/d20-blue-metal-dice-03a6d62b028241bfa11cd280665e3d43"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Sketchfab
                    </a>

                    {' · '}

                    {t.license}:{' '}

                    <a
                      href="https://creativecommons.org/licenses/by/4.0/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      CC BY 4.0
                    </a>
                  </span>

                </article>

              </div>

            </section>

          </div>

        )
      }

    </main>

  )

}


export default App