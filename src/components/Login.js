import React, { useContext, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios';
import { UserContext } from "../App";

function Login() {
    const { state, dispatch } = useContext(UserContext); // to check if the user is logged in or not
    const { stateToken, dispatchToken } = useContext(UserContext); // to fetch the token generated from backend for unique identification of every user

    const navigation = useNavigate(); // to navigate to different routes, came in replacement of useHistory()
    const [username, setUsername] = useState(''); // to set the username of the user who's logging in
    const [password, setPassword] = useState(''); // to set the password of the user who's logging in

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://comfortable-newt-polo-shirt.cyclic.app/signin',
                { name: username, password }, // sends data to backend, accessed from req.body
                { withCredentials: true } // for cookies to pass to backend
            );

            dispatch({ type: 'USER', payload: true }) // no error from backend, set user_login context  

            let token = res.data.details; // token sent from backend
            dispatchToken({ type: 'CHANGE', payload: token }) // set user_token context

            navigation('/about'); // page should navigate to about page
        } catch (e) {
            window.alert('invalid credentials');
        }
    }

    return (
        <div>
            <div className="pleasant">
                <div className="wrapper login">
                    <div className="container">
                        <div className="col-left">
                            <div className="login-text">
                                <h2>Welcome!</h2>
                                <p>New here?</p> <NavLink to="/signup" className="btn">Sign Up</NavLink>
                            </div>
                        </div>
                        <div className="col-right">
                            <div className="login-form">
                                <h2>Login</h2>
                                <form method="POST">
                                    <p> <label>Username<span>*</span></label> <input value={username} onChange={((e) => setUsername(e.target.value))} name="username" id="username" type="text" placeholder="Username" required /> </p>
                                    <p> <label>Password<span>*</span></label> <input value={password} onChange={((e) => setPassword(e.target.value))} name="password" id="password" type="password" placeholder="Password" required /> </p>
                                    <p> <input type="submit" value="Log In" onClick={(loginUser)} /> </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
