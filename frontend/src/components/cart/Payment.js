import React, { useEffect, useRef } from 'react'
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EventIcon from '@mui/icons-material/Event';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import {
    CardNumberElement,
    CardExpiryElement,
    CardCvcElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js"
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from "react-redux"
import CheckoutSteps from './CheckoutSteps'
import MetaData from '../layout/MetaData'
import { Typography } from '@mui/material'
import { useNavigate } from "react-router-dom"
import axios from "axios"
import "./Payment.css"
import { clearErrors, createOrder } from '../../actions/orderAction';


const Payment = () => {

    const payBtn = useRef(null)
    const alert = useAlert()
    const stripe = useStripe()
    const elements = useElements()
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"))
    const { shippingInfo, cartItems } = useSelector(state => state.cart)
    const { user } = useSelector(state => state.user)
    const { error } = useSelector(state => state.newOrder)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
    }, [error, dispatch, alert])


    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    }
    const order = {
        shippingInfo,
        orderItems: cartItems,
        paymentInfo: {},
        itemsPrice: orderInfo.subtotal,
        taxPrice: orderInfo.tax,
        shippingPrice: orderInfo.shippingCharges,
        totalPrice: orderInfo.totalPrice
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        payBtn.current.disabled = true;

        try {

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const { data } = await axios.post("/api/v1/payment/process", paymentData, config)
            const client_secret = data.client_secret

            if (!stripe || !elements) return

            const result = await stripe.confirmCardPayment(client_secret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                        address: {
                            line1: shippingInfo.adress,
                            city: shippingInfo.city,
                            state: shippingInfo.state,
                            postal_code: shippingInfo.pinCode,
                            country: shippingInfo.country,

                        }
                    }
                }
            })
            if (result.error) {
                payBtn.current.disabled = false;
                alert.error(result.error.message)
            } else {
                if (result.paymentIntent.status === "succeeded") {

                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status
                    }
                    navigate("/success")
                    dispatch(createOrder(order))

                } else {
                    alert.error("There is some issue while processing the payment")
                }
            }

        } catch (error) {
            payBtn.current.disabled = false;
            console.log(error);
        }
    }

    return (
        <>
            <MetaData title="Payment" />
            <CheckoutSteps activeStep={2} />
            <div className="paymentContainer">
                <form className="paymentForm" onSubmit={(e) => submitHandler(e)}>
                    <Typography>Card Info</Typography>
                    <div>
                        <CreditCardIcon />
                        <CardNumberElement className='paymentInput' />
                    </div>
                    <div>
                        <EventIcon />
                        <CardExpiryElement className='paymentInput' />
                    </div>
                    <div>
                        <VpnKeyIcon />
                        <CardCvcElement className='paymentInput' />
                    </div>
                    <div>
                        <input type="submit"
                            value={`Pay - ₹${orderInfo && orderInfo.totalPrice}`}
                            ref={payBtn}
                            className="paymentFormBtn"
                            onClick={e => submitHandler(e)}
                        />
                    </div>
                </form>
            </div>

        </>
    )
}

export default Payment