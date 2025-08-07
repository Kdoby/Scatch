import Calendar from '../calendar/Calendar';

export default function CalendarPage( { userId, setUserId, fetchUserInfo } ){
    return (
        <Calendar userId={userId} setUserId={setUserId} fetchUserInfo={fetchUserInfo} />
    );
}