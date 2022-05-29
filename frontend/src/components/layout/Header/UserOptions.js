import React, { useState } from 'react'
import "./UserOptions.css"
import { logout } from "../../../actions/userAction"
import { Backdrop, SpeedDial, SpeedDialAction } from "@mui/material"
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAlert } from 'react-alert';


const UserOptions = ({ user }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()
    const [open, setOpen] = useState(false)
    const { cartItems } = useSelector((state) => state.cart)

    const options = [
        { icon: <HomeIcon />, name: "Home", func: homePage },
        { icon: <ListAltIcon />, name: "Orders", func: orders },
        { icon: <PersonIcon />, name: "Profile", func: account },
        {
            icon: <ShoppingCartIcon
                style={{ color: cartItems.length > 0 ? "var(--orange)" : "unset" }} />,
            name: `Cart(${cartItems.length})`,
            func: cart
        },
        { icon: <ExitToAppIcon />, name: "Logout", func: logoutUser }
    ]

    if (user.role === "admin") {
        options.unshift({
            icon: <DashboardIcon />,
            name: "Dashboard",
            func: dashboard
        })
    }

    function homePage() {
        navigate("/")
    }
    function dashboard() {
        navigate("/admin/dashboard")
    }
    function orders() {
        navigate("/orders")
    }
    function account() {
        navigate("/account")
    }
    function cart() {
        navigate("/cart")
    }
    function logoutUser() {
        dispatch(logout())
        navigate("/")
        alert.success("Logged out Successfully!!!")
    }

    return (
        <>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                className='speedDial'
                ariaLabel='SpeedDial tooltip example'
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                direction="down"
                icon={<img
                    className='speedDialIcon'
                    src={user.avatar.url ? user.avatar.url : "/Profile.png"}
                    alt="Profile"
                />}
                style={{ zIndex: "11" }}
            >

                {options.map((item, i) => (
                    <SpeedDialAction
                        key={i}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : false}
                    />
                ))}

            </SpeedDial>
        </>
    )
}

export default UserOptions