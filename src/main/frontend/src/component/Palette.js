import { useState } from 'react';
import palettes from "../data/Palettes";

export default function Palette({ paletteN, setColor, clickTF }){
    const [selected, setSelected] = useState(null);

    return (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px",
                      padding: "5px", borderRadius: "5px", boxShadow: "1px 1px 1px 1px rgba(100, 100, 100, 0.3)"}}
        >
        { palettes[paletteN]?.map((color, i) => (
            <label key={i} style={{ cursor: "pointer" }}>
            { clickTF ? (
                <input type="radio" name="palette" checked={selected === i}
                       onChange={() => { setSelected(i); setColor(color); }}
                       style={{ display: "none" }}
                       disabled
                />
            ) : (
                <input type="radio" name="palette" checked={selected === i}
                       onChange={() => { setSelected(i); setColor(color); }}
                       style={{ display: "none" }}
                />
            )}
            <div style={{ borderRadius: "5px", width: "25px", height: "25px",
                          backgroundColor: color, border: selected === i ? "3px solid blue" : "2px solid #ccc",
                          display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
                {selected === i && (
                    <span
                        style={{
                          color: "blue",
                          fontSize: "16px",
                          fontWeight: "bold",
                          lineHeight: "1",
                        }}
                      > ✓ </span>
                )}
            </div>
          </label>
        ))}
      </div>
    );

}