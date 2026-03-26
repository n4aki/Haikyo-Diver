# Player Sprite Images

Player animation images use separate files per action and direction.

Folder structure:

```text
assets/sprites/player/
  idle_down.png
  idle_left.png
  idle_right.png
  idle_up.png
  walk_down.png
  walk_left.png
  walk_right.png
  walk_up.png
```

Rules:

- each file is one action x one direction
- transparent PNG
- do not bake a white or checkerboard background into the exported image
- frames are arranged in a grid
- runtime uses `columns`, `rows`, and `frameCount` to read frames
- frame size is derived from `naturalWidth / columns` and `naturalHeight / rows`

Current player setup:

- `idle_*` uses `columns: 2`, `rows: 2`, `frameCount: 4`
- `walk_*` uses `columns: 2`, `rows: 2`, `frameCount: 4`
- frame order is:
  - `frame0` = top-left
  - `frame1` = top-right
  - `frame2` = bottom-left
  - `frame3` = bottom-right

Future-friendly states:

- `attack_down.png`
- `attack_left.png`
- `attack_right.png`
- `attack_up.png`
- `hit_down.png`
- `hit_left.png`
- `hit_right.png`
- `hit_up.png`
- `death_down.png`
- `death_left.png`
- `death_right.png`
- `death_up.png`

If any animation image is missing, the game falls back to the existing frame images.
