# Kaucrow Memorial

> *Fly high, kaucrow.*

[English](README.md) · **Español**

Un pequeño sitio web para recordar a **Javier Pérez**, conocido en línea como
**@kaucrow** (2005 – 2026), hecho por sus amigos. Es un álbum de fotos por el
que se puede pasear: las fotos cuelgan en un cielo nocturno, en una galería,
sobre una mesa, en una multitud que no deja de crecer y en un escritorio con
el estilo de su propia configuración.

- Perfil: [github.com/kaucrow](https://github.com/kaucrow)
- Sus dotfiles: [github.com/kaucrow/dotfiles](https://github.com/kaucrow/dotfiles)

---

## Javier

Javier era programador. Tenía su propia configuración en Arch Linux con
Hyprland, una paleta generada con matugen y JetBrains Mono, y la publicó como
dotfiles para que cualquiera la copiara. Rust era su lenguaje favorito, y por
eso un cangrejo en pixel art camina por la parte inferior de la página. Un
cuervo también está en la esquina, por su usuario, *kaucrow*.

Este sitio toma prestado de todo eso a propósito. Los colores y la tipografía
vienen de su propia configuración, y el cangrejo y el cuervo son un guiño a lo
que le gustaba, para que el álbum se sienta como su rincón de internet.

Javier Pérez nació el 2 de enero de 2005 y falleció el 31 de agosto de 2026.

### En mis palabras

*Ramón Álvarez ([@ralvarezdev](https://github.com/ralvarezdev)), quien hizo este sitio.*

Conocí a Javier antes de empezar la universidad, en unas charlas en la
Universidad Rafael Urdaneta (URU). Ya en la carrera terminamos haciendo
proyectos juntos, como RushCargo y LuxFutura. Fueron nuestros humildes
comienzos, y me enorgullecen.

Era una de las personas más brillantes que he conocido, y diría que de las
más brillantes de nuestra facultad, si no la que más. Amaba Rust de verdad y
lo promovía donde podía. Nunca voy a olvidar eso.

También era una persona muy dedicada, y buena, buena de verdad: un buen
amigo, un buen compañero y un buen estudiante.

Tenía una vida muy activa; hasta había empezado a ir al gimnasio. Después
llegó la leucemia. Algunas de sus variantes, como la leucemia linfoblástica
aguda (LLA), son sumamente agresivas: en cuestión de semanas pueden
convertirse en una enfermedad grave que te cambia la vida. Cuando supe lo
crítico de su estado, doné sangre. Nunca imaginé que terminaría así.

Fue una persona increíble, y lo voy a extrañar.

### Qué puedes hacer en su memoria

- **Dona sangre**, si puedes. Las personas con leucemia suelen necesitar
  transfusiones.
- **Hazte análisis de sangre con regularidad**, y ve al médico si algo no anda
  bien. Esto no es un consejo médico.
- **Ayuda a quien lo necesite**, como puedas.
- **Dedícale tus proyectos grandes.** Si te gusta su nombre y su usuario, pon
  una línea como esta en cada proyecto grande que hagas, ahora o más adelante:

  ```
  Dedicado a Javier Pérez (@kaucrow)
  ```

- **Comparte lo que recuerdas** de él: mira
  [Comparte tus recuerdos](#comparte-tus-recuerdos).
- **Apoya la investigación de la leucemia o súmate a un registro de médula
  ósea**: mira [Formas de ayudar](#formas-de-ayudar).

### Sobre este dominio

Este dominio es mío, Ramón Álvarez, y lo seguiré pagando por el resto de mi
vida, en memoria de Javier.

### Lo que dicen sus amigos

La página rota frases cortas debajo de su nombre. Algunas son chistes que solo
entiende un programador, otras son sencillas. Todas están en
[`web/src/features/album/data/phrases.ts`](web/src/features/album/data/phrases.ts),
y cualquiera que lo quiso puede añadir una.

> Compiled without warnings. · Thanks for the rice. · cargo run forever. ·
> Still in everyone's PATH. · Memory-safe in all of ours. · Fly high, kaucrow.

### Formas de ayudar

Dos enlaces en la página apuntan a cosas que importan en la lucha contra la
leucemia: dónde donar para la investigación y el apoyo a pacientes, y cómo
unirse a un registro de donantes de médula ósea. Están en
[`web/src/features/album/data/support.ts`](web/src/features/album/data/support.ts):

| Tipo | Organización |
| --- | --- |
| Donar | [Leukemia & Lymphoma Society](https://give.lls.org) |
| Unirse a un registro | [NMDP (Be The Match)](https://www.nmdp.org/get-involved/join-the-registry) |
| Unirse a un registro | [DKMS](https://www.dkms.org/register-donor) |

Los registros cambian según el país. Si hay una organización local donde
vives, añádela a ese archivo.

---

## Comparte tus recuerdos

Invitamos a todos los que conocieron a Javier a sumar a esta página: tus
recuerdos, tus agradecimientos, lo que admirabas de él, lo que recuerdas, lo
que aprecias de Javier, etc. También puedes añadir frases para la línea que
rota y fotos que quieras compartir. Cualquier aporte, grande o pequeño,
cuenta.

### Qué puedes aportar

| Qué | Dónde |
| --- | --- |
| Recuerdos, agradecimientos, lo que admirabas y aprecias | un archivo en [`memories/`](memories/), mira su [README](memories/README.md) |
| Frases | [`web/src/features/album/data/phrases.ts`](web/src/features/album/data/phrases.ts) |
| Fotos | [`web/public/photos/`](web/public/photos/), mira [Agregar fotos](#agregar-fotos) |
| Nombres y notas para las fotos | [`web/src/features/album/data/seed.ts`](web/src/features/album/data/seed.ts) |

### Cómo: solo con pull requests

Toda contribución pasa por un **pull request**, y nada se integra ni se
publica hasta que haya sido leído. Es para evitar cualquier mala intención y
para cuidar la memoria de Javier y a las personas que aparecen en las fotos.

1. Pide acceso, o envía lo que quieras añadir a quien cuida el repositorio,
   [@ralvarezdev](https://github.com/ralvarezdev), que puede abrir el pull
   request por ti. Por ahora el repositorio es privado.
2. Haz tu cambio en una rama y abre un pull request hacia `main`.
3. Espera a que lo lean y lo integren. Es posible que te pidamos cambiar algo.

### Por favor

- Sé amable y honesto. Este es un lugar para recordarlo.
- Comparte solo fotos que puedas compartir, y solo si a quienes salen en ellas
  les alegraría verlas aquí.
- No incluyas teléfonos, direcciones ni otros datos privados, ni enlaces o
  publicidad.
- Convierte las fotos como se indica en [Agregar fotos](#agregar-fotos), para
  quitar la ubicación. Si es difícil, envía la foto a quien cuida el
  repositorio en vez de subir el original.

---

## El álbum

El álbum es curado: las fotos salen de este repositorio y los visitantes no
pueden subir nada. Es una decisión, para que la página siga siendo segura y
tranquila.

Cinco vistas, que se cambian abajo a la izquierda:

| Vista | Qué es |
| --- | --- |
| **Night sky** | Las fotos flotan a tres profundidades con un paralaje suave, unidas por constelaciones punteadas. |
| **Gallery** | Una sala en 3D con fotos enmarcadas en las paredes. |
| **Table** | Una mesa inclinada con fotos dispersas y una levantada. |
| **Growing** | Una multitud de más de 100 fotos pequeñas. Con la rueda haces zoom, arrastrando te mueves. |
| **Kaucrow's dotfiles** | Ventanas en mosaico al estilo de su Hyprland, con su paleta y su tipografía. |

Qué puedes hacer:

- **Haz clic en la foto grande** para verla grande, con sus propias
  proporciones. Las flechas (o las teclas izquierda y derecha) recorren el
  álbum, y un clic fuera de la foto o Esc la cierra.
- **Haz clic en cualquier foto pequeña** para ponerla en primer plano.
- **Míralo cambiar.** Cada pocos segundos una foto visible se cambia por una
  que esperaba fuera de vista, para que todas tengan su turno.
- **Toca al cuervo.** Sigue el puntero y grazna cuando le haces clic.
- **Espera al cangrejo.** Cruza por abajo de lado, se detiene a mover las
  pinzas y sigue. Con el movimiento reducido activado, se queda quieto.

Todo lo animado respeta `prefers-reduced-motion`.

---

## Agregar fotos

Las fotos están en `web/public/photos/` en formato WebP, con copias de 480 px
en `web/public/photos/thumb/` para las tarjetas pequeñas de *Growing*.

Para convertir una carpeta de JPEG (necesita ImageMagick):

```sh
for f in *.jpg; do
  magick "$f" -auto-orient -resize '1600x1600>' -strip -quality 82 \
    web/public/photos/"${f%.jpg}.webp"
  magick "$f" -auto-orient -resize '480x480>' -strip -quality 75 \
    web/public/photos/thumb/"${f%.jpg}.webp"
done
```

`-strip` elimina los metadatos, incluida la ubicación. Hazlo siempre: estas
fotos muestran a personas reales.

Luego anota los números de archivo en
[`web/src/features/album/data/seed.ts`](web/src/features/album/data/seed.ts)
(`PHOTO_NUMBERS`, archivos llamados `javier-0001.webp` y así). Las escenas
muestran una selección distinta en cada carga.

Las fotos pertenecen a los amigos y familiares que las compartieron. Por
favor, no las uses en otro lugar sin preguntar.

### Pendiente

- Nombres y notas cortas para cada foto. Las notas se muestran como pie de
  foto en la vista ampliada.
- Fotos de familia. Por ahora todas son de amigos (`friends`), así que el
  grupo Familia está oculto. Cuando haya, cambia `SHOW_FAMILY = true` en
  [`web/src/features/album/config.ts`](web/src/features/album/config.ts) y
  marca cuáles son de familia.

---

## Notas técnicas

| Área | Elección |
| --- | --- |
| App | Vite, React 19, TypeScript estricto |
| 3D | three.js con `@react-three/fiber` y `drei` |
| Estado | zustand |
| Estilos | CSS Modules y variables CSS, sin CSS-in-JS |
| Lint | Biome |
| Pruebas | Vitest y Testing Library |
| Tareas | [Task](https://taskfile.dev) |
| Hosting | Cloudflare Pages (direct upload) |

### Ejecutarlo

Necesitas Node 22 y [pnpm](https://pnpm.io).

```sh
cd web
pnpm install
pnpm dev
```

Con [Task](https://taskfile.dev) instalado, desde la raíz del repositorio:

```sh
task frontend:dev     # servidor de desarrollo
task check            # lint, tipos y pruebas
task ci               # check más un build de producción
```

### Despliegue

Copia `.env.example` a `.env` y completa `CLOUDFLARE_API_TOKEN`,
`CLOUDFLARE_ACCOUNT_ID` y `CLOUDFLARE_PAGES_PROJECT`; luego:

```sh
task deploy
```

Ejecuta la verificación de CI y sube `web/dist` a Cloudflare Pages. `.env`
está en `.gitignore`.

### Cómo está organizado

```
web/src/
  components/
    Crow/       el sprite del cuervo, con mirada y graznido
    Ferris/     el cangrejo en pixel art y su recorrido
    ui/         Button, Chip, Field, Dialog
  features/
    album/      estado, encabezado, frases, vista ampliada, enlaces de ayuda, datos
    scenes/     night-sky, gallery, table, growing, dotfiles, código común de marcos
  styles/
    tokens.css  espaciado, radios y colores compartidos
    themes.css  un tema por escena, elegido con data-scene
```

- **Un tema por escena.** `themes.css` cambia colores, tipografías y
  alineación del encabezado según `data-scene`, así que ningún componente
  necesita saber en qué escena está.
- **Fotos con sus proporciones.** Cada foto se ajusta dentro de su marco y
  nunca se estira; el espacio sobrante muestra el color del papel del marco.
- **Accesible junto al canvas.** Una lista oculta de botones reales refleja
  las fotos de la escena, para que quienes usan teclado o lector de pantalla
  también puedan usarlas.
- **Los colores de las escenas** dentro de three.js viven en cada archivo de
  escena y no en las variables CSS, así que cambiar una paleta implica editar
  ambos sitios.

### Límites conocidos

- El diseño está pensado para 1280×800 y se ajusta a la ventana, por lo que en
  pantallas muy estrechas se recortan los lados en vez de reacomodarse.
- El desenfoque de las tarjetas lejanas de *Growing* necesita Safari 18 o
  posterior.
- El paquete de three.js es grande (unos 917 kB, 244 kB comprimido).

---

## Créditos

- **Ferris**, la mascota de Rust, de Karen Rustad Tölva, es de dominio público
  (CC0). El cangrejo en pixel art es un sprite dibujado a mano a partir de él.
- **Dotfiles**: la paleta, la elección de tipografía y la disposición de las
  ventanas de la vista *Kaucrow's dotfiles* vienen de
  [kaucrow/dotfiles](https://github.com/kaucrow/dotfiles).
- **Tipografías**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/) e
  [Instrument Serif](https://fonts.google.com/specimen/Instrument+Serif),
  ambas con la SIL Open Font License.
- **Cuervo**: el sprite sale de los mockups hechos para este sitio.

---

*Gracias por todo, Javier.*
