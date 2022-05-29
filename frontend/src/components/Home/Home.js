import React, { useEffect } from 'react'
import ProductCard from "./ProductCard.js"
import "./Home.css"
import MetaData from '../layout/MetaData.js'
import { clearErrors, getProducts } from "../../actions/productAction"
import { useSelector, useDispatch } from "react-redux"
import Loader from '../layout/loader/Loader.js'
import { useAlert } from "react-alert"
import { Link } from 'react-router-dom'
import SearchIcon from '@mui/icons-material/Search';


const Home = (props) => {
    const alert = useAlert()
    const dispatch = useDispatch()
    const {
        loading,
        error,
        products,
    } = useSelector(state => state.products)

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProducts())

    }, [dispatch, error, alert])

    return (
        <>
            {loading ? (<Loader />) : (
                <>
                    <MetaData title="FforFashion" />
                    <div className="banner">
                        <p>Welcome to {props.name}</p>
                        <h1>Find amazing products below</h1>
                        <Link to="/products">
                            <button>
                                Shop Now<SearchIcon />
                            </button>
                        </Link>
                    </div>
                    <h2 className='homeHeading'>Featured Products</h2>
                    <div className="productsContainer" id='container'>
                        {products && products.map(product => (
                            <ProductCard product={product} key={product._id} />
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Home