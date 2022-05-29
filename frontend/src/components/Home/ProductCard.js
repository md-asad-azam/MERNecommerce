import React from 'react'
import { Link } from "react-router-dom"
import { Rating } from "@mui/material"
import "./ProductCard.css"


const ProductCard = ({ product }) => {

  return (
    <Link className='productCardContainer' to={`/product/${product._id}`}>
      <div className="productCard">
        <div className="imgContainer">
          <img src={product.images[0].url} alt={product.name} />
        </div>
        <p>{product.name}</p>
        <div className='stars'>
          <div className="rating">
            <Rating
              value={product.ratings}
              readOnly
              precision={0.5}
              size="large"
            />
          </div>
          <p>({product.numOfReviews})</p>
        </div>
        <span>{`₹${product.price}`}</span>
      </div>
    </Link>
  )
}

export default ProductCard