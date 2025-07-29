import './WeeklyRoutine.css';

export default function WeeklyRoutine({routine}) {
    const calenderCells = [];
    for(let i=1, j=0;i<=7;i++){
        if(j < routine.days.length && i === routine.days[j]){
            calenderCells.push(true);
        }
        else {
            calenderCells.push(false);
        }
    }
    return <div>
        <div className={"WR_wrapper"}>
            <p className={"WR_name"}>{routine.name}</p>
            <p className={"WR_achieve"}>{routine.weeklyStatistic}%</p>
            <div className={"WR_log_wrapper"}>
                {calenderCells.map((date, idx) => (
                    <div className={date ? "WR_log_date_T" : "WR_log_date_F"} key={idx} ></div>
                ))}
            </div>
        </div>
    </div>
}