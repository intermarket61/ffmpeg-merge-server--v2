# Video pipeline: notes for Claude

* Read README.md for setup and commands and AUTHORING.md before writing or
  changing any video, shot or scene. It holds the style rules and the
  pitfalls already hit.
* `python -m engine status videos/<id>` first: it says what is done and
  what a step would cost.
* Never run `hedra --yes` (or `make --yes`) without the user approving the
  credit estimate `status` prints. Changing a voiced shot's lines, hold or
  order makes its part stale and costs a new take; use `trim` for pauses.
* Review with `stills` before rendering. Look at every frame, not a sample.
* `build/` holds paid-for assets (vo/, hedra/). Never delete it casually.
