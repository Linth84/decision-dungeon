import {
  Canvas,
  useFrame,
} from '@react-three/fiber'

import {
  Environment,
  useGLTF,
} from '@react-three/drei'

import {
  useMemo,
  useRef,
} from 'react'

import {
  Box3,
  Matrix4,
  Mesh,
  Quaternion,
  Vector2,
  Vector3,
} from 'three'

import type {
  Group,
  Object3D,
} from 'three'


/* ==================================================
   ÍNDICE — D20.TSX

   1. Props
   2. Mapa número → cara real
   3. Helpers
   4. Buscar mesh
   5. Calcular orientación de una cara
   6. Preparar modelo y orientaciones
   7. Animación
      7.1 Inicio de tirada
      7.1.1 Idle antes de tirar
      7.2 Trayectoria de lanzamiento
      7.3 Aterrizaje
      7.4 Settling
      7.5 Snap final
   8. Escena
   9. Precarga
================================================== */


type D20Props = {
  number: number
  isRolling: boolean
}


/*
  Ruta compatible con subdirectorios de producción
  (por ejemplo GitHub Pages /decision-dungeon/).
*/
const D20_MODEL_URL =
  `${import.meta.env.BASE_URL}models/d20.glb`


/* ==================================================
   2. MAPA NÚMERO → CARA REAL

   Estas posiciones corresponden al GLB real.

   1  = calavera
   20 = símbolo especial
================================================== */

const NUMBER_TO_FACE:
  Record<number, number> = {
    1: 5,
    2: 12,
    3: 16,
    4: 18,
    5: 0,
    6: 2,
    7: 9,
    8: 19,
    9: 6,
    10: 1,
    11: 10,
    12: 13,
    13: 11,
    14: 3,
    15: 17,
    16: 7,
    17: 14,
    18: 8,
    19: 15,
    20: 4,
  }


/* ==================================================
   3. HELPERS
================================================== */

type Attribute2D = {
  getX: (index: number) => number
  getY: (index: number) => number
}


type Attribute3D =
  Attribute2D & {
    getZ: (index: number) => number
  }


function readVector3(
  attribute: Attribute3D,
  index: number,
) {
  return new Vector3(
    attribute.getX(index),
    attribute.getY(index),
    attribute.getZ(index),
  )
}


function readVector2(
  attribute: Attribute2D,
  index: number,
) {
  return new Vector2(
    attribute.getX(index),
    attribute.getY(index),
  )
}


/* ==================================================
   4. BUSCAR MESH
================================================== */

function findDiceMesh(
  root: Object3D,
): Mesh | null {

  const meshes: Mesh[] = []

  root.traverse(
    child => {

      const candidate =
        child as Mesh

      if (candidate.isMesh) {
        meshes.push(candidate)
      }

    },
  )

  return meshes[0] ?? null
}


/* ==================================================
   5. CALCULAR ORIENTACIÓN DE UNA CARA
================================================== */

