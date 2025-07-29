import MonthlyRoutine from "./MonthlyRoutine";
import './MonthlyRoutine.css';

export default function MonthlyView({list, year, month, showActive}) {
    // 렌더링할 루틴 필터링
    const displayedList = list.filter(routine => routine.isClosed !== showActive);

    return <div className={"MR_view_wrapper"}>
        {displayedList.map((item) => (
            <MonthlyRoutine routine={item} key={item.id} year={year} month={month}/>
        ))}
    </div>;
}