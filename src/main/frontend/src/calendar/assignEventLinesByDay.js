export default function assignEventLinesByDay(events, assignments, year, month) {
    const lastDate = new Date(year, month + 1, 0).getDate();

    // 두 타입의 라인 맵 따로 관리
    const eventLineByDay = {};
    const assignmentLineByDay = {};

    // 날짜별 데이터 담을 배열
    const dayToEvents = Array.from({ length: lastDate + 1 }, () => []);
    const dayToAssignments = Array.from({ length: lastDate + 1 }, () => []);

    // 🔹 1. 이벤트 날짜별 정리
    events.forEach((e) => {
        const start = new Date(e.startDateTime);
        const end = new Date(e.endDateTime);

        for (let d = start.getDate(); d <= end.getDate(); d++) {
            if (start.getFullYear() === year && start.getMonth() === month) {
                dayToEvents[d].push(e);
            }
        }
    });

    // 🔹 2. 과제 날짜별 정리
    assignments.forEach((a) => {
        const start = new Date(a.deadline); // 과제는 마감일 하나만 있다고 가정
        if (start.getFullYear() === year && start.getMonth() === month) {
            dayToAssignments[start.getDate()].push(a);
        }
    });

    // 🔹 3. 공통 줄 배치 로직
    const assignLines = (dayToItems, lineByDay) => {
        for (let day = 1; day <= lastDate; day++) {
            const key = `${month}-${day}`;
            const lines = Array(10).fill(null);  // 최대 10줄 가정
            const todayItems = dayToItems[day];
            const assignedIds = new Set();

            // 전날 줄 유지
            if (lineByDay[`${month}-${day - 1}`]) {
                const prev = lineByDay[`${month}-${day - 1}`];
                prev.forEach((item, i) => {
                    if (!item) return;
                    const end = new Date(item.endDateTime || item.deadline);
                    if (end.getDate() >= day) {
                        lines[i] = { ...item };
                        assignedIds.add(item.id);
                    }
                });
            }

            // 남은 아이템 줄 할당
            for (const item of todayItems) {
                if (assignedIds.has(item.id)) continue;

                for (let i = 0; i < lines.length; i++) {
                    if (!lines[i]) {
                        lines[i] = { ...item };
                        assignedIds.add(item.id);
                        break;
                    }
                }
            }

            lineByDay[key] = lines;
        }
    };

    // 🔹 이벤트, 과제 각각 줄 계산
    assignLines(dayToEvents, eventLineByDay);
    assignLines(dayToAssignments, assignmentLineByDay);

    // 🔹 두 개 따로 반환
    return { eventLineByDay, assignmentLineByDay };
}