# Image and font sources

## Hero statue

`public/images/statue-apollo.webp` is derived from
[Head of Apollo, British Museum (Sc1547)](https://commons.wikimedia.org/wiki/File:Head_Apollo_BM_Sc1547.jpg),
photo by **Marie-Lan Nguyen**, licensed [CC BY 2.5](https://creativecommons.org/licenses/by/2.5/).
Changes: background removed, converted to greyscale, bottom faded. The credit is shown in the site footer, as the licence requires.

## Clouds

`public/images/clouds.webp` was generated procedurally for this project (no source image).

## Temporary photos (Unsplash)

Downloaded from Unsplash and stored in `public/images/photos/` as `<photo-id>-<width>x<height>.webp` (the Unsplash CDN is blocked on some networks, so it is not hotlinked). Sizes are set in `src/data/content.ts`. They are placeholders, labelled «تصویر موقت» on the page, and should be replaced with the agency's own work.

- About: photo-1516035069371-29a1b244cc32
- Portfolio: photo-1519608487953-e999c86e7455, photo-1460925895917-afdab827c52f, photo-1634017839464-5c339ebe3cb4, photo-1495474472287-4d71bcdd2085, photo-1485846234645-a62644f84728, photo-1519501025264-65ba15a82390
- Sign-in page: photo-1618005182384-a83a8bd57fbe
- Services (cards and /services/:id pages): photo-1598488035139-bdbb2231ce04, photo-1432888622747-4eb9a8efeb07, photo-1547658719-da2b51169166, photo-1452587925148-ce544e77e70d, photo-1618005182384-a83a8bd57fbe, photo-1503694978374-8a2fa686963a
- Fallback: photo-1634017839464-5c339ebe3cb4

## Fonts

- [Estedad](https://github.com/aminabedi68/Estedad) via `@fontsource-variable/estedad`, SIL Open Font License.
- [Outfit](https://github.com/Outfitio/Outfit-Fonts) via `@fontsource-variable/outfit`, SIL Open Font License.

## Icons

Homepage icons are hand-drawn SVGs in `src/components/Icons.tsx`. The sign-in page still uses [Lucide](https://lucide.dev/) (ISC).
