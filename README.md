# TMX to LT

This is a program that converts `.tmx` map files to `.json` usable in the [Lex Talionis](https://gitlab.com/rainlash/lt-maker) game engine for Fire Emblem ROM hacks.

## Map Previews

You can browse the newly generated map previews here: [Map Previews](maps-preview.md).

## Adding These maps to Your LT game

I'm not sure how to add these maps to your LT game through the LT Maker GUI, but I can tell you how to do it manually in the code.

1. Install the [LT Maker Python Installation](https://lt-maker.readthedocs.io/en/latest/source/getting_started/Python-Installation.html#pyinstall).

2. Copy the contents of the `/tilesets/images` directory to your LT game's tileset directory: `lt-maker/<your-project-name>.ltproj/resources/tilesets/`.

3. Add the items from the `tilesets/tileset.txt` file to your LT game's tileset file: `lt-maker/<your-project-name>.ltproj/resources/tilesets/tileset.json`. This file is a JSON array of tileset objects. In your LT game's tileset file, you'll need to add a comma to the last curly brace "`},`" and then paste the contents of the `tilesets/tileset.txt` file after it, **but before the last closing bracket "`]`"**.

4. For each map, add an object to the end of the list, making sure to add a comma after the previous closing curly brace "`},`" and before the new object. The object should look like this, with the `nid` property set to the chapter number and the `terrain_grid` and `autotiles` properties set to empty objects:

```json
{
  "nid": "0",
  "terrain_grid": {},
  "autotiles": {}
}
```

5. Move the generated `.json` from the `/output/` directory to your LT game's tilemaps directory. You'll need to change the `nid` property to the chapter number (`"0"` for the prologue, `"1"` for chapter 1, etc.).

## Limitations

While this program converts most of the maps in the [shared FE Repo](https://github.com/Klokinator/FE-Repo), it does not work with all tilesets, nor any autotiles.

### Autotiles

Autotiles are tiles that are animated in the game (rivers, etc.). **Autotiles are not supported by this program**. However, the maps look just fine without them.

### Unsupported Tilesets

This program only supports tilesets whose last two characters are:

- Village: "10"
- Plains: "30"
- Fort: "3E"
- Black Temple: "61"
- Mountainous: "6E"
- Fields: "03"
- Castle: "1A"
- Stronghold: "7B"
- Temple: "8A"
- Desert: "44"
- Lava Cave: "52"

This means the following maps will not convert:

- "Alusq FE7 1C1D481F trine peninsula" by FEU
- "Alusq FE7 0A009B0C dark room- cutscene map" by FEU
- "LordGlenn FE8 1800191A TheCistern" by FEU
- "Chapter11AHerooftheWest Diff Tileset" by Shin19
- "The Cistern {LordGlenn}" by LordGlenn
- "Alusq FE7 A700A8A9 treasure fortress" by FEU
- "Chapter18AFrozenRiver Combo 19A" by Shin19
- "Chapter5FlameCrest Diff Tileset" by Shin19
- "Chapter3 The Latecomer" by Shin19
- "Alusq FE7 7B007C7D dinosaur lake" by FEU
- "FinalChapterBeyondDarkness tower combo" by Shin19
- "Chapter8Reunion Jail Route" by Shin19
- "Chapter20BTheSilverWolf Diff Tileset" by Shin19
- "Chapter9" by Shin19
- "Chapter14Arcadia_Slight_Rework_Item_Markings" by Shin19
- "The_Cistern_Waterless_{LordGlenn}" by LordGlenn

Additionally all maps by ZoramineFae are unsupported. (Sorry!)

## Developer Setup

For detailed setup and usage instructions, see [developer-setup.md](developer-setup.md).
