# Comic Reel Studio

Монгол хэл дээр ажилладаг AI Comic Reel Generator — нэг сэдэв эсвэл богино
санаанаас Reel-ийн комик зохиол, кадр бүрийн дүрслэлийн prompt, дэлгэцийн
текст, timeline, SRT хадмал, caption болон hashtag-ийг автоматаар үүсгэдэг
frontend web app.

## Stack

- React + TypeScript + Vite
- Tailwind CSS v4 (pastel / glassmorphism дизайн систем)
- Zustand (`localStorage`-д автоматаар хадгалагддаг state)

## AI generation

API key байхгүй үед `src/lib/mockAI.ts` дотор байгаа mock AI generator
ашиглагдана — 10 төрлийн (Relationship, Red Flag, Green Flag, Funny,
Romantic, Life, Girl thoughts, POV, Motivational, Custom) жинхэнэ Монгол
хэллэг бүхий түүхийн санг ашиглан title, hook, кадрууд, image prompt,
caption, hashtag-ийг бүтэцтэй (`ComicProject`) JSON хэлбэрээр буцаадаг.
Ирээдүйд жинхэнэ image generation API холбоход бэлэн байхаар кадр бүр
дэлгэрэнгүй `imagePrompt` талбартай гардаг.

## Development

```bash
npm install
npm run dev      # dev server
npm run build    # production build (tsc + vite build)
npm run preview  # preview the production build
```

## Project structure

```
src/
  components/   studio, frames, timeline, subtitle, caption, layout, common
  lib/          mockAI, srt, mongolianCheck, exportUtils
  store/        zustand store (persisted to localStorage)
  types.ts      shared TypeScript types
  constants.ts  select/tab option lists
```
