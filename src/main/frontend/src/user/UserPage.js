import Palette from '../component/Palette';

import api from '../api';

import {useEffect, useState} from "react";

export default function UserPage () {
    const [myInfo, setMyInfo] = useState({
        paletteNumber: 1,
        nickname: '',
        intro: '',
        profileImagePath: ''
    });
    const [pwd, setPwd] = useState({
       currentPassword: '',
       newPassword: ''
   });


    // 내 정보 조회
    const fetchMyInfo = async () => {
        try {
            const res = await api.get('/member/profile');

            setMyInfo(res.data);
            console.log("fetchMyInfo 받아오기: ", res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }
    }

    // 한 줄 소개, 닉네임 변경
    const uploadIntroNicknamePalette = async () => {
        console.log("수정: ", myInfo);

        try {
            const res = await api.put('/member/profile', {
                paletteNumber: myInfo.paletteNumber,
                nickname: myInfo.nickname,
                intro: myInfo.intro
            });

            alert(res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    // 팔레트 변경
    const changePalette = async (pn) => {
        console.log("수정: ", myInfo);

        try {
            const res = await api.put('/member/profile', {
                paletteNumber: pn,
                nickname: myInfo.nickname,
                intro: myInfo.intro
            });

            alert(res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    // 비밀번호 변경
    const changePassword = async (pn) => {
        console.log("수정: ", myInfo);

        try {
            const res = await api.put('/auth/password', {
                currentPassword: pwd.currentPassword,
                newPassword: pwd.newPassword
            });

            alert(res.data);
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    useEffect(() => {
        fetchMyInfo();
    }, []);

    useEffect(() => {
        console.log("111111111: " + myInfo);
    }, [myInfo]);

    return (
        <div style={{textAlign:"left"}}>
            <div style={{ margin:"30px 0", fontWeight:"bold", fontSize:"30px" }}>설정</div>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        uploadIntroNicknamePalette();
                    }}
                     style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px" }}
                >
                <div>프로필 사진</div>
                <div>
                    <div style={{ width: "10%" }}>
                        <img src={ `http://localhost:8080/uploads/${myInfo.storedFileName}` }
                             alt={ myInfo.originalFileName } />

                    </div>
                    <input type="file"
                           style={{ width:"100%", padding: "10px" }} />
                </div>
                <div></div>
                <div>
                    <button type="submit" style={{ width:"100%", padding: "10px" }}>프로필 save</button>
                </div>
                </form>

                <br /><br />

                <form onSubmit={(e) => {
                        e.preventDefault();
                        uploadIntroNicknamePalette();
                      }}
                      style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px" }}
                >
                    <div>한 줄 소개</div>
                    <div>
                        <input
                            defaultValue={myInfo.intro}
                            onChange={(e) => setMyInfo({ ...myInfo, intro: e.target.value })}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div>Nickname</div>
                    <div>
                        <input
                            defaultValue={myInfo.nickname}
                            onChange={(e) => setMyInfo({ ...myInfo, nickname: e.target.value })}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div></div>
                    <div>
                        <button type="submit" style={{ width:"100%", padding: "10px" }}>한 줄 소개, 닉네임 save</button>
                    </div>
                </form>

                <form onSubmit={(e) => {
                        e.preventDefault();
                        changePassword();
                      }}
                      style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px" }}
                >
                    <div>비밀번호</div>
                    <div>
                        기존 비밀번호:
                        <input style={{ width:"100%", padding: "10px" }}
                               onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}/>

                        <br />

                        새 비밀번호:
                            <input style={{ width:"100%", padding: "10px" }}
                                   onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}/>
                    </div>

                    <div></div>
                    <div>
                        <button type="submit" style={{ width:"100%", padding: "10px" }}>pwd save</button>
                    </div>
                </form>

                <div></div><div></div>

                <div></div><div></div>


                <div></div><div></div><div></div><div></div><div></div><div></div>

                <div>팔레트 설정</div>
                <div>
                    <select value={Number(myInfo.paletteNumber)}
                            onChange={(e) => {
                                changePalette(e.target.value);
                            }}
                    >

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
                    <Palette paletteN={myInfo.paletteNumber} clickTF={true}/>
                </div>

            </div>
        </div>
    );
}