//**************************************************************************
// Calendar

drop table if exists event CASCADE;
CREATE TABLE event (
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) NOT NULL,
    title varchar(255) default '내 일정',
    color varchar(10) default '#0000FF',
    memo varchar(255),
    start_date DATE not null,
    start_time TIME,
    end_date DATE not null,
    end_time TIME,
    repeat varchar(10) default 'none',
    repeat_end_date DATE,
    repeat_end_time TIME
);

// none인 경우, 반복 x, none이 아닌 경우 반복 o ->
// 보통 PK, FK의 이름은 동일하게
// 1. 시작 날짜, 종료 날짜만 존재 -> 하루종일
// 2. 시작 날짜, 시작 시간, 종료 날짜, 종료 시간 존재
   // -> if) 시작 시간 > 종료 시간 : 안되게 막기
   // -> if) 시작 시간 == 종료 시간 : 시간 존재하는 일정(범위는 x, ex) 5시에 뭐 하기)
   // -> if) 시작 시간 < 종료 시간 : 시간 범위가 존재하는 일정(ex) 5시부터 6시까지 뭐 하기)

// 1. 시작 날짜 : single-day-event, 시간 없음 (하루 종일)
// 2. 시작 날짜, 시작 시간 : single-day-event, 시간 존재
// 3. 시작 날짜, 종료 날짜 : multi-day-event, 시간 없음
// 4. 시작 날짜, 시작 시간, 종료 날짜, 종료 시간 : multi-day-event, 시간 존재
// end_date_time < start_date_time 이면 x




//**************************************************************************
// TimeTable

drop table if exists time_table CASCADE;
create table time_table
(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) NOT NULL,
    name varchar(255) DEFAULT 'untitled',
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    is_main BOOLEAN DEFAULT false
);

drop table if exists course CASCADE;
create table course
(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) NOT NULL,
    title varchar(255) NOT NULL,
    instructor varchar(255),
    color varchar(10) default '#0000FF'
);

drop table if exists time_table_detail CASCADE;
create table time_table_detail
(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    time_table_id bigint,
    course_id bigint,
    weekday int NOT NULL,
    location varchar(100),
    start_time TIME,
    end_time TIME,
    FOREIGN KEY(time_table_id) REFERENCES time_table(id) ON DELETE CASCADE,
    FOREIGN KEY(course_id) REFERENCES course(id) ON DELETE CASCADE
);

drop table if exists assignment CASCADE;
create table assignment
(
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) NOT NULL,
    course_id bigint,
    course_title varchar(255),
    color varchar(10),
    title varchar(255) NOT NULL,
    deadline DATETIME
);



//**************************************************************************
// Routine

drop table if exists routine CASCADE;
CREATE TABLE routine (
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) not null,
    routine_name varchar(255) not null,
    start_date DATE not null,
    end_date DATE,
    is_closed BOOLEAN default false
);

drop table if exists routine_log CASCADE;
CREATE TABLE routine_log (
    id bigint AUTO_INCREMENT PRIMARY KEY,
    routine_id bigint,
    log_date DATE,
    is_completed BOOLEAN default false
);

drop table if exists repeat_days CASCADE;
CREATE TABLE repeat_days (
    id bigint AUTO_INCREMENT PRIMARY KEY,
    routine_id bigint,
    week_of_day int not null
);


//**************************************************************************
// Member
// 1 = 일, 2 = 월, ... , 7 = 토

drop table if exists member CASCADE;
CREATE TABLE member (
    id bigint AUTO_INCREMENT PRIMARY KEY,
    username varchar(50) not null unique,
    password varchar(255) not null,
    email varchar(255) not null,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    refresh_token varchar(255),
    refresh_token_expiry DATETIME
);
