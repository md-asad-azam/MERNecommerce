import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert';
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import Loader from '../layout/loader/Loader';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { clearErrors, updatePassword } from '../../actions/userAction';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
import MetaData from '../layout/MetaData';
import "./UpdatePassword.css"

const UpdatePassword = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const { loading } = useSelector(state => state.user)
    const { isUpdated, error } = useSelector(state => state.profile)

    const [oldPassword, setOldPassword] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success("Password updated successfully!!!")
            navigate("/account")
            dispatch({ type: UPDATE_PASSWORD_RESET })
        }

    }, [error, dispatch, alert, navigate, isUpdated])

    const updatePasswordSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("oldPassword", oldPassword)
        myForm.set("newPassword", password)
        myForm.set("confirmPassword", confirmPassword)

        dispatch(updatePassword(myForm))
    }

    return (
        <>
            {(loading || loading === undefined) ? <Loader /> :
                <>
                    <MetaData title={`Update Password `} />
                    <div className="updatePasswordContainer">
                        <div className="updatePasswordBox">
                            <h3>Update Password</h3>
                            <form className="updatePasswordForm" onSubmit={updatePasswordSubmit}>
                                <div className="updatePasswordOldPassword">
                                    <KeyOutlinedIcon />
                                    <input
                                        className="updatePasswordInputData"
                                        type="password"
                                        placeholder='Password here'
                                        required
                                        name="oldPassword"
                                        value={oldPassword}
                                        onChange={(e) => setOldPassword(e.target.value)}
                                    />
                                </div>
                                <div className="updatePasswordPassword">
                                    <LockOpenIcon />
                                    <input
                                        className="updatePasswordInputData"
                                        type="password"
                                        placeholder='New Password'
                                        required
                                        name="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                                <div className="updatePasswordConfirmPassword">
                                    <LockIcon />
                                    <input
                                        className="updatePasswordInputData"
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
                                    value="Update Now"
                                    className='updatePasswordBtn'
                                    onClick={updatePasswordSubmit}
                                />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default UpdatePassword