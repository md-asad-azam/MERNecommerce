import { Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from "react-router-dom"
import { clearErrors, orderDetails } from '../../actions/orderAction'
import Loader from '../layout/loader/Loader'
import MetaData from '../layout/MetaData'
import "./OrderDetails.css"

const OrderDetails = () => {

    const { id } = useParams()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { order, error, loading } = useSelector(state => state.orderDetails)

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(orderDetails(id))

    }, [dispatch, id, alert, error])

    return (
        <>
            {(loading || loading === undefined) ? <Loader /> : <>
                <MetaData title="Order Details" />
                <div className="orderDetailsPage">
                    <div className="orderDetailsContainer">
                        <Typography component="h1">order #{order && order._id}</Typography>
                        <Typography>Shipping Info</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p>Name:</p>
                                <span>{order.user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{order.shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{`${order.shippingInfo.address}, ${order.shippingInfo.city}(${order.shippingInfo.pinCode}), ${order.shippingInfo.state}, ${order.shippingInfo.country}`}</span>
                            </div>
                        </div>
                        <Typography>Payment</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p className={order.paymentInfo.status === "succeeded" ?
                                    "greenColor" : "redColor"}
                                >
                                    {
                                        order.paymentInfo.status === "succeeded" ?
                                            "Paid" : "Not Paid"
                                    }
                                </p>
                            </div>
                            <div>
                                <p>Amount:</p>
                                <span>{order.totalPrice}</span>
                            </div>
                        </div>
                        <Typography>Order Status</Typography>
                        <div className="orderDetailsContainerBox">
                            <div>
                                <p
                                    className={
                                        order.orderStatus === "Delivered"
                                            ? "greenColor"
                                            : "redColor"
                                    }
                                >
                                    {order.orderStatus}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="orderDetailsCartItems">
                        <Typography>Order Items:</Typography>
                        <div className="orderDetailsCartItemsContainer">
                            {order.orderItems &&
                                order.orderItems.map((item) => (
                                    <Link to={`/product/${item.product}`}>
                                        <div key={item.product}>
                                            <img src={item.image.url} alt="Product" />
                                            <p>{item.name}</p>{" "}
                                            <span>
                                                {item.quantity} X ₹{item.price} ={" "}
                                                <b>₹{item.price * item.quantity}</b>
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                        </div>
                    </div>
                </div>
            </>}

        </>
    )
}

export default OrderDetails