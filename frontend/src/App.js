import { useEffect, useState } from "react";
import hideLoader from "./utils/hideLoader";
import axios from "axios";

export default function App() {
    useEffect(hideLoader, []);
    const [loggedIn, setLoggedIn] = useState(false);

    const [newUser, setNewUser] = useState("");
    const [wrongUserName, setwrongUserName] = useState(true);

    const [usersList, setUsersList] = useState([]);

    const [adminUser, setadminUser] = useState("");
    const [adminPass, setadminPass] = useState("");

    const loginLogoutBtn = async () => {
        if (loggedIn) {
            setadminUser("");
            setadminPass("");
            setLoggedIn(false);
        }
        else {
            try {
                const { data: response } = await axios.get(window.APIROOT + 'login', {
                    params: {
                        "username": adminUser,
                        "password": adminPass,
                    }
                });
                if (response.success === true) {
                    setLoggedIn(true);
                    syncUserList();
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    const createUser = async () => {
        try {
            const { data: response } = await axios.get(window.APIROOT + 'create/' + newUser, {
                params: {
                    "username": adminUser,
                    "password": adminPass,
                }
            });
            if (response.success === true)
                syncUserList();
        } catch (error) {
            console.log(error);
        }
    }

    const removeUser = async (name) => {
        try {
            const { data: response } = await axios.get(window.APIROOT + 'remove/' + name, {
                params: {
                    "username": adminUser,
                    "password": adminPass,
                }
            });
            if (response.success === true)
                syncUserList();
        } catch (error) {
            console.log(error);
        }
    }

    const syncUserList = async () => {
        try {
            const { data: response } = await axios.get(window.APIROOT + 'list', {
                params: {
                    "username": adminUser,
                    "password": adminPass,
                }
            });
            setUsersList(response);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <div className="grid place-items-center px-4">
                <div className="mt-4 card w-full bg-base-100 border shadow-lg max-w-sm">
                    <div className="card-body">
                        <h1 className="card-title text-2xl mb-3">{loggedIn ? "OpenVPN Admin" : "Login to OpenVPN"}</h1>
                        {loggedIn ? null : <>
                            <div className="form-control w-full max-w-xs">
                                <label className="label"><span className="label-text">Enter your admin username</span></label>
                                <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" onChange={(e) => setadminUser(e.target.value)} />
                            </div>
                            <div className="form-control w-full max-w-xs mb-5">
                                <label className="label"><span className="label-text">Enter your admin password</span></label>
                                <input type="password" placeholder="Password" className="input input-bordered w-full max-w-xs" onChange={(e) => setadminPass(e.target.value)} />
                            </div>
                        </>}
                        <div className="card-actions justify-start">
                            <button className="btn btn-primary" onClick={loginLogoutBtn}>{loggedIn ? "Logout" : "Login as admin"}</button>
                        </div>
                    </div>
                </div>
            </div>

            {loggedIn ?
                <>
                    <div className="grid place-items-center px-4">
                        <div className="mt-4 card w-full bg-base-100 border shadow-lg max-w-sm">
                            <div className="card-body">
                                <h1 className="card-title text-2xl mb-3">Create new user</h1>
                                <div className="form-control w-full max-w-xs mb-5">
                                    <label className="label"><span className="label-text">Only a-z and A-Z alphabets allowed</span></label>
                                    <input type="text" placeholder="Username" className="input input-bordered w-full max-w-xs" onChange={(e) => {
                                        const text = e.target.value;
                                        if (/^[a-zA-Z]+$/.test(text)) {
                                            setNewUser(text);
                                            if (wrongUserName === true) setwrongUserName(false);
                                        }
                                        else setwrongUserName(true);
                                    }} />
                                </div>
                                <div className="card-actions justify-start">
                                    <button disabled={wrongUserName} className="btn btn-primary" onClick={createUser}>Create user</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid place-items-center px-4">
                        <div className="mt-4 card bg-base-100 border shadow-lg max-w-2xl w-[92vw]">
                            <div className="card-body">
                                <div className="overflow-x-auto">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Actions</th>
                                                <th>User</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersList.map(e =>
                                                <tr>
                                                    <td className="whitespace-nowrap w-20">
                                                        <a href={window.APIROOT + "getConfig/" + e + "?username=" + adminUser + "&password=" + adminPass} className="btn btn-square">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 512 512"><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z" /></svg>
                                                        </a>
                                                        <button className="btn btn-square ml-2" onClick={() => removeUser(e)}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 448 512"><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" /></svg>
                                                        </button>
                                                    </td>
                                                    <td>{e}</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </> : null}
        </>
    )
}