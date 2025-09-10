import './MonthlyRoutine.css';

export default function MonthlyRoutine({routine, year, month}) {
    // 이 달이 몇일까지 있는지 받아오기
    const lastDate = new Date(year, month, 0).getDate(); // App.js에서 Month+1 해둠 => 다음달의 0일 = 이번달의 마지막날짜
    // 이 달의 1일이 무슨 요일인지 받아오기(0: 일, 1: 월, ...)
    const firstDay = new Date(year, month-1, 1).getDay();
    const calendarCells = [];
    for(let i=0, j=0; i<lastDate; i++){
        if(j < routine.dates.length && i+1 === parseInt(routine.dates[j].slice(8, 10), 10)) {
            calendarCells.push(true);
            j++;
        }
        else {
            calendarCells.push(false);
        }
    }

    return <div style={{
        border: "black solid 1px",
        borderRadius: "15px",
        backgroundColor: "white",
        width: "249px",
        display: "inline-block",
    }}>
        <div className={"MR_wrapper"}>
            <p>{routine.name}</p>
            <div className={"MR_completedDays"}>
                {Array(firstDay).fill().map((_, i) => (
                    <div className={"nullDay"} key={i}></div>
                ))}
                {calendarCells.map((date, idx) => (
                    <div className={date ? "completedDay" : "noneDay"} key={idx + firstDay}></div>
                ))}
            </div>
            <div className={"MR_stat"}>
                <div className={"MR_achieve"}>{routine.monthlyStatistic}%</div>
                <div className={"MR_num"}>{routine.dates.length}</div>
            </div>
        </div>
    </div>;
}