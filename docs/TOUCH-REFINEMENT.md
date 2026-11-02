# Mobile image-rail touch refinement

2026-11-02 · Follow-up to MGC Digital V3.0, based on main `8c949ba`.

The homepage/services ArtifactJourney previously relied on native horizontal momentum and mandatory snap positions. A short, slower drag could spring back; on some devices a fling could pass several chapters. The new touch rail follows the finger directly and settles at the current or adjacent chapter, limiting each gesture to one chapter.

- A deliberate short drag (about one sixth of the width, capped at 64px) advances; a light quick flick also advances without requiring a large displacement.
- A short drag continues directly from the finger’s release position; native snapping returns only when the destination is reached, avoiding a backward bounce.
- Small nudges return to the current chapter. The first/last chapter clamp at their edges. A fresh gesture stops the prior transition at its actual position.
- Direction locking leaves vertical page pan and pinch zoom with the browser. Touch capture transfers from image/text to the rail without canceling the gesture.
- Chapter links and keyboard shortcuts can still go directly to any chapter; their selected state continues to follow actual scroll position.
- Native snap-stop is retained as a fallback. With JavaScript disabled the rail keeps native horizontal panning. Reduced Motion settles without animation.

Source: `components/use-swipe-rail.ts`, its integration in `artifact-journey.tsx`, and the mobile rail rules in `styles/home.css`. No runtime dependency or animation framework was added.

Verification: typecheck and `/meich` production build/export. `npm run check:swipe` uses Chromium CDP touch input, covering 360/390/412/430px, small nudge, short slow drag with frame-by-frame release checks, quick light flick, strong fling, reverse direction, both edges, vertical scrolling, direct chapter selection, keyboard, interrupted transitions, Reduced Motion and no-JS fallback. Results: `docs/qa/swipe-regression.json`. The existing full V3 and standalone motion suites remain in PR CI; CI also runs the touch regression and uploads its report.

This is browser touch emulation, not a physical Android/iOS/Safari test. Reproduce after the Pages export with the same isolated Playwright setup described in README:

```bash
MGC_PLAYWRIGHT_MODULE=/tmp/mgc-qa/node_modules/playwright npm run check:swipe
```

The script starts its own static preview; no dev server is required. Existing Chromium may be selected with `MGC_CHROMIUM_PATH`. Publishing follows the existing PR → main → Pages workflow, with no forced pushes or bypassed checks.
