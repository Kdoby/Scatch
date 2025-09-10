import Palette from '../component/Palette';

import api from '../api';
import { TokenStore } from '../TokenStore';

import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

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
    const [profile, setProfile] = useState(null);


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
    const changeIntroNicknamePalette = async () => {
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
        try {
            const res = await api.put('/member/profile', {
                paletteNumber: pn,
                nickname: myInfo.nickname,
                intro: myInfo.intro
            });

            alert("팔레트를 변경하였습니다.");
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    // 비밀번호 변경
    const navigate = useNavigate();
    const changePassword = async (pn) => {
        try {
            const res = await api.put('/auth/password', {
                currentPassword: pwd.currentPassword,
                newPassword: pwd.newPassword
            });

            alert(res.data + " 다시 로그인 해주세요.");

            // 로그아웃
            try {
                await api.post('/auth/logout');
            }catch (err) {
                alert("로그아웃 실패");
            }

            TokenStore.clearToken();
            navigate('/login');
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    // 프로필 변경
    const changeProfile = async (pn) => {
        if (!profile) { return; }

        const formData = new FormData();
        formData.append("file", profile);

        try {
            const res = await api.post('/member/profile/upload', formData);

            alert("프로필 사진을 변경하였습니다.");
        } catch (e) {
            console.error("fail fetch: ", e);
        }

        // 변경하고 myInfo 다시 받아오기
        fetchMyInfo();
    }

    // 회원 탈퇴
    const withdrawMembership = async () => {
        if(window.confirm("회원 탈퇴 하시겠습니까?")){
            const pwd = prompt('회원 탈퇴를 하기 위해 비밀번호를 입력하세요.');

            try {
                const res = await api.delete('/auth/delete', {
                    data: { password: pwd }
                });

                alert(res.data);

                TokenStore.clearToken();
                navigate('/login');
            } catch (e) {
                alert("비밀번호가 일치하지 않습니다. 회원 탈퇴가 실패하였습니다.");
                console.error("fail fetch: ", e);
            }


        }

    }

    useEffect(() => {
        fetchMyInfo();
    }, []);

    return (
        <div style={{ textAlign:"left", }}>
            <div style={{ margin:"30px 0", fontWeight:"bold", fontSize:"30px" }}>설정</div>
            <div>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        changeProfile();
                    }}
                     style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px", alignItems:"center", }}
                >
                <div style={{ margin: 0 }}>프로필 사진</div>
                <div style={{ margin: 0 }}>
                    <div style={{ width: "20%", margin: 0 }}>
                        <img alt="profile" src={myInfo.profileImagePath}
                             style={{width:"100%"}}
                        />

                    </div>
                    <input type="file"
                           style={{ width:"100%", padding: "10px", margin: 0 }}
                           onChange={(e) => setProfile(e.target.files[0])}
                    />
                </div>
                <div style={{ margin: 0 }}></div>
                <div style={{ margin: 0 }}>
                    <button type="submit" style={{ width:"100%", padding: "10px" }}>프로필 save</button>
                </div>
                </form>

                <br /><br />

                <form onSubmit={(e) => {
                        e.preventDefault();
                        changeIntroNicknamePalette();
                      }}
                      style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px", margin: 0 }}
                >
                    <div style={{ margin: 0 }}>한 줄 소개</div>
                    <div style={{ margin: 0 }}>
                        <input
                            defaultValue={myInfo.intro}
                            onChange={(e) => setMyInfo({ ...myInfo, intro: e.target.value })}
                            style={{ width: "100%", padding: "10px", margin:0 }}
                        />
                    </div>

                    <div style={{ margin: 0 }}>Nickname</div>
                    <div style={{ margin: 0 }}>
                        <input
                            defaultValue={myInfo.nickname}
                            onChange={(e) => setMyInfo({ ...myInfo, nickname: e.target.value })}
                            style={{ width: "100%", padding: "10px" }}
                        />
                    </div>

                    <div style={{ margin: 0 }}></div>
                    <div style={{ margin: 0 }}>
                        <button type="submit" style={{ width:"100%", padding: "10px" }}>한 줄 소개, 닉네임 save</button>
                    </div>
                </form>

                <br /><br />

                <form onSubmit={(e) => {
                        e.preventDefault();
                        changePassword();
                      }}
                      style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px" }}
                >
                    <div style={{ margin: 0 }}>비밀번호</div>
                    <div style={{ margin: 0 }}>
                        <span style={{fontSize:"18px"}}>기존 비밀번호:</span>
                        <input style={{ width:"100%", padding: "10px" }}
                               onChange={(e) => setPwd({ ...pwd, currentPassword: e.target.value })}/>

                        <br />
                        <div style={{padding:"4px", margin:0}} />

                        <span style={{ fontSize:"18px", }}>새 비밀번호:</span>
                            <input style={{ width:"100%", padding: "10px" }}
                                   onChange={(e) => setPwd({ ...pwd, newPassword: e.target.value })}/>
                    </div>

                    <div style={{ margin: 0 }}></div>
                    <div style={{ margin: 0 }}>
                        <button type="submit" style={{ width:"100%", padding: "10px" }}>pwd save</button>
                    </div>
                </form>

                <br /><br />

                <div></div><div></div>

                <div></div><div></div>


                <div></div><div></div><div></div><div></div><div></div><div></div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "20px", fontSize:"20px" }}>
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
                    <div></div>
                    <div>
                        <Palette paletteN={myInfo.paletteNumber} clickTF={true}/>
                    </div>
                </div>

                <br /><br /><br /><br />

                <div>
                    <button style={{ width:"100%", height:"40px" }}
                            onClick={() => withdrawMembership()}>
                        회원 탈퇴
                    </button>
                </div>


                <br /><br /><br /><br /><br />
            </div>
        </div>
    );
}