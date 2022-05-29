import "./ReviewCard.css"
import React from 'react'
import { Rating } from "@mui/material"

const ReviewCard = ({ review }) => {

    const date = new Date(review.createdAt)

    return (
        <div className="reviewCard">
            <div className="top">
                <img src={review.userProfileImg ?
                    review.userProfileImg : "/Profile.png"
                } alt="User" />
                <div>
                    <p>{review.name}</p>
                    <div className="stars">
                        <Rating
                            value={review.rating}
                            readOnly
                            precision={0.5}
                            size="small"
                        />
                    </div>
                    <span>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</span>
                </div>
            </div>
            <span>{review.comment}</span>
        </div>
    )
}

export default ReviewCard