import "./Calendar.css";
import Calendar_detail from "./Calendar_detail";
import assignEventLinesByDay from "./assignEventLinesByDay";

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function Calendar() {
    const calendarRef = useRef(null);
    const [selectedDate, setSelectedDate] = useState(null);  // Calendar_detail 의 날짜
    const [date, setDate] = useState(new Date()); // 달력에 표시되는 날짜
    const today = new Date();  // 오늘 날짜
    const [event, setEvent] = useState([]);
    const [assignment, setAssignment] = useState([]);
    const [assignmentToggle, setAssignmentToggle] = useState(true);
    const [eventToggle, setEventToggle] = useState(true);


    // 달력의 한 달 일정을 fetch
    const fetchEvent = async () => {

        console.log("token: " + TokenStore.getToken());
        console.log(selectedDate?.getFullYear() + " " + (selectedDate?.getMonth() + 1));
        if(!selectedDate) return;

        try {
            const response = await api.get('/calendar', {
                params: {
                    year: selectedDate?.getFullYear(),
                    month: selectedDate?.getMonth() + 1
                }
            });

            setEvent(response.data);
            console.log("fetchEvent: ");
            console.log(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    // 달력의 한 달 일정을 fetch
    const fetchAssignment = async () => {
        console.log(selectedDate?.getFullYear() + " " + (selectedDate?.getMonth() + 1));
        if(!selectedDate) return;

        try {
            const response = await api.get('/assignment/monthly/' +
                             selectedDate?.getFullYear() + '/' + (selectedDate?.getMonth() + 1));

            setAssignment(response.data);

            console.log("fetchAssignment: ");
            console.log(response.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    };

    useEffect(() => {
    console.log("#################");
        if (selectedDate) {
            fetchEvent();
            fetchAssignment();
        }
    }, [selectedDate]);

    useEffect(() => {
        render();
    }, [date, event]);

    useEffect(() => {
        setSelectedDate(today);
    }, [])

    let eventToggleState = true;
    let assignmentToggleState = true;

    function render() {
        const container = calendarRef.current;
        if (!container) return;

        container.className = "calendar-frame";
        container.innerHTML = "";

        // 헤더
        const header = document.createElement("div");
        header.className = "calendar-header";
        header.style.position = "relative";
        header.style.display = "flex";
        header.style.alignItems = "center";
        header.style.justifyContent = "space-between";
        header.style.width = "100%";

        // 왼쪽 (< 버튼)
        const leftControl = document.createElement("div");

        // 중앙 (절대 위치, 폭 가운데)
        const centerControl = document.createElement("div");
        centerControl.style.position = "absolute";
        centerControl.style.left = "50%";
        centerControl.style.transform = "translateX(-50%)";
        centerControl.style.display = "flex";
        centerControl.style.alignItems = "center";
        centerControl.style.gap = "8px";

        const title = document.createElement("div");
        title.className = "calendar-title";
        title.style.fontSize = "35px";
        title.style.fontWeight = "bold";
        title.textContent = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        const todayBtn = document.createElement("button");
        todayBtn.textContent = "Today";
        todayBtn.className = "calendar-today-button";
        todayBtn.addEventListener("click", () => goToToday());

        const prevBtn = document.createElement("img");
        prevBtn.src = "images/left.png";
        prevBtn.alt = "left";
        prevBtn.style.margin = "0";
        prevBtn.style.height = "40px";
        prevBtn.addEventListener("click", () => changeMonth(-1));

        const nextBtn = document.createElement("img");
        nextBtn.src = "images/right.png";
        nextBtn.alt = "right";
        nextBtn.style.margin = "0";
        nextBtn.style.height = "40px";
        nextBtn.addEventListener("click", () => changeMonth(1));

        centerControl.appendChild(prevBtn); // 왼쪽 화살표
        centerControl.appendChild(title);
        centerControl.appendChild(todayBtn);
        centerControl.appendChild(nextBtn); // 오른쪽 화살표

        // 오른쪽 (토글)
        const rightControl = document.createElement("div");
        rightControl.style.display = "flex";
        rightControl.style.alignItems = "center";
        rightControl.style.gap = "20px";

        // event 토글
        const eventCheckbox = document.createElement("input");
        eventCheckbox.type = "checkbox";
        eventCheckbox.id = "eventCheck";
        eventCheckbox.checked = true;

        const eventLabel = document.createElement("label");
        eventLabel.htmlFor = "eventCheck";
        eventLabel.appendChild(document.createTextNode(" event"));

        // assignment 토글
        const assignmentCheckbox = document.createElement("input");
        assignmentCheckbox.type = "checkbox";
        assignmentCheckbox.id = "assignmentCheck";
        assignmentCheckbox.checked = true;

        const assignmentLabel = document.createElement("label");
        assignmentLabel.htmlFor = "assignmentCheck";
        assignmentLabel.style.marginLeft = "10px";
        assignmentLabel.appendChild(document.createTextNode(" assignment"));

        // change 이벤트 리스너 등록
        eventCheckbox.addEventListener("change", (e) => {
            eventToggleState = e.target.checked;
            renderDays(daysContainer); // 즉시 반영
        });

        assignmentCheckbox.addEventListener("change", (e) => {
            assignmentToggleState = e.target.checked;
            renderDays(daysContainer); // 즉시 반영
        });

        rightControl.appendChild(eventCheckbox);
        rightControl.appendChild(eventLabel);
        rightControl.appendChild(assignmentCheckbox);
        rightControl.appendChild(assignmentLabel);

        // 배치
        header.appendChild(leftControl);
        header.appendChild(centerControl);
        header.appendChild(rightControl);
        container.appendChild(header);

        // 요일 헤더 생성
        const weekdays = ["SUN", "MON", "TUE", "WED", "THR", "FRI", "SAT"];
        const weekdaysRow = document.createElement("div");
        weekdaysRow.className = "calendar-weekdays";
        weekdays.forEach(day => {
            const dayElement = document.createElement("div");
            dayElement.className = "calendar-weekday";
            dayElement.textContent = day;
            weekdaysRow.appendChild(dayElement);
        });

        const daysContainer = document.createElement("div");
        daysContainer.className = "calendar-days";

        const container_inner = document.createElement("div");
        container_inner.className = "calendar-frame2";
        container_inner.appendChild(weekdaysRow);
        container_inner.appendChild(daysContainer);

        container.appendChild(container_inner);

        renderDays(daysContainer);
    }

    function renderDays(daysContainer) {
        daysContainer.innerHTML = "";

        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1).getDay();
        const lastDate = new Date(year, month + 1, 0).getDate();

        const { eventLineByDay, assignmentLineByDay } = assignEventLinesByDay(event, assignment, year, month);

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("calendar-day", "empty");
            daysContainer.appendChild(emptyDiv);
        }

        for (let day = 1; day <= lastDate; day++) {
            const key = `${month}-${day}`;
            const eventLines = eventLineByDay[key] || [];
            const assignmentLines = assignmentLineByDay[key] || [];

            const dayDiv = document.createElement("div");
            dayDiv.classList.add("calendar-day", key);

            const dateDiv = document.createElement("div");
            dateDiv.textContent = day;
            dateDiv.classList.add("calendar-day-number");
            dayDiv.appendChild(dateDiv);

            dayDiv.addEventListener("click", () => {
                setSelectedDate(new Date(year, month, day));
            });

            // 사용한 줄 수 제한을 위한 변수(최대 4)
            let totalLineUsed = 4;
            if( eventToggleState ){
                // 하루에 몇 줄? 일지 lineIndex < 4 이걸로 결정
                for (let lineIndex = 0; lineIndex < eventLines.length && totalLineUsed > 0; lineIndex++) {
                    const e = eventLines[lineIndex];
                    if(e){
                        const dayScheduleDiv = document.createElement("div");
                        dayScheduleDiv.style.height = "20px";
                        dayScheduleDiv.classList.add("calendar-day-info", `event-line-${lineIndex}`);

                        const eventStartDate = new Date(e.startDateTime);
                        const eventEndDate = new Date(e.endDateTime);

                        if(eventStartDate.getFullYear() === eventEndDate.getFullYear()
                           && eventStartDate.getMonth() === eventEndDate.getMonth()
                           && eventStartDate.getDate() === eventEndDate.getDate()
                           && eventStartDate.getHours() === 0 && eventStartDate.getMinutes() === 0 && eventStartDate.getSeconds() === 0
                           && eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59 && eventEndDate.getSeconds() === 59
                        ){
                            dayScheduleDiv.style.backgroundColor = e.color;
                            dayScheduleDiv.style.borderRadius = "5px";
                        }  // 오늘 하루 종일 일정일 때
                        else if (eventStartDate.getMonth() != eventEndDate.getMonth()
                                 || eventStartDate.getDate() != eventEndDate.getDate()){
                            if(eventStartDate.getMonth() === month && eventStartDate.getDate() === day){
                                dayScheduleDiv.style.setProperty("border-radius", "5px 0 0 5px");
                            }
                            if(eventEndDate.getMonth() === month && eventEndDate.getDate() === day){
                                dayScheduleDiv.style.setProperty("border-radius", "0 5px 5px 0");
                            }
                            dayScheduleDiv.style.backgroundColor = e.color;
                        }  // 하루 이상의 일정일 때

                        const titleDiv = document.createElement("div");
                        titleDiv.textContent = e.title;
                        titleDiv.style.padding = "0px";
                        titleDiv.style.lineHeight = "20px";

                        const colorDiv = document.createElement("div");
                        if(eventStartDate.getFullYear() === eventEndDate.getFullYear()
                           && eventStartDate.getMonth() === eventEndDate.getMonth()
                           && eventStartDate.getDate() === eventEndDate.getDate()
                           && !(eventStartDate.getHours() === 0 && eventStartDate.getMinutes() === 0 && eventStartDate.getSeconds() === 0
                                && eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59 && eventEndDate.getSeconds() === 59)
                        ){
                            colorDiv.style.backgroundColor = e.color;
                        }
                        else{
                            // 보류
                            // titleDiv.style.color = "white";
                        }
                        titleDiv.classList.add("calendar-day-info-title");
                        colorDiv.classList.add("calendar-day-info-color");

                        dayScheduleDiv.appendChild(colorDiv);
                        dayScheduleDiv.appendChild(titleDiv);
                        totalLineUsed--;
                        dayDiv.appendChild(dayScheduleDiv);
                    }
                }
            }

            if( assignmentToggleState ) {
                // assignment 출력
                for (let lineIndex = 0; lineIndex < assignmentLines.length && totalLineUsed > 0; lineIndex++) {
                    const e = assignmentLines[lineIndex];

                    if(e){
                        const dayScheduleDiv = document.createElement("div");
                        dayScheduleDiv.style.height = "20px";
                        dayScheduleDiv.classList.add("calendar-day-info", `assignment-line-${lineIndex}`);

                        const eventStartDate = new Date(e.startDateTime);
                        const eventEndDate = new Date(e.endDateTime);

                        dayScheduleDiv.style.borderRadius = "5px";
                        dayScheduleDiv.style.border = `solid 2px ${e.color}`;

                        // assignment에 시간 쓰기 위해
                        const deadlineDate = new Date(e.deadline);
                        const hours = deadlineDate.getHours().toString().padStart(2, '0');
                        const minutes = deadlineDate.getMinutes().toString().padStart(2, '0');

                        const titleDiv = document.createElement("div");
                        titleDiv.textContent = `${hours}:${minutes} ${e.title}`;
                        titleDiv.style.padding = "0px";
                        titleDiv.style.lineHeight = "20px";

                        const colorDiv = document.createElement("div");
                        if(eventStartDate.getFullYear() === eventEndDate.getFullYear()
                           && eventStartDate.getMonth() === eventEndDate.getMonth()
                           && eventStartDate.getDate() === eventEndDate.getDate()
                           && !(eventStartDate.getHours() === 0 && eventStartDate.getMinutes() === 0 && eventStartDate.getSeconds() === 0
                                && eventEndDate.getHours() === 23 && eventEndDate.getMinutes() === 59 && eventEndDate.getSeconds() === 59)
                        ){
                            colorDiv.style.backgroundColor = e.color;
                        }
                        else{
                            // 보류
                            // titleDiv.style.color = "white";
                        }
                        titleDiv.classList.add("calendar-day-info-title");
                        colorDiv.classList.add("calendar-day-info-color");

                        dayScheduleDiv.appendChild(colorDiv);
                        dayScheduleDiv.appendChild(titleDiv);
                        totalLineUsed--;
                        dayDiv.appendChild(dayScheduleDiv);
                    }


                }
            }


            for(let i = 0; totalLineUsed > 0; i++){
                const dayScheduleDiv = document.createElement("div");
                dayScheduleDiv.style.height = "20px";
                dayScheduleDiv.classList.add("calendar-day-info", `empty-line-${i}`);
                dayScheduleDiv.style.visibility = "hidden"; // 공간은 차지하되 안 보이게
                totalLineUsed--
                dayDiv.appendChild(dayScheduleDiv);
            }


            // 오늘 날짜 표시
            if (
                year === today.getFullYear() &&
                month === today.getMonth() &&
                day === today.getDate()
            ) {
                dayDiv.classList.add("today");
            }

            daysContainer.appendChild(dayDiv);
        }

        // 마지막 날짜가 어떤 요일인지 구하기
        const lastDayOfWeek = new Date(year, month, lastDate).getDay(); // 0(일) ~ 6(토)

        // 남은 칸 채우기
        for (let i = lastDayOfWeek; i < 6; i++) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("calendar-day", "empty");
            daysContainer.appendChild(emptyDiv);
        }
    }



    function changeMonth(offset) {
        setDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + offset);
            return newDate;
        });
    }

    function goToToday() {
        setDate(new Date(today));
        setSelectedDate(new Date(today));

        if (selectedDate) {
            fetchEvent();
        }
    }


    return (
        <div>
            <div ref={calendarRef}></div>
            <Calendar_detail selectedDate={selectedDate} changeMonth={changeMonth} fetchEvent={fetchEvent} date={date} />
        </div>
    );
}
