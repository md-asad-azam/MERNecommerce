import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { clearErrors, loadUser, updateProfile } from '../../actions/userAction'
import { UPDATE_PROFILE_RESET } from '../../constants/userConstants'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import FaceIcon from '@mui/icons-material/Face';
import "./UpdateProfile.css"
import MetaData from '../layout/MetaData'
import Loader from '../layout/loader/Loader'

const UpdateProfile = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const navigate = useNavigate()
    const { user, loading } = useSelector(state => state.user)
    const { error, isUpdated } = useSelector(state => state.profile)

    const [name, setName] = useState(user.name)
    const [email, setEmail] = useState(user.email)
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState(user.avatar.url)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success("Profile Updateed Successfully!!!")
            dispatch(loadUser())
            navigate("/account")
            dispatch({ type: UPDATE_PROFILE_RESET })
        }
    }, [dispatch, alert, navigate, error, isUpdated])

    const registerSubmit = (e) => {
        e.preventDefault()
        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("avatar", avatar)

        dispatch(updateProfile(myForm))
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
        }
    }

    return (
        <>
            {(loading || loading === undefined) ? <Loader /> :
                <>
                    <MetaData title={`Update - ${user.name}`} />
                    <div className="updateProfileContainer">
                        <div className="updateProfileBox">
                            <h3>Update Profile</h3>
                            <form className="updateProfileForm"
                                encType="multipart/form-data"
                                onSubmit={registerSubmit}
                            >
                                <div className="updateProfileName">
                                    <FaceIcon />
                                    <input
                                        className="updateProfileInputData"
                                        type="text"
                                        placeholder='Name here'
                                        required
                                        name="name"
                                        value={name}
                                        onChange={(e) => { setName(e.target.value) }}
                                    />
                                </div>
                                <div className="updateProfileEmail">
                                    <EmailOutlinedIcon />
                                    <input
                                        className="updateProfileInputData"
                                        type="email"
                                        placeholder='Email here'
                                        required
                                        name="email"
                                        value={email}
                                        onChange={(e) => { setEmail(e.target.value) }}
                                    />
                                </div>
                                <div id="updateProfileImage">
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
                                    value="updateProfile"
                                    className='updateProfileBtn'
                                    onClick={registerSubmit}
                                />
                            </form>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default UpdateProfile