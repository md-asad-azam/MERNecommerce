import { Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import MetaData from '../layout/MetaData'
import CheckoutSteps from './CheckoutSteps'
import "./ConfirmOrder.css"

const ConfirmOrder = () => {

    const navigate = useNavigate()
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)

    const subtotal = cartItems.reduce((acc, item) => acc + item.quantity * item.price, 0)
    const shippingCharges = subtotal > 1000 ? 0 : 50;
    const tax = subtotal * 0.18;
    const totalPrice = subtotal + shippingCharges + tax
    const address = `${shippingInfo.address}, ${shippingInfo.city}(${shippingInfo.pinCode}), ${shippingInfo.state}, ${shippingInfo.country}`

    const proceedToPayment = () => {
        const data = {
            subtotal,
            shippingCharges,
            tax,
            totalPrice
        }

        sessionStorage.setItem("orderInfo", JSON.stringify(data))
        navigate("/process/payment")
    }

    return (
        <>
            <MetaData title="Confirm Order" />
            <CheckoutSteps activeStep={1} />
            <div className="confirmOrderPage">
                <div>
                    <div className="confirmShippingArea">
                        <Typography>Shipping Info</Typography>
                        <div className="confirmShippingAreaBox">
                            <div>
                                <p>Name:</p>
                                <span>{user.name}</span>
                            </div>
                            <div>
                                <p>Phone:</p>
                                <span>{shippingInfo.phoneNo}</span>
                            </div>
                            <div>
                                <p>Address:</p>
                                <span>{address}</span>
                            </div>
                        </div>
                    </div>
                    <div className="confirmCartItems">
                        <Typography>Your Cart Items:</Typography>
                        <div className="confirmCartItemsContainer">
                            {cartItems && cartItems.map((item, i) => (
                                <div key={i}>
                                    <img src={item.image.url} alt="img" />
                                    <Link to={`/product/${item.product}`}>{item.name}</Link>{" "}
                                    <span>{item.quantity} x {item.price} ={" "}</span>
                                    <b>₹{item.quantity * item.price}</b>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="orderSummary">
                    <Typography>Order Summary:</Typography>
                    <div>
                        <div>
                            <p>Subtotal:</p>
                            <span>₹{subtotal}</span>
                        </div>
                        <div>
                            <p>Shiping Charges:</p>
                            <span>₹{shippingCharges}</span>
                        </div>
                        <div>
                            <p>GST:</p>
                            <span>₹{tax}</span>
                        </div>
                    </div>
                    <div className="orderSummaryTotal">
                        <p><b>Total:</b></p>
                        <span>₹{totalPrice}</span>
                    </div>
                    <button onClick={proceedToPayment}>Proceed To Payment</button>
                </div>
            </div>
        </>
    )
}

export default ConfirmOrder