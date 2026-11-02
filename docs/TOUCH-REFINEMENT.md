# Mobile image-rail touch refinement

2026-11-02 · Follow-up to MGC Digital V3.0. Initial correction based on `8c949ba`; motion refinement based on main `c848758`.

The homepage/services ArtifactJourney previously relied on native horizontal momentum and mandatory snap positions. A short, slower drag could spring back; on some devices a fling could pass several chapters. The new touch rail follows the finger directly and settles at the current or adjacent chapter, limiting each gesture to one chapter.

- A deliberate short drag (about one sixth of the width, capped at 64px) advances; a light quick flick also advances without requiring a large displacement.
- A short drag continues from the finger’s release position and measured velocity. Native snapping returns only when the destination is reached.
- Small nudges return to the current chapter. Beyond the first/last chapter, resistance increases continuously instead of stopping abruptly. A fresh gesture stops the prior transition at its actual position.
- Direction locking leaves vertical page pan and pinch zoom with the browser. Touch capture transfers from image/text to the rail without canceling the gesture.
- Chapter links and keyboard shortcuts can still go directly to any chapter; their selected state continues to follow actual scroll position.
- Native snap-stop is retained as a fallback. With JavaScript disabled the rail keeps native horizontal panning. Reduced Motion settles without animation.

The initial correction limited chapter skipping but still used a hard travel boundary and browser smooth scrolling that restarted from zero speed. That addressed the destination, not the continuity of the motion. The follow-up replaces that release behavior with an analytic critically damped spring. It starts with the same position and a velocity fitted to the last 100ms of pointer samples; stale samples produce zero velocity. Higher release speeds increase damping. Continuous edge resistance has an initial slope of one and approaches an 80px limit, providing feedback without a hard collision. The destination remains the current or adjacent chapter; intentional chapter selection can still jump directly.

The spring uses absolute elapsed time rather than a per-frame decay. Animation runs only while settling, can be interrupted, and stops immediately if Reduced Motion becomes active. The mathematical 60/120Hz equivalence check verifies the same model state at the same time; it does not measure display performance on a 120Hz device.

Source: `components/use-swipe-rail.ts`, `lib/swipe-physics.ts`, the existing integration in `artifact-journey.tsx`, and the mobile rail rules in `styles/home.css`. No runtime dependency or animation framework was added.

Verification: typecheck and `/meich` production build/export (570 pages, no broken internal links or images). `npm run check:swipe` passed 11 groups. It checks initial velocity continuity, model refresh-rate independence, convergence and edge resistance, then uses Chromium CDP touch input covering 360/390/412/430px, small nudge, short slow drag with frame-by-frame release checks, quick light flick, strong fling, reverse direction, both edges, vertical scrolling, direct chapter selection, keyboard, interrupted transitions, Reduced Motion and no-JS fallback. Tests wait for both the destination and settling completion. Results: `docs/qa/swipe-regression.json`. The existing full V3 and standalone motion suites remain in PR CI; CI also runs the touch regression and uploads its report.

This is browser touch emulation, not a physical Android/iOS/Safari test. Reproduce after the Pages export with the same isolated Playwright setup described in README:

```bash
MGC_PLAYWRIGHT_MODULE=/tmp/mgc-qa/node_modules/playwright npm run check:swipe
```

The script starts its own static preview; no dev server is required. Existing Chromium may be selected with `MGC_CHROMIUM_PATH`. Publishing follows the existing PR → main → Pages workflow, with no forced pushes or bypassed checks.

## Culture × AI: connect the actual image surface

The user's screenshot identified `CultureLab`, a different surface from the ArtifactJourney rail corrected above. CultureLab only had click/keyboard stage selection. Earlier ArtifactJourney tests could not establish that CultureLab supported swiping.

The mobile CultureLab images now form a horizontal gallery using the same `useSwipeRail` controller and physics. Fingers drag the actual image; each gesture settles at the current or adjacent stage. The stage indicator, reading panel and source-image link follow actual gallery position. Tabs/reset/keyboard navigate that same gallery. Rotation preserves the current stage. Desktop retains its existing image composition and crossfades. Each interpretation plate keeps its own crop while moving between stages, so neighboring photographs do not change scale halfway through a drag.

The reading layout's transparent space and photographic labels allow pointer events through to the image. Reading controls and the original-image dialog keep their own input handling; vertical page scrolling and pinch zoom remain native. A bilingual mobile hint identifies the swipe surface. No new runtime dependency or media asset was introduced.

A fast horizontal gesture also exposed a shared-controller defect: pointer capture and `pointermove.preventDefault()` alone did not cancel Chromium's native touch fling recognizer. The subsequent tap reached the button as pointer/touch events but produced no click. A non-passive `touchmove` listener now cancels the native behavior only after the controller has claimed a horizontal gesture. Vertical and multi-touch gestures remain available to the browser. The regression deliberately taps a stage immediately after a quick flick to verify that the click is not swallowed.

`scripts/check-culture-swipe.mjs` is included in `npm run check:swipe`: it tests the Chinese homepage and standalone Culture × AI page at 320/360/390/412/430px, plus both English entries at 390px. It checks movement **before touch release**, all four stages, reverse gestures, small nudges, fast/strong flicks, both edges, vertical page scrolling, lenses, original-image access, reset, keyboard selection, interrupted transitions, Reduced Motion and desktop/mobile rotation. Results remain in `docs/qa/swipe-regression.json`; the 390px screenshot is `docs/qa/culture-touch/mobile.png`. The existing V3/motion suites wait for the real selected stage after animated navigation rather than assuming synchronous switching. These are browser-emulation checks; the user's Android browser, physical phones and Safari remain unverified.

The input harness supplies explicit CDP event timestamps for the intended gesture speed, so transport latency does not accidentally turn a quick flick into a slow drag. After testing vertical pan it waits for actual page scrolling to stop before tapping controls; browsers may consume a tap to stop ongoing native momentum. Assertions still require actual image displacement, correct final stage and completed settling. Rapid keyboard navigation advances from the focused tab while a prior transition is still running.

Local verification after the correction: typecheck, production Pages build, export check (570 pages, zero broken links/images), and all 24 swipe regression groups passed. Screenshot and JSON evidence are retained at the paths above. Full V3, standalone server packaging and motion checks run in PR CI.
