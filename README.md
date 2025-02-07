# TMX to LT

This is a program that converts `.tmx` map files to `.json` usable in the [Lex Talionis](https://gitlab.com/rainlash/lt-maker) game engine for Fire Emblem ROM hacks.

## Map Previews

You can browse the newly generated map previews here:[Map Previews](maps-preview.md).

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

## Developer Setup

For detailed setup and usage instructions, see [developer-setup.md](developer-setup.md).
