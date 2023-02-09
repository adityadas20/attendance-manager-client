import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from "../App";

function Logout() {
    const { state, dispatch } = useContext(UserContext);
    const { stateToken, dispatchToken } = useContext(UserContext);

    const navigate = useNavigate();

    let logoutUser = async () => {
        try {
            dispatchToken({ type: 'CHANGE', payload: '' }) // set token from context to empty string
            // await axios.get('http://localhost:3000/logout',
            //     {
            //         headers: {
            //             Accept: "application/json",
            //             "Content-Type": "application/json"
            //         },
            //         withCredentials: true
            //     });
            dispatch({ type: 'USER', payload: false }) // denotes user has logged out
            navigate('/login');
        } catch (err) {
            console.log(err);
        }
    }
    useEffect(() => {
        logoutUser(); // called when component mounts
    });
    return (
        <div>
            logout called
        </div>
    )
}

export default Logout
