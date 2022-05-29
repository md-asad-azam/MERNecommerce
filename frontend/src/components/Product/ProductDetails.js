import React, { useEffect, useState } from 'react'
import Carousel from "react-material-ui-carousel"
import { useSelector, useDispatch } from "react-redux"
import { clearErrors, getProductDetails, newReview } from '../../actions/productAction'
import { useParams } from 'react-router-dom'
import ReviewCard from "./ReviewCard.js"
import Loader from '../layout/loader/Loader'
import { useAlert } from "react-alert"
import "./ProductDetails.css"
import MetaData from '../layout/MetaData'
import { addItemToCart } from '../../actions/cartAction'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Rating } from '@mui/material'
import { NEW_REVIEW_RESET } from '../../constants/productConstants'


const ProductDetails = () => {
    const alert = useAlert()
    let { id } = useParams()
    const dispatch = useDispatch()
    const { product, loading, error } = useSelector(state => state.productDetails)
    const [quantity, setQuantity] = useState(1)

    const [rating, setRating] = useState(0)
    const [open, setOpen] = useState(false)
    const [comment, setComment] = useState("")
    const { success, error: reviewErr } = useSelector(state => state.newReview)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (reviewErr) {
            alert.error(reviewErr)
            dispatch(clearErrors())
        }
        if (success) {
            alert.success("Review submitted successfully!")
            dispatch({ type: NEW_REVIEW_RESET })
        }

        dispatch(getProductDetails(id))
    }, [dispatch, id, alert, error, reviewErr, success])


    const reviewSubmitHandler = () => {
        const myForm = new FormData()

        myForm.set("rating", rating)
        myForm.set("comment", comment)
        myForm.set("productId", id)

        dispatch(newReview(myForm))
        setOpen(false)
    }

    const addToCartHandler = () => {
        if (product.Stock < 1) {
            alert.error("Poduct Out of stock!")
            return
        }
        dispatch(addItemToCart(id, quantity))
        alert.success("Item added to cart.")
    }

    return (
        <>
            {loading || loading === undefined ? (<Loader />) :
                (<>
                    <MetaData title={`${product.name} Details`} />
                    <div className="productDetails" id="productDetails">
                        <div className='carousel'>
                            <Carousel>
                                {product.images && product.images.map((item, index) => (
                                    <img
                                        className="carouselImage"
                                        key={index}
                                        src={item.url}
                                        alt={`${index}Slide`} />
                                ))}
                            </Carousel>
                        </div>

                        <div className='second'>
                            <div className="detailsBlock-1">
                                <h2>{product.name}</h2>
                                <p>product #{product._id}</p>
                            </div>
                            <div className="detailsBlock-2">
                                <div className="stars">
                                    <Rating
                                        value={product.ratings}
                                        readOnly
                                        precision={0.5}
                                    />
                                </div>
                                <span>({product.numOfReviews} reviews)</span>
                            </div>
                            <div className="detailsBlock-3">
                                <h1>₹{product.price}</h1>
                                <div className="detailsBlock-3-1">
                                    <div className="detailsBlock-3-1-1">
                                        <button onClick={e => {
                                            if (quantity > 1)
                                                setQuantity(quantity - 1)
                                        }}>-</button>

                                        <input type="number" readOnly value={quantity} />

                                        <button onClick={e => {
                                            if (quantity < product.Stock)
                                                setQuantity(quantity + 1)
                                        }}>+</button>
                                    </div>
                                    <div className="addToCart">
                                        <button onClick={addToCartHandler}>Add To Cart</button>
                                    </div>
                                </div>
                                <p>
                                    Status: {" "}
                                    <b className={product.Stock < 1 ? "redColor" : "greenColor"}>
                                        {product.Stock < 1 ? "OutOfStock" : "InStock"}
                                    </b>
                                </p>
                            </div>
                            <div className="detailsBlock-4">
                                Description: <p>{product.description}</p>
                            </div>
                            <button onClick={() => setOpen(!open)} className='submitReview'>Give Review</button>
                        </div>
                    </div>
                    <h3 className="reviewHeading">Reviews</h3>

                    <Dialog
                        aria-labelledby="simple-dialog-title"
                        open={open}
                        onClose={() => setOpen(!open)}
                    >
                        <DialogTitle sx={{ textDecoration: "underline" }}>Give Review</DialogTitle>
                        <DialogContent className='submitDialog'>
                            <Rating
                                onChange={e => setRating(Number(e.target.value))}
                                value={rating}
                                size="large"
                                precision={0.5}
                                sx={{ color: "black" }}
                            />
                            <textarea
                                className='submitDialogTextArea'
                                cols={30}
                                rows={5}
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            ></textarea>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={() => setOpen(false)}
                                color='error'
                            >Cancel</Button>
                            <Button
                                onClick={reviewSubmitHandler}
                                color='success'
                            >Submit</Button>
                        </DialogActions>
                    </Dialog>

                    {product.reviews && product.reviews[0] ? (
                        <div className="reviews">
                            {product.reviews.map((review, i) =>
                                <ReviewCard key={i} review={review} />
                            )}
                        </div>
                    ) : (
                        <p className='noReviews'>No Reviews Yet</p>
                    )}
                </>)}
        </>
    )
}

export default ProductDetails