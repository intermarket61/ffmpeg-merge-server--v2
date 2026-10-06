# Chosen look: gouache

Picked from the 4×3 style test (`contact-sheet.jpg`, row 1). The `images`
step should use this prefix verbatim for every still:

> Hand-painted gouache illustration, visible brush texture, soft edges, no
> black outlines, warm muted palette of ochre, sage and dusty blue, gentle
> storybook lighting:

Generation settings that worked: `gemini-3.1-flash-image`, `generateContent`,
`imageConfig.aspectRatio: "16:9"` (returns 1376×768 JPEG data).

## Lessons from the test

* "No text, captions, logos or watermarks" in the prompt is not enough:
  gouache-B still painted "BOOT POLISH" on the tin. Describe props as
  unlabelled ("a plain unlabelled tin") and avoid props that carry print
  (documents, bills, signs, screens) as the focus of a shot, or accept
  illegible scribble.
* Never name a brand; the photo style produced a real brand logo (KIWI)
  unprompted. Check every still for logos before it goes in a video.
* Faces: scene A worked with "face partly turned away"; keep people
  anonymous and secondary.
