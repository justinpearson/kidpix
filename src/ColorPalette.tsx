import React, { useState } from 'react';

interface ColorPaletteProps { onColorSelect: (color: string) => void; }
interface Palette { name: string, sourceUrl: string, colorValues: string[] }

const PALETTES: Palette[] = [
    { name: "Basic", sourceUrl: '', colorValues: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(32, 32, 32)', 'rgb(64, 64, 64)', 'rgb(128, 128, 128)', 'rgb(192, 192, 192)', 'rgb(128, 0, 0)', 'rgb(255, 0, 0)', 'rgb(128, 128, 0)', 'rgb(255, 255, 1)', 'rgb(0, 64, 64)', 'rgb(0, 100, 0)', 'rgb(0, 128, 0)', 'rgb(0, 255, 0)', 'rgb(0, 128, 128)', 'rgb(128, 255, 255)', 'rgb(0, 0, 128)', 'rgb(0, 0, 255)', 'rgb(0, 64, 128)', 'rgb(0, 128, 255)', 'rgb(128, 0, 255)', 'rgb(128, 128, 255)', 'rgb(128, 0, 128)', 'rgb(255, 0, 255)', 'rgb(128, 0, 64)', 'rgb(255, 0, 128)', 'rgb(73, 61, 38)', 'rgb(136, 104, 67)', 'rgb(128, 64, 0)', 'rgb(255, 128, 64)', 'rgb(225, 135, 0)', 'rgb(255, 195, 30)'] },
    { name: "DawnBringer", sourceUrl: 'https://lospec.com/palette-list/dawnbringer-32', colorValues: ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb( 34 , 32 ,52 )', 'rgb( 69 , 40 ,60 )', 'rgb( 102 , 57 ,49 )', 'rgb( 143 , 86 ,59 )', 'rgb( 223 , 113 ,38 )', 'rgb( 217 , 160 ,102 )', 'rgb( 238 , 195 ,154 )', 'rgb( 251 , 242 ,54 )', 'rgb( 153 , 229 ,80 )', 'rgb( 106 , 190 ,48 )', 'rgb( 55 , 148 ,110 )', 'rgb( 75 , 105 ,47 )', 'rgb( 82 , 75 ,36 )', 'rgb( 50 , 60 ,57 )', 'rgb( 63 , 63 ,116 )', 'rgb( 48 , 96 ,130 )', 'rgb( 91 , 110 ,225 )', 'rgb( 99 , 155 ,255 )', 'rgb( 95 , 205 ,228 )', 'rgb( 203 , 219 ,252 )', 'rgb( 155 , 173 ,183 )', 'rgb( 132 , 126 ,135 )', 'rgb( 105 , 106 ,106 )', 'rgb( 89 , 86 ,82 )', 'rgb( 118 , 66 ,138 )', 'rgb( 172 , 50 ,50 )', 'rgb( 217 , 87 ,99 )', 'rgb( 215 , 123 ,186 )', 'rgb( 143 , 151 ,74 )', 'rgb( 138 , 111 ,48 )'] },
    { name: "Endesga", sourceUrl: 'https://lospec.com/palette-list/endesga-32', colorValues: ['rgb(24,20,37)', 'rgb(255,255,255)', 'rgb(190,74,47)', 'rgb(215,118,67)', 'rgb(234,212,170)', 'rgb(228,166,114)', 'rgb(184,111,80)', 'rgb(115,62,57)', 'rgb(62,39,49)', 'rgb(162,38,51)', 'rgb(228,59,68)', 'rgb(247,118,34)', 'rgb(254,174,52)', 'rgb(254,231,97)', 'rgb(99,199,77)', 'rgb(62,137,72)', 'rgb(38,92,66)', 'rgb(25,60,62)', 'rgb(18,78,137)', 'rgb(0,153,219)', 'rgb(44,232,245)', 'rgb(192,203,220)', 'rgb(139,155,180)', 'rgb(90,105,136)', 'rgb(58,68,102)', 'rgb(38,43,68)', 'rgb(255,0,68)', 'rgb(104,56,108)', 'rgb(181,80,136)', 'rgb(246,117,122)', 'rgb(232,183,150)', 'rgb(194,133,105)'] },
    { name: "Pastels", sourceUrl: 'http://medialab.github.io/iwanthue/', colorValues: ["#84dcce", "#e8a2bd", "#9dd9b3", "#e5b8e7", "#d2f5c1", "#b8abe1", "#e0d59c", "#87afd9", "#f0b097", "#7cdfea", "#f7abb0", "#5cbbb7", "#cc9dc6", "#aed09e", "#f3daff", "#baab79", "#acd6ff", "#c5a780", "#5bb8cf", "#d1a189", "#acf9ff", "#c1a4b0", "#c8fff6", "#9eadbf", "#fffbe2", "#a6ada7", "#e5fff7", "#a7af93", "#dfe5ff", "#ffdfcb", "#fff5f8", "#ffe3ed"] },
    { name: "Pinks", sourceUrl: 'http://medialab.github.io/iwanthue/', colorValues: ["#d170e6", "#984060", "#9d6fe8", "#e02f87", "#6d4bba", "#ea90b4", "#8a4bc8", "#e9a6db", "#9935b8", "#ba749c", "#b032a2", "#d6a5f2", "#b32c7c", "#a78ad1", "#af3b70", "#785bae", "#e969a2", "#72619d", "#db49af", "#864b6f", "#e97ad3", "#704889", "#c1589b", "#76409a", "#9a4876", "#9c52b5", "#8c588c", "#9c3d92", "#ba76b1", "#8c468c", "#b672c7", "#9166aa"] },
    { name: "Blues", sourceUrl: 'http://medialab.github.io/iwanthue/', colorValues: ["#52e2ff", "#0065cd", "#83fae3", "#0e59ac", "#01ecf1", "#6d91fd", "#5cc4b1", "#596fbb", "#41ebff", "#0065a6", "#8df0fd", "#6b7abc", "#00988c", "#91a6ff", "#02c0c2", "#8cb0ff", "#46adb2", "#007cc5", "#02d8fd", "#476c9c", "#5ed5ff", "#006994", "#a3bdff", "#00a6c5", "#9ba6dd", "#69cae1", "#57b1ff", "#009dc4", "#6ec0ff", "#588cbb", "#00aeeb", "#0098dc"] },
    { name: "CyanMagenta", sourceUrl: 'https://coolors.co/gradient-palette/88ffff-ff44ff?number=30', colorValues: ["#22FFFF", "#44FFFF", "#2AF7FF", "#31F0FF", "#39E8FF", "#40E1FF", "#48D9FF", "#50D1FF", "#57CAFF", "#5FC2FF", "#67BAFF", "#6EB3FF", "#76ABFF", "#7DA4FF", "#859CFF", "#8D94FF", "#948DFF", "#9C85FF", "#A47DFF", "#AB76FF", "#B36EFF", "#BA67FF", "#C25FFF", "#CA57FF", "#D150FF", "#D948FF", "#E140FF", "#E839FF", "#F031FF", "#F72AFF", "#FF88FF", "#FF22FF"] },
    { name: "Greyscale", sourceUrl: 'http://medialab.github.io/iwanthue/', colorValues: ['rgb(0,    0,     0)', 'rgb(8,    8,     8)', 'rgb(16,   16,    16)', 'rgb(24,   24,    24)', 'rgb(32,   32,    32)', 'rgb(40,   40,    40)', 'rgb(48,   48,    48)', 'rgb(56,   56,    56)', 'rgb(64,   64,    64)', 'rgb(72,   72,    72)', 'rgb(80,   80,    80)', 'rgb(88,   88,    88)', 'rgb(96,   96,    96)', 'rgb(104,  104,   104)', 'rgb(112,  112,   112)', 'rgb(120,  120,   120)', 'rgb(128,  128,   128)', 'rgb(136,  136,   136)', 'rgb(144,  144,   144)', 'rgb(152,  152,   152)', 'rgb(160,  160,   160)', 'rgb(168,  168,   168)', 'rgb(176,  176,   176)', 'rgb(184,  184,   184)', 'rgb(192,  192,   192)', 'rgb(200,  200,   200)', 'rgb(208,  208,   208)', 'rgb(216,  216,   216)', 'rgb(224,  224,   224)', 'rgb(232,  232,   232)', 'rgb(242,  242,   242)', 'rgb(255,  255,   255)'] }
]

// TODO: draw dashed indicator line around currently selected color.
// Note: If cur color is not on cur palette, say bc you switched palette, 
// no color in the cur visible palette will have a line drawn around it.

const ColorPalette: React.FC<ColorPaletteProps> = ({ onColorSelect }) => {
    const [currentPaletteIndex, setCurrentPaletteIndex] = useState<number>(6); // default to dani's favorite colors
    const handleNextPalette = () => {
        setCurrentPaletteIndex((prevIndex) => (prevIndex + 1) % PALETTES.length);
    };
    const handlePrevPalette = () => {
        setCurrentPaletteIndex((prevIndex) =>
            prevIndex === 0 ? PALETTES.length - 1 : prevIndex - 1
        );
    };

    return (
        <div>
            <h3>Palette: {PALETTES[currentPaletteIndex].name}</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                {PALETTES[currentPaletteIndex].colorValues.map((color, index) => (
                    <div
                        key={index}
                        onClick={() => { onColorSelect(color); }}
                        style={{
                            width: '30px',
                            height: '30px',
                            backgroundColor: color,
                            cursor: 'pointer',
                            border: '1px solid #000'
                        }}
                    ></div>
                ))}
            </div>
            <div>
                <button onClick={handlePrevPalette}>Prev Palette</button>
                <button onClick={handleNextPalette}>Next Palette</button>
            </div>
        </div>
    );
};

export default ColorPalette;
