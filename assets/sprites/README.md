# Sprite Sheets

External transparent PNG sprite sheets go in this folder.

Current player file:

- `player-sheet.png`

Recommended frame size:

- `48x48`
- `32x32` is also fine if every frame uses the same fixed grid

Current player layout:

- grid: `4 columns x 4 rows`
- columns: `idle1`, `idle2`, `move1`, `move2`
- rows: `down`, `left`, `right`, `up`

Grid example:

| Direction | Col 0 | Col 1 | Col 2 | Col 3 |
| --- | --- | --- | --- | --- |
| Row 0 / down | idle1 | idle2 | move1 | move2 |
| Row 1 / left | idle1 | idle2 | move1 | move2 |
| Row 2 / right | idle1 | idle2 | move1 | move2 |
| Row 3 / up | idle1 | idle2 | move1 | move2 |

Notes:

- the sheet uses one fixed frame size for every cell
- idle uses the first 2 columns
- move uses the last 2 columns
- if `player-sheet.png` is missing, the game falls back to the existing frame images
