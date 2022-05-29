import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { clearErrors } from '../../actions/productAction'
import { forgotPassword } from '../../actions/userAction'
import MetaData from '../layout/MetaData'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import "./ForgotPassword.css"
import Loader from '../layout/loader/Loader'

const ForgotPassword = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const { error, message, loading } = useSelector(state => state.forgotPassword)

    const [email, setEmail] = useState("")

    const forgotPasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("email", email)

        dispatch(forgotPassword(myForm))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (message) {
            alert.success(message)
        }

    }, [error, dispatch, alert, message])

    return (
        <>
            {loading ? <Loader /> :
                <>
                    <MetaData title={`Forgot Password`} />
                    <div className="forgotPasswordContainer">
                        <div className="forgotPasswordBox">
                            <h3>Forgot Password</h3>
                            <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>

                                <div className="forgotPasswordEmail">
                                    <EmailOutlinedIcon />
                                    <input
                                        className="forgotPasswordInputData"
                                        type="email"
                                        placeholder='Email here'
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>

                                <input
                                    type="submit"
                                    value="Send"
                                    className='forgotPasswordBtn'
                                    onClick={forgotPasswordSubmit}
                                />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ForgotPassword