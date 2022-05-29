import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import "./OrderSuccess.css"

const OrderSuccess = () => {
    return (
        <>
            <div className="orderSuccess">
                <CheckCircleIcon />
                <Typography>Your Order has been placed successfully!</Typography>
                <Link to="/orders">View Orders</Link>
            </div>
        </>
    )
}

export default OrderSuccess