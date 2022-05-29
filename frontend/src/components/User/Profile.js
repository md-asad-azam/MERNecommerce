import React, { useEffect } from 'react'
import "./Profile.css"
import MetaData from '../layout/MetaData'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Loader from '../layout/loader/Loader'


const Profile = () => {

    const navigate = useNavigate()
    const { user, loading, isAuthenticated } = useSelector(state => state.user)
    const date = new Date(user.createdAt)

    useEffect(() => {
        if (isAuthenticated === false) {
            navigate("/login")
        }
    }, [isAuthenticated, navigate])

    return (
        <>
            {(loading || loading === undefined) ? <Loader /> : <>
                <MetaData title={`${user.name}'s Profile`} />
                <div className="profileContainer">
                    <div className='profileInfo'>
                        <h1>My Profile</h1>
                        <img src={user.avatar.url} alt={user.name} />
                        <Link to="/me/update" className='editProfileButton'>Edit Profile</Link>
                    </div>
                    <div className='profileInfo2'>
                        <div>
                            <h4>Full Name</h4>
                            <p>{user.name}</p>
                        </div>
                        <div>
                            <h4>Email</h4>
                            <p>{user.email}</p>
                        </div>
                        <div>
                            <h4>Joined on</h4>
                            <p>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
                        </div>

                        <div className='linksContainer'>
                            <Link to="/orders">My Orders</Link>
                            <Link to="/password/update">Change Password</Link>
                        </div>
                    </div>
                </div>
            </>}
        </>
    )
}

export default Profile