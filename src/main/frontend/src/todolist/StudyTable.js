import './StudyLog.css';

export default function StudyTable({ list }) {
    const TABLE_WIDTH = 240; // table 전체 width
    const CELL_HEIGHT = 30; // cell 한 칸의 height
    return (
        <div className={"SL_Grid"}>

            {[...Array(24)].map((_, rowIdx) => (
                <>
                    <div className={"SL_timecell"}>
                        {(rowIdx+6 > 24) ? rowIdx - 18 : rowIdx + 6}
                    </div>
                    {[...Array(6)].map((_, colIdx) => (
                        <div className={"SL_cell"} key={`cell-${rowIdx}-${colIdx}`}></div>
                    ))}
                    <br/>
                </>
            ))}
            {list.map((item) => {
                let startH = parseInt(item.startTime.slice(11, 13));
                const startM = parseInt(item.startTime.slice(14, 16));
                let endH = parseInt(item.endTime.slice(11, 13));
                const endM = parseInt(item.endTime.slice(14, 16));
                
                // 자정을 넘긴 기록 시간처리
                if (startH >= 1 && startH <=5) {
                    startH += 24;
                }
                if (endH >= 1 && endH <=5) {
                    endH += 24;
                }
                
                let left = 30 + startM * 3.5;
                let width = ((endH - startH) * 60 + (endM - startM)) * 3.5;
                let top = (startH - 6) * CELL_HEIGHT;

                const blocks = [];
                let currentLeft = left;
                let currentTop = top;
                let remainingWidth = width;

                const id = item.id;

                while (currentLeft + remainingWidth > TABLE_WIDTH) {
                    const fitWidth = TABLE_WIDTH - currentLeft;
                    blocks.push(
                        <div key={`${id}-${blocks.length}`}
                             style={{
                                 top: `${currentTop}px`,
                                 left: `${currentLeft}px`,
                                 height: `${CELL_HEIGHT}px`,
                                 width: `${fitWidth}px`,
                                 position: 'absolute',
                                 backgroundColor: item.categoryColor,
                                 border: '1px solid #999',
                                 padding: '4px',
                                 boxSizing: 'border-box',
                                 fontSize: '10px'
                             }}
                        ></div>
                    );
                    remainingWidth -= fitWidth;
                    currentLeft = 30; // 다음 줄은 왼쪽부터
                    currentTop += CELL_HEIGHT; // 아래로 이동
                }

                // 마지막 블록
                blocks.push(
                    <div key={`${id}-${blocks.length}`}
                         style={{
                             top: `${currentTop}px`,
                             left: `${currentLeft}px`,
                             height: `${CELL_HEIGHT}px`,
                             width: `${remainingWidth}px`,
                             position: 'absolute',
                             backgroundColor: item.categoryColor,
                             border: '1px solid #999',
                             padding: '4px',
                             boxSizing: 'border-box',
                             fontSize: '10px'
                         }}
                    ></div>
                );

                return blocks;
            })}
        </div>
    );
}