function calculateFaceQuaternion(
  root: Object3D,
  faceIndex: number,
): Quaternion {

  root.updateMatrixWorld(true)

  const mesh =
    findDiceMesh(root)


  if (!mesh) {
    return new Quaternion()
  }


  const geometry =
    mesh.geometry

  const position =
    geometry.getAttribute('position')

  const uv =
    geometry.getAttribute('uv')

  const index =
    geometry.index


  if (
    !position ||
    !uv ||
    !index
  ) {
    return new Quaternion()
  }


  const triangleOffset =
    faceIndex * 3


  if (
    triangleOffset + 2 >=
    index.count
  ) {
    return new Quaternion()
  }


  const index0 =
    index.getX(triangleOffset)

  const index1 =
    index.getX(
      triangleOffset + 1,
    )

  const index2 =
    index.getX(
      triangleOffset + 2,
    )


  const p0 =
    readVector3(
      position,
      index0,
    )

  const p1 =
    readVector3(
      position,
      index1,
    )

  const p2 =
    readVector3(
      position,
      index2,
    )


  mesh.updateMatrixWorld(true)

  p0.applyMatrix4(
    mesh.matrixWorld,
  )

  p1.applyMatrix4(
    mesh.matrixWorld,
  )

  p2.applyMatrix4(
    mesh.matrixWorld,
  )


  const edge1 =
    new Vector3()
      .subVectors(
        p1,
        p0,
      )

  const edge2 =
    new Vector3()
      .subVectors(
        p2,
        p0,
      )


  const normal =
    new Vector3()
      .crossVectors(
        edge1,
        edge2,
      )
      .normalize()


  const uv0 =
    readVector2(
      uv,
      index0,
    )

  const uv1 =
    readVector2(
      uv,
      index1,
    )

  const uv2 =
    readVector2(
      uv,
      index2,
    )


  const duv1 =
    new Vector2()
      .subVectors(
        uv1,
        uv0,
      )

  const duv2 =
    new Vector2()
      .subVectors(
        uv2,
        uv0,
      )


  const determinant =
    (duv1.x * duv2.y) -
    (duv2.x * duv1.y)


  if (
    Math.abs(determinant) <
    0.000001
  ) {
    return new Quaternion()
      .setFromUnitVectors(
        normal,
        new Vector3(
          0,
          0,
          1,
        ),
      )
  }


  const inverseDeterminant =
    1 / determinant


  const textureV =
    new Vector3()
      .copy(edge1)
      .multiplyScalar(
        -duv2.x,
      )
      .addScaledVector(
        edge2,
        duv1.x,
      )
      .multiplyScalar(
        inverseDeterminant,
      )


  const faceUp =
    textureV
      .multiplyScalar(-1)


  faceUp.addScaledVector(
    normal,
    -faceUp.dot(normal),
  )

  faceUp.normalize()


  const faceRight =
    new Vector3()
      .crossVectors(
        faceUp,
        normal,
      )
      .normalize()


  faceUp
    .crossVectors(
      normal,
      faceRight,
    )
    .normalize()


  const faceBasis =
    new Matrix4()
      .makeBasis(
        faceRight,
        faceUp,
        normal,
      )


  const targetMatrix =
    faceBasis
      .clone()
      .invert()


  const quaternion =
    new Quaternion()
      .setFromRotationMatrix(
        targetMatrix,
      )


  quaternion.normalize()

  return quaternion
}


/* ==================================================
   6. PREPARAR MODELO Y ORIENTACIONES
================================================== */

