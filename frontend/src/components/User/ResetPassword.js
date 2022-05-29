import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import "./ResetPassword.css"
import { resetPassword } from '../../actions/userAction';
import { clearErrors } from '../../actions/productAction';
import MetaData from '../layout/MetaData';

const ResetPassword = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const params = useParams()
    const { error, message } = useSelector(state => state.forgotPassword)

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (message) {
            alert.success("Password updated successfully!!!")
            navigate("/login")
        }

    }, [error, dispatch, alert, navigate, message])

    const resetPasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("password", password)
        myForm.set("confirmPassword", confirmPassword)

        dispatch(resetPassword(params.token, myForm))
    }


    return (
        <>
            <MetaData title={`Reset Password `} />
            <div className="resetPasswordContainer">
                <div className="resetPasswordBox">
                    <h3>Reset Password</h3>
                    <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
                        <div className="resetPasswordPassword">
                            <LockOpenIcon />
                            <input
                                className="resetPasswordInputData"
                                type="password"
                                placeholder='New Password'
                                required
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="resetPasswordConfirmPassword">
                            <LockIcon />
                            <input
                                className="resetPasswordInputData"
                                type="password"
                                placeholder='Confirm Password'
                                required
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <input
                            type="submit"
                            value="Reset Now"
                            className='resetPasswordBtn'
                            onClick={resetPasswordSubmit}
                        />
                    </form>
                </div>
            </div>
        </>
    )
}

export default ResetPassword