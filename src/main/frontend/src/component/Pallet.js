export default function Pallet({ palletN }){
    // 🎀 Set 1 – Spring Pastel
    const colors1 = [
        "#FFB3BA", // Pastel Pink
        "#FFDFBA", // Peach Cream
        "#FFFFBA", // Lemon Chiffon
        "#BAFFC9", // Mint Green
        "#BAE1FF", // Baby Blue
        "#E3BAFF"  // Lavender
    ];

    // 🌊 Set 2 – Summer Breeze
    const colors2 = [
        "#A3D8F4", // Sky Blue
        "#A5F3E1", // Aqua Mint
        "#FFF5BA", // Pastel Yellow
        "#FFCCE5", // Pastel Rose
        "#CBA6F7", // Lilac Purple
        "#FFD6A5"  // Pastel Orange
    ];

    // 🍂 Set 3 – Autumn Calm
    const colors3 = [
        "#FFD6A5", // Apricot Cream
        "#FFB5A7", // Blush Pink
        "#E2F0CB", // Sage Green
        "#B5EAD7", // Mint Turquoise
        "#C7CEEA", // Soft Violet
        "#FFDAC1"  // Pale Peach
    ];

    // ❄️ Set 4 – Winter Soft
    const colors4 = [
        "#C9F2F2", // Icy Aqua
        "#E0BBE4", // Lavender Mist
        "#FEC8D8", // Rose Quartz
        "#FFDFD3", // Peach Whisper
        "#FFFFD1", // Frost Yellow
        "#D1F7C4"  // Mint Frost
    ];

    // 🌈 Set 5 – Playful Crayon
    const colors5 = [
        "#FFADAD", // Candy Red
        "#FFD6A5", // Soft Orange
        "#FDFFB6", // Butter Yellow
        "#CAFFBF", // Soft Green
        "#9BF6FF", // Powder Blue
        "#BDB2FF"  // Pastel Purple
    ];

    const palettes = [
        null,
        colors1,
        colors2,
        colors3,
        colors4,
        colors5
    ];

    return (
        <div style={{ display:"grid", gridTemplateColumns:'1fr 1fr 1fr', gap:"5px", padding:"5px",
                      borderRadius:"5px", boxShadow: "1px 1px 1px 1px rgba(100, 100, 100, 0.3)"}}>
            {palettes[palletN].map((color, i) => (
                <div key={i}
                     style={{ borderRadius: "5px", width: "25px", height: "25px", backgroundColor: color }}
                >
                </div>
                ))}
        </div>
    );
}