function DiceModel({
  number,
  isRolling,
}: D20Props) {

  const groupRef =
    useRef<Group>(null)


  /*
    Tiempo transcurrido desde que empezó
    la tirada actual.
  */

  const rollElapsedRef =
    useRef(0)


  /*
    Detecta el cambio rolling → detenido
    para generar un pequeño aterrizaje.
  */

  const wasRollingRef =
    useRef(false)

  const landingElapsedRef =
    useRef(999)


  /*
    Antes de la primera tirada el dado queda
    "vivo": gira lentamente y flota dentro
    del vortex.

    En cuanto el usuario tira por primera vez,
    dejamos de usar este estado idle.
  */

  const hasRolledOnceRef =
    useRef(false)

  const idleElapsedRef =
    useRef(0)


  const { scene } =
    useGLTF(
      D20_MODEL_URL,
    )


  const {
    model,
    scale,
    faceRotations,
  } =
    useMemo(
      () => {

        const clonedModel =
          scene.clone(true)


        clonedModel
          .updateMatrixWorld(true)


        const box =
          new Box3()
            .setFromObject(
              clonedModel,
            )


        const size =
          new Vector3()

        const center =
          new Vector3()


        box.getSize(size)

        box.getCenter(center)


        const largestDimension =
          Math.max(
            size.x,
            size.y,
            size.z,
          )


        const targetSize =
          3.25


        const normalizedScale =
          largestDimension > 0
            ? targetSize /
              largestDimension
            : 1


        clonedModel.position.x -=
          center.x

        clonedModel.position.y -=
          center.y

        clonedModel.position.z -=
          center.z


        clonedModel
          .updateMatrixWorld(true)


        /*
          MUY IMPORTANTE:

          Las orientaciones se calculan una sola vez,
          antes de que el grupo padre empiece a girar.

          Así evitamos contaminar la orientación final
          con la rotación actual de la animación.
        */

        const rotations:
          Record<
            number,
            Quaternion
          > = {}


        for (
          let diceNumber = 1;
          diceNumber <= 20;
          diceNumber++
        ) {

          const faceIndex =
            NUMBER_TO_FACE[
              diceNumber
            ]


          rotations[
            diceNumber
          ] =
            calculateFaceQuaternion(
              clonedModel,
              faceIndex,
            )

        }


        return {
          model:
            clonedModel,

          scale:
            normalizedScale,

          faceRotations:
            rotations,
        }

      },
      [scene],
    )


  const targetQuaternion =
    faceRotations[number] ??
    new Quaternion()



  /* ==================================================
     7. ANIMACIÓN
  ================================================== */

  useFrame(
    (
      _state,
      delta,
    ) => {

      if (
        !groupRef.current
      ) {
        return
      }


      const group =
        groupRef.current



      /* --------------------------------------------------
         7.1 INICIO DE TIRADA
      -------------------------------------------------- */

      if (
        isRolling &&
        !wasRollingRef.current
      ) {

        hasRolledOnceRef.current =
          true

        rollElapsedRef.current =
          0

        landingElapsedRef.current =
          999

      }



      /* --------------------------------------------------
         7.1.1 IDLE — ANTES DE LA PRIMERA TIRADA

         Mientras Fate espera una decisión:
         - el dado rota muy despacio,
         - flota apenas,
         - se inclina suavemente,
         - nunca parece clavado en el espacio.

         IMPORTANTE:
         este movimiento sólo existe ANTES
         de la primera tirada.

         Después de mostrar un resultado,
         el dado queda completamente quieto
         mostrando la cara ganadora.
      -------------------------------------------------- */

      if (
        !isRolling &&
        !hasRolledOnceRef.current
      ) {

        idleElapsedRef.current +=
          delta


        const time =
          idleElapsedRef.current


        /*
          Flotación vertical mínima.
          La amplitud es deliberadamente chica:
          queremos magia, no un dado saltando.
        */

        group.position.x =
          Math.sin(
            time * 0.42,
          ) *
          0.035

        group.position.y =
          Math.sin(
            time * 0.78,
          ) *
          0.075

        group.position.z =
          Math.cos(
            time * 0.51,
          ) *
          0.025


        /*
          Giro lento e irregular.

          No usamos una sola velocidad en un eje,
          porque eso se sentiría como un spinner.
        */

        group.rotateX(
          delta * 0.12,
        )

        group.rotateY(
          delta * 0.22,
        )

        group.rotateZ(
          delta * 0.075,
        )


        return
      }



      /* --------------------------------------------------
         7.2 TRAYECTORIA DE LANZAMIENTO

         Ya no gira simplemente sobre su eje.

         El dado:
         - sube,
         - se desplaza lateralmente,
         - viene un poco hacia cámara,
         - rota de forma irregular,
         - vuelve al centro al completar el arco.

         La animación visual principal dura
         aproximadamente 1.2 segundos, igual
         que el timeout de App.tsx.
      -------------------------------------------------- */

      if (isRolling) {

        wasRollingRef.current =
          true


        rollElapsedRef.current +=
          delta


        const rollDuration =
          1.2


        const progress =
          Math.min(
            rollElapsedRef.current /
              rollDuration,
            1,
          )


        /*
          Arco vertical.
          0 al inicio → máximo al centro → 0 al final.
        */

        const arc =
          Math.sin(
            progress *
              Math.PI,
          )


        /*
          Movimiento lateral en forma de S.

          Da la sensación de que el dado fue lanzado
          en vez de estar clavado en un pivote.
        */

        const sway =
          Math.sin(
            progress *
              Math.PI *
              2,
          )


        group.position.x =
          sway * 0.42

        group.position.y =
          arc * 0.72

        group.position.z =
          arc * 0.48


        /*
          Rotación irregular en los tres ejes.

          Las velocidades distintas evitan
          el aspecto de "spinner".
        */

        group.rotateX(
          delta *
            (
              8.2 +
              (arc * 2.4)
            ),
        )

        group.rotateY(
          delta *
            (
              11.4 +
              (sway * 2.2)
            ),
        )

        group.rotateZ(
          delta *
            (
              6.1 +
              (arc * 1.8)
            ),
        )


        return
      }



      /* --------------------------------------------------
         7.3 ATERRIZAJE

         Al terminar el vuelo damos un rebote
         corto y decreciente antes del reposo.
      -------------------------------------------------- */

      if (
        wasRollingRef.current
      ) {

        wasRollingRef.current =
          false

        landingElapsedRef.current =
          0

      }


      landingElapsedRef.current +=
        delta


      const landingTime =
        landingElapsedRef.current


      if (
        landingTime <
        0.42
      ) {

        const decay =
          Math.exp(
            -landingTime * 9,
          )


        group.position.x *=
          Math.max(
            0,
            1 - delta * 12,
          )


        group.position.z *=
          Math.max(
            0,
            1 - delta * 12,
          )


        group.position.y =
          Math.abs(
            Math.sin(
              landingTime * 22,
            ),
          ) *
          0.10 *
          decay

      } else {

        /*
          Terminamos de llevar la posición
          exactamente al centro.
        */

        group.position.x +=
          (0 - group.position.x) *
          Math.min(
            delta * 12,
            1,
          )

        group.position.y +=
          (0 - group.position.y) *
          Math.min(
            delta * 12,
            1,
          )

        group.position.z +=
          (0 - group.position.z) *
          Math.min(
            delta * 12,
            1,
          )

      }



      /* --------------------------------------------------
         7.4 SETTLING

         Mientras aterriza, la rotación se va
         orientando hacia la cara ganadora.
      -------------------------------------------------- */

      const rotationSpeed =
        landingTime < 0.25
          ? 8.5
          : 5.5


      group.quaternion
        .rotateTowards(
          targetQuaternion,
          rotationSpeed *
            delta,
        )



      /* --------------------------------------------------
         7.5 SNAP FINAL
      -------------------------------------------------- */

      const remainingAngle =
        group.quaternion
          .angleTo(
            targetQuaternion,
          )


      const positionSettled =
        group.position.length() <
        0.002


      if (
        remainingAngle <
          0.002 &&
        positionSettled
      ) {

        group.quaternion
          .copy(
            targetQuaternion,
          )


        group.position.set(
          0,
          0,
          0,
        )

      }

    },
  )


  return (

    <group
      ref={groupRef}
      scale={scale}
    >

      <primitive
        object={model}
      />

    </group>

  )
}


