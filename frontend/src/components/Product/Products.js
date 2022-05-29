import React, { useEffect, useState } from 'react'
import Loader from "../layout/loader/Loader"
import ProductCard from "../Home/ProductCard"
import Search from './Search'
import "./Products.css"
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { clearErrors, getProducts } from "../../actions/productAction"
import { useParams } from 'react-router-dom'
import { Pagination, Slider } from '@mui/material'
import { RiFilter3Line } from "react-icons/ri"
import { FiCrosshair } from "react-icons/fi"
import { GiCrossedBones } from "react-icons/gi"
import MetaData from '../layout/MetaData'


const categories = [
    "Laptop",
    "Footwear",
    "Shirts",
    "Jeans",
    "Camera",
    "Tops",
    "Ethnic",
    "PartyWear",
    "Smart Phones",
    "cam",
    "machine"
]

const Products = () => {
    const dispatch = useDispatch()
    const alert = useAlert()

    const {
        loading,
        products,
        error,
        resultPerPage,
        filteredProductsCount
    } = useSelector(state => state.products)
    let { keyword } = useParams()

    const [currentPage, setCurrentPage] = useState(1)
    const [showFilter, setShowFilter] = useState(false)
    const [price, setPrice] = useState([0, 25000])
    const [category, setCategory] = useState("")
    const [ratings, setRatings] = useState(0)
    const [filter, setFilter] = useState({ price, category, ratings })

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }
        dispatch(getProducts(keyword, currentPage, price, category, ratings))
    }, [dispatch, keyword, currentPage, filter, alert, error])


    return (
        <>
            {(loading || loading === undefined) ? (<Loader />) :
                (
                    <>
                        <MetaData title="Products" />
                        <Search />
                        <div className='productsComponent'>
                            <h2 className="productHeading">Products</h2>
                            <div className="products">
                                {(products.length === 0) ? (<h1>No item match this search!</h1>) :
                                    products.map((product, i) => (
                                        <ProductCard key={i} product={product} />
                                    ))}

                            </div>


                            <button
                                className='dropButton'
                                onClick={() => setShowFilter(!showFilter)}
                            ><RiFilter3Line /></button>

                            {showFilter &&
                                <div className="filterBox">
                                    <p>Price</p>
                                    <div className="priceBox">
                                        <Slider
                                            value={price}
                                            onChange={(e, v) => setPrice(v)}
                                            valueLabelDisplay="auto"
                                            aria-labelledby="range-slider"
                                            min={0}
                                            max={25000}
                                        />
                                    </div>
                                    <p>Categories</p>
                                    <ul className="catagoryBox">
                                        {categories.map((category, i) => (
                                            <li
                                                className='category-link'
                                                key={i}
                                                onClick={() => setCategory(category)}
                                            >{category}</li>
                                        ))}
                                    </ul>
                                    {category && <div className='selectedCategory'>
                                        <FiCrosshair color="rgb(0, 219, 0)" />
                                        <p>{category}</p>
                                        <GiCrossedBones
                                            style={{
                                                color: "red",
                                                cursor: "pointer",
                                                "margin-right": "1vmax",
                                                "padding-top": "2px"
                                            }}
                                            onClick={() => setCategory("")}

                                        />
                                    </div>}
                                    <p>Rating Above</p>
                                    <div className='ratingBox'>
                                        <Slider
                                            value={ratings}
                                            onChange={(e, v) => setRatings(v)}
                                            aria-labelledby="range-slider"
                                            valueLabelDisplay="auto"
                                            min={0}
                                            max={5}
                                        />
                                    </div>
                                    <div className="buttonBox">
                                        <button
                                            className="filterButton"
                                            onClick={() => {
                                                setFilter({ price, category, ratings })
                                                setShowFilter(!showFilter)
                                            }}
                                        >Apply Filter</button>
                                    </div>
                                </div>
                            }

                            {resultPerPage < filteredProductsCount && (
                                <div className="paginationBox">
                                    <Pagination
                                        count={Math.ceil(filteredProductsCount / resultPerPage)}
                                        page={currentPage}
                                        showFirstButton
                                        showLastButton
                                        onChange={(e, v) => setCurrentPage(v)}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                )
            }
        </>
    )
}

export default Products