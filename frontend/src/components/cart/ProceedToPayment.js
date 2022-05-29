import React from 'react'
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import Payment from './Payment'


const ProceedToPayment = ({ stripeApiKey }) => {
    return (
        <>
            <Elements stripe={loadStripe(stripeApiKey)}>
                <Payment />
            </Elements>
        </>
    )
}

export default ProceedToPayment