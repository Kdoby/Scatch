import './Advice.css';

import { TokenStore } from "../TokenStore";
import api from '../api';

import React, {useState, useEffect} from 'react';
import axios from 'axios';

export default function Advice({ todayDate }){
    const [adv, setAdv] = useState('');
    const [saveAdvState, setSaveAdvState] = useState(false);

    // lesson 조회
    const initialAdvSetting = async () => {
        if(!todayDate) { return; }

        console.log(saveAdvState);

        console.log(TokenStore.getToken());

        try{
            const response = await api.get(`/todo/lesson/${todayDate}`);

            console.log(response.data);

            if (!response.data.id) {
                newAdvice();
                setSaveAdvState(false);
            } else{
                setAdv(response.data);
                setSaveAdvState(true);
            }
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // lesson 등록
    const saveAdv = async () => {
        if(!adv.content) { return; }

        try{
            const response = await api.post('/todo/lesson', {
                content: adv.content,
                contentWriter: adv.contentWriter,
                lessonDate: todayDate
            });
            setAdv(prev => ({
                ...prev,
                id: response.data.lessonId
            }));

            setSaveAdvState(true);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // lesson 삭제
    const deleteAdv = async () => {
        if(!adv.content) { return; }

        try{
            const response = await api.delete('/todo/lesson/' + adv.id);
            setSaveAdvState(false);
            newAdvice();
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }


    // 새 lesson 랜덤으로
    const newAdvice = async () => {
        try {
            const response = await axios.get('https://korean-advice-open-api.vercel.app/api/advice');
            setAdv({
                content: response.data.message,
                contentWriter: response.data.author
            });
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    useEffect(() => {
        console.log("todayDate: " + todayDate);

        initialAdvSetting();
    }, [todayDate]);

    useEffect(() => {
        console.log(adv);
    }, [adv]);


    return (
        <div style={{ width: "100%",
                      height: "100%",
                      margin: "0 auto",
                      backgroundColor: "lightGray"
                   }}
        >
            <div style={{margin:"0 10px"}}>
                {!saveAdvState ? (
                    <>
                        <img src="images/star.png"
                             onClick={() => saveAdv()}
                        />
                        <img src="images/random.png"
                             onClick={() => newAdvice()} />
                    </>
                ) : (
                    <img src="images/coloredStar.png"
                         onClick={(e) => deleteAdv()}/>
                )}

            </div>

            <div style={{ fontSize:"30px", textAlign:"center", margin:"0 20px"}}
                 key={adv.id}
            >
                <span>{adv.content}</span>
                <br />
                <span style={{fontSize:"20px"}}>-{adv.contentWriter}</span>
            </div>

        </div>
    );
}