/* ==================================================
   8. ESCENA
================================================== */

function D20({
  number,
  isRolling,
}: D20Props) {

  return (

    <div
      className={
        `d20-container ${
          isRolling
            ? 'd20-container--rolling'
            : ''
        }`
      }
    >

      <div
        className="d20-aura"
      />


      <Canvas
        className="d20-canvas"

        camera={{
          position: [
            0,
            0,
            6,
          ],

          fov: 35,

          near:
            0.1,

          far:
            100,
        }}

        gl={{
          alpha:
            true,

          antialias:
            true,
        }}
      >

        <ambientLight
          intensity={0.8}
        />


        <pointLight
          position={[
            -4,
            3,
            5,
          ]}
          color="#1677ff"
          intensity={25}
        />


        <pointLight
          position={[
            3,
            -2,
            4,
          ]}
          color="#004cff"
          intensity={15}
        />


        <pointLight
          position={[
            4,
            4,
            5,
          ]}
          color="#ffb53f"
          intensity={18}
        />


        <Environment
          preset="studio"
        />


        <DiceModel
          number={number}
          isRolling={isRolling}
        />

      </Canvas>

    </div>

  )
}


/* ==================================================
   9. PRECARGA
================================================== */

useGLTF.preload(
  D20_MODEL_URL,
)


export default D20