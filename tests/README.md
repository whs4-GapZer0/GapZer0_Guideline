# Validation

Run `node --test tests/*.test.mjs` for the Control assessment and legacy backup checks.
The question-era tests target `assets/assessment/legacy/`; current assessment tests use `controls.json`.
After a Jekyll build, run `THEME_TEST_ROOT=_site node tests/control-site-browser.mjs` with Playwright installed.
This checks the generated theme, framework drawer, navigation, browser storage and Excel round trip.
`theme-navigation.mjs` and `file-transfer-browser.mjs` are historical question-era browser scenarios and are not current CI entry points.
