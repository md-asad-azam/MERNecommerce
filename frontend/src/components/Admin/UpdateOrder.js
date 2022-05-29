import { Button, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearErrors, orderDetails, updateOrder } from '../../actions/orderAction'
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import Loader from '../layout/loader/Loader'
import MetaData from '../layout/MetaData'
import Sidebar from './Sidebar'
import { UPDATE_ORDER_RESET } from '../../constants/orderConstants'
import { useAlert } from 'react-alert'
import "./UpdateOrder.css"


const UpdateOrder = () => {

    const { id } = useParams()
    const alert = useAlert()
    const dispatch = useDispatch()
    const [status, setStatus] = useState("")
    const { order, error, loading } = useSelector(state => state.orderDetails)
    const { error: updateError, isUpdated } = useSelector(state => state.order)

    const processOrder = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("status", status)

        dispatch(updateOrder(id, myForm))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success("Order Updated successfully")
            dispatch({ type: UPDATE_ORDER_RESET })
        }

        dispatch(orderDetails(id))

    }, [dispatch, alert, error, id, updateError, isUpdated])


    return (
        <>
            {loading || loading === undefined ? <Loader /> : (
                <>
                    <MetaData title="Update Order" />
                    <div className="dashboard">
                        <Sidebar />
                        <div className="productListContainer">
                            <div className="confirmOrderPage">
                                <div>
                                    <div className="confirmShippingArea">
                                        <Typography>Shipping Info</Typography>
                                        <div className="orderDetailsContainerBox">
                                            <div>
                                                <p>Name:</p>
                                                {order.user && <span>{order.user.name}</span>}
                                            </div>
                                            <div>
                                                <p>Phone:</p>
                                                {order.shippingInfo && <span>{order.shippingInfo.phoneNo}</span>}
                                            </div>
                                            <div>
                                                <p>Address:</p>
                                                {order.shippingInfo && <span>{`${order.shippingInfo.address}, ${order.shippingInfo.city}(${order.shippingInfo.pinCode}), ${order.shippingInfo.state}, ${order.shippingInfo.country}`}</span>}
                                            </div>
                                        </div>

                                        <Typography>Payment</Typography>
                                        <div className="orderDetailsContainerBox">
                                            {order.paymentInfo && <div>
                                                <p className={order.paymentInfo.status === "succeeded" ?
                                                    "greenColor" : "redColor"}
                                                >
                                                    {
                                                        order.paymentInfo.status === "succeeded" ?
                                                            "Paid" : "Not Paid"
                                                    }
                                                </p>
                                            </div>}
                                            <div>
                                                <p>Amount:</p>
                                                <span>{order.totalPrice}</span>
                                            </div>
                                        </div>
                                        <Typography>Order Status</Typography>
                                        <div className="orderDetailsContainerBox">
                                            <div>
                                                {order.orderStatus && <p
                                                    className={
                                                        order.orderStatus === "Delivered"
                                                            ? "greenColor"
                                                            : "redColor"
                                                    }
                                                >
                                                    {order.orderStatus}
                                                </p>}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="confirmCartItems">
                                        <Typography>Your Cart Items:</Typography>
                                        <div className="confirmCartItemsContainer">
                                            {order.orderItems && order.orderItems.map((item, i) => (
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

                                <form
                                    encType='multipart/form-data'
                                    className="updateOrderForm"
                                    onSubmit={e => processOrder(e)}
                                >
                                    {order.orderStatus === "Delivered" ? (
                                        <>
                                            <h1>Order Delivered</h1>
                                            <p className='redColor'>Can't Update Delivered Orders</p>
                                        </>
                                    ) : (<>
                                        <h1>Process Order</h1>
                                        <div>
                                            <AccountTreeIcon />
                                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                                <option value="">Choose Category</option>
                                                {order.orderStatus === "Processing" && <option value="Shipped">Shipped</option>}
                                                {order.orderStatus === "Shipped" && <option value="Delivered">Delivered</option>}
                                            </select>
                                        </div>
                                        <Button
                                            id='updateProductBtn'
                                            type='submit'
                                            disabled={loading || status === ""}
                                            onClick={e => processOrder(e)}
                                        >Update</Button>
                                    </>)}

                                </form>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default UpdateOrder