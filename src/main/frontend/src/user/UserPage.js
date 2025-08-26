import Palette from '../component/Palette';

import api from '../api';

import {useEffect, useState} from "react";

export default function UserPage () {
    const [palette, setPalette] = useState(1);

    // 팔레트 조회
    const fetchPalette = async () => {
        try {
            const res = await api.get('/member/palette');

            //alert(res.data.message + res.data.data);
            setPalette(res.data.data);
            console.log("fetchPalette 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // 팔레트 색상 변경
    const changePalette = async (num) => {
        try {
            await api.put( '/member/palette', null, { params: { number: num } } );

            //alert(res.data.message + res.data.data);
            setPalette(num);
            console.log(num + "으로 Palette 변경됨");
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    useEffect(() => {
        fetchPalette();
    }, []);

    return (
        <div style={{textAlign:"left"}}>
            <div style={{ margin:"30px 0", fontWeight:"bold", fontSize:"30px" }}>설정</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", fontSize:"20px" }}>
                <div>팔레트 설정</div>
                <div>
                    <select value={String(palette)} onChange={(e) => changePalette(Number(e.target.value))}>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                </div>
                <div>
                </div>
                <div>
                    <Palette palletN={palette}/>
                </div>
            </div>
        </div>
    );
}