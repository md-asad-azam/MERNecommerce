import React, { useEffect, useRef, useState } from 'react'
import "./LoginSignup.css"
import Loader from "../layout/loader/Loader"
import Metadata from "../layout/MetaData"
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { clearErrors, login, register } from "../../actions/userAction"
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import FaceIcon from '@mui/icons-material/Face';

const LoginSignup = () => {

    const navigate = useNavigate();
    const location = useLocation()
    const dispatch = useDispatch()
    const { error, loading, isAuthenticated } = useSelector(state => state.user)
    const alert = useAlert()

    const loginTab = useRef(null)
    const registerTab = useRef(null)
    const switcherTab = useRef(null)

    const [loginEmail, setLoginEmail] = useState("")
    const [loginPassword, setLoginPassword] = useState("")
    const [user, setUser] = useState({ name: "", email: "", password: "" })
    const [avatar, setAvatar] = useState("")
    const [avatarPreview, setAvatarPreview] = useState("/Profile.png")
    const { name, email, password } = user

    const redirect = location.search ? location.search.split('=')[1] : "account"

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isAuthenticated) {
            navigate(`/${redirect}`)    //if logged in then go to account #dont display login screen
        }
    }, [dispatch, alert, navigate, error, isAuthenticated, redirect])



    const loginSubmit = (e) => {
        e.preventDefault()

        dispatch(login(loginEmail, loginPassword))
        navigate("/")
    }

    const registerSubmit = (e) => {
        e.preventDefault()

        const myForm = new FormData()
        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("password", password)
        myForm.set("avatar", avatar)

        dispatch(register(myForm))
    }

    const registerDataChange = (e) => {
        if (e.target.name === "avatar") {
            const reader = new FileReader()
            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }
            reader.readAsDataURL(e.target.files[0])
        } else {
            setUser({ ...user, [e.target.name]: e.target.value })
        }
    }

    const switchTabs = (e, tab) => {
        if (tab === "login") {
            switcherTab.current.classList.add("shiftToNeutral")
            switcherTab.current.classList.remove("shiftToRight")

            registerTab.current.classList.remove("shiftToNaturalForm")
            loginTab.current.classList.remove("shiftToLeft")
        }
        if (tab === "register") {
            switcherTab.current.classList.add("shiftToRight")
            switcherTab.current.classList.remove("shiftToNeutral")

            registerTab.current.classList.add("shiftToNaturalForm")
            loginTab.current.classList.add("shiftToLeft")
        }
    }

    return (
        <>
            <Metadata title="Login / Register" />
            {loading ? <Loader /> :
                <div className="loginSignupContainer">
                    <div className="loginSignupBox">
                        <div>
                            <div className="loginSignupToggle">
                                <p onClick={(e) => switchTabs(e, "login")}>LOGIN</p>
                                <p onClick={(e) => switchTabs(e, "register")}>REGISTER</p>
                            </div>
                            <button ref={switcherTab}></button>
                        </div>

                        {/* Login Form */}
                        <form className="loginForm" ref={loginTab} onSubmit={loginSubmit}>
                            <div className="loginEmail">
                                <EmailOutlinedIcon />
                                <input
                                    type="email"
                                    placeholder='Email here'
                                    required
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>

                            <div className="loginPassword">
                                <KeyOutlinedIcon />
                                <input
                                    type="password"
                                    placeholder='Password here'
                                    required
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>

                            <Link to="/password/forgot">Forgot Password ?</Link>
                            <input type="submit" value="Login" className='loginBtn' />
                        </form>

                        {/* Register Form */}
                        <form className="signupForm" ref={registerTab}
                            encType="multipart/form-data"
                            onSubmit={registerSubmit}
                        >
                            <div className="signupName">
                                <FaceIcon />
                                <input
                                    className="signupInputData"
                                    type="text"
                                    placeholder='Name here'
                                    required
                                    name="name"
                                    value={name}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signupEmail">
                                <EmailOutlinedIcon />
                                <input
                                    className="signupInputData"
                                    type="email"
                                    placeholder='Email here'
                                    required
                                    name="email"
                                    value={email}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div className="signupPassword">
                                <KeyOutlinedIcon />
                                <input
                                    className="signupInputData"
                                    type="password"
                                    placeholder='Password here'
                                    required
                                    name="password"
                                    value={password}
                                    onChange={registerDataChange}
                                />
                            </div>
                            <div id="registerImage">
                                <img src={avatarPreview} alt="Avatar Preview" />
                                <input
                                    type="file"
                                    name="avatar"
                                    accept='image/*'
                                    onChange={registerDataChange}
                                />
                            </div>
                            <input
                                type="submit"
                                value="Register"
                                className='signupBtn'
                                onClick={registerSubmit}
                            />
                        </form>
                    </div>
                </div>
            }
        </>
    )
}

export default LoginSignup