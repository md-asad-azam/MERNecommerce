import React from 'react'
import "./Cart.css"
import CartItemCard from './CartItemCard'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from "react-redux"
import { addItemToCart, removeItemFromCart } from '../../actions/cartAction'
import RemoveShoppingCartIcon from '@mui/icons-material/RemoveShoppingCart';
import MetaData from '../layout/MetaData'
import { Link } from 'react-router-dom'

const Cart = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems } = useSelector(state => state.cart)

    const increaseQuantity = (id, quantity, stock) => {
        const newQty = quantity + 1
        if (stock <= quantity) return

        dispatch(addItemToCart(id, newQty))
    }
    const decreaseQuantity = (id, quantity) => {
        const newQty = quantity - 1
        if (1 >= quantity) return

        dispatch(addItemToCart(id, newQty))
    }
    const deleteCartItem = (id) => {
        dispatch(removeItemFromCart(id))
    }
    const checkOutHandler = () => {
        navigate("/login?redirect=shipping")
    }

    return (
        <>
            <MetaData title={`My Cart(${cartItems.length})`} />
            {cartItems.length === 0 ? (
                <div className="emptyCart">
                    <RemoveShoppingCartIcon />
                    <p>No Product In Your Cart</p>
                    <Link to="/products">View Products</Link>
                </div>
            ) :
                <>
                    <div className="cartPage">
                        <div className="cartHeader">
                            <p>Product</p>
                            <p>Quantity</p>
                            <p>Subtotal</p>
                        </div>

                        {cartItems && cartItems.map((item, i) => (
                            <div className="cartContainer" key={i}>
                                <CartItemCard item={item} deleteCartItem={deleteCartItem} />
                                <div className="cartInput">
                                    <div className="container">
                                        <button onClick={
                                            () => decreaseQuantity(item.product, item.quantity)
                                        }>-</button>
                                        <input type="number" readOnly value={item.quantity} />
                                        <button onClick={
                                            () => increaseQuantity(item.product, item.quantity, item.stock)
                                        }>+</button>
                                    </div>
                                </div>
                                <p className="cartSubtotal">{`₹${item.price * item.quantity}`}</p>
                            </div>
                        ))}

                        <div className="cartGrossTotal">
                            <div></div>
                            <div className="cartGrossTotalBox">
                                <p>Gross Total</p>
                                <p>{`₹${cartItems.reduce(
                                    (acc, item) => acc + item.quantity * item.price, 0
                                )}`}</p>
                            </div>
                            <div></div>
                            <div className="checkoutBtn">
                                <button onClick={checkOutHandler}>Check Out</button>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default Cart