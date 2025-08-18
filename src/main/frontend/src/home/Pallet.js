export default function Pallet(){
    const colors = [
      "#845EC2",
      "#D65DB1",
      "#FF6F91",
      "#FF9671",
      "#FFC75F",
      "#F9F871"
    ];

    return (
        <div style={{ display:"grid", gridTemplateColumns:'1fr 1fr 1fr', gap:"5px", padding:"5px",
                      borderRadius:"5px", boxShadow: "1px 1px 1px 1px rgba(100, 100, 100, 0.3)"}}>
            {colors.map((color, i) => (
                <div key={i}
                     style={{ borderRadius: "5px", width: "25px", height: "25px", backgroundColor: color }}
                >
                </div>
                ))}
        </div>
    );
}