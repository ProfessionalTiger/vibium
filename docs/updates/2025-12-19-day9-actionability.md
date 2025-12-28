# day 9: actionability

vibium now auto-waits for elements.

---

## the problem

web pages are dynamic. when you say "click the button", the button might:
- not exist yet (still loading)
- be animating into place
- be hidden behind something else
- be disabled

naive automation clicks too early and fails randomly.

## the solution

before every action, vibium polls until the element is ready:

1. **visible** — has size, not `display:none` or `visibility:hidden`
2. **stable** — position hasn't changed in 50ms (not animating)
3. **receives events** — `elementFromPoint()` hits this element, not an overlay
4. **enabled** — no `disabled` attribute or `aria-disabled`
5. **editable** — for `type()` only: accepts text input

this loops every 100ms until all checks pass or timeout (default 30s).

**there's no magic here.** it's just polling + a few DOM checks. the [full explanation](/docs/explanation/actionability.md) shows the actual javascript that runs in the browser.

---

## what shipped

**go clicker binary**
- `vibium:find`, `vibium:click`, `vibium:type` — custom bidi extension commands
- actionability checks run server-side, not in client libs
- `--timeout` flag on cli commands

**js client - custom timeout option**
- `element.click({ timeout: 5000 })` — custom timeout per action (default 30s)
- `vibe.find('a', { timeout: 5000 })` — wait for element to exist
- all actions auto-wait by default

---

## try it

requires [go](https://go.dev) and [node](https://nodejs.org).

```
$ git clone https://github.com/VibiumDev/vibium && cd vibium
$ make build && cd clients/javascript && node
> const { browserSync } = require('./dist/index.js')
> const vibe = browserSync.launch({ headless: false })
> vibe.go('https://example.com')
> const link = vibe.find('a')
> link.info
{
  tag: 'a',
  text: 'Learn more',
  box: { height: 19, width: 82, x: 196, y: 246 }
}
> link.click({ timeout: 5000 })  // custom 5s timeout
> vibe.quit()
```

---

day 9 of 14. five days left.

✨🎅🎄🎁✨

*december 19, 2025*
