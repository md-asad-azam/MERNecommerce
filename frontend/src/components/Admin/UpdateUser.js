import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PersonIcon from "@mui/icons-material/Person";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import Sidebar from './Sidebar'
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import "./NewProduct.css"
import { getUserDetails, updateUser, clearErrors } from '../../actions/userAction';
import { UPDATE_USER_RESET } from '../../constants/userConstants';
import Loader from '../layout/loader/Loader';
import "./UpdateUser.css"

const UpdateUser = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");

    const { loading, error, user } = useSelector(state => state.userDetails)
    const { error: updateError, isUpdated } = useSelector(state => state.profile)

    const updateUserSubmitHandler = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("email", email)
        myForm.set("role", role)

        dispatch(updateUser(id, myForm))
    }

    useEffect(() => {

        if (user && user._id !== id || isUpdated) {
            dispatch(getUserDetails(id))
        } else {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
            navigate("/admin/users")
        }
        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
            navigate("/admin/users")
        }
        if (isUpdated) {
            alert.success("User updated successfully")
            navigate("/admin/users")
            dispatch({ type: UPDATE_USER_RESET })
        }

    }, [dispatch, error, user, isUpdated, alert, navigate, updateError])


    return (
        <>
            <MetaData title="Update User" />
            {loading || loading === undefined ? <Loader /> : <>
                <div className="dashboard">
                    <Sidebar />
                    <div className="updateUserContainer">
                        <form
                            encType='multipart/form-data'
                            className="updateUserForm"
                            onSubmit={e => updateUserSubmitHandler(e)}
                        >
                            <h1>Update User</h1>
                            <div>
                                <PersonIcon />
                                <input
                                    type="text"
                                    placeholder='Name'
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <MailOutlineIcon />
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>


                            <div>
                                <VerifiedUserIcon />
                                <select value={role} onChange={(e) => setRole(e.target.value)}>
                                    <option value="">Choose Role</option>
                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </div>

                            <Button
                                id='updateUserBtn'
                                type='submit'
                                disabled={loading}
                                onClick={e => updateUserSubmitHandler(e)}
                            >Update</Button>
                        </form>
                    </div>
                </div>
            </>}
        </>
    )
}

export default UpdateUser