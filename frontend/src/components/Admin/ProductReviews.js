import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import { clearErrors, deleteReview, getAllReview } from '../../actions/productAction';
import { DELETE_REVIEW_RESET } from '../../constants/productConstants';
import "./ProductReview.css"


const ProductReviews = () => {

  const dispatch = useDispatch()
  const alert = useAlert()
  const [productId, setProductId] = useState("")
  const { error, reviews, loading } = useSelector(state => state.productReviews)
  const { error: deleteError, isDeleted } = useSelector(state => state.review)

  useEffect(() => {

    if (productId.length === 24) {
      dispatch(getAllReview(productId));
    }

    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }

    if (deleteError) {
      alert.error(deleteError)
      dispatch(clearErrors())
    }
    if (isDeleted) {
      alert.success("Review deleted successfully!")
      dispatch({ type: DELETE_REVIEW_RESET })
    }

  }, [dispatch, error, alert, deleteError, isDeleted, productId])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(getAllReview(productId))
  }

  const columns = [
    {
      field: "id",
      headerName: "Review ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    { field: "comment", headerName: "Comment", flex: 1 },
    {
      field: "rating",
      headerName: "Rating",
      flex: 0.2,
      cellClassName: (params) => {
        return params.getValue(params.id, "rating") >= 3 ?
          "greenColor" : "redColor"
      }
    },
    {
      field: "action",
      headerName: "Action",
      headerClassName: "action",
      type: "number",
      flex: 0.3,
      sortable: false,
      renderCell: (params) => {
        return (<>
          <Button onClick={() => dispatch(deleteReview(params.getValue(params.id, "id"), productId))}>
            <DeleteIcon />
          </Button>
        </>)
      }
    },
  ]
  const rows = []
  reviews && reviews.forEach((item, i) => {
    rows.push({
      id: item._id,
      name: item.name,
      comment: item.comment,
      rating: item.rating
    })
  });

  return (
    <>
      <MetaData title="All Reviews --Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productReviewsContainer">
          <form
            encType='multipart/form-data'
            className="productReviewsForm"
            onSubmit={e => submitHandler(e)}
          >
            <h1>All Reviews</h1>
            <div>
              <SearchIcon />
              <input
                type="text"
                placeholder='Product Id'
                value={productId}
                onChange={e => setProductId(e.target.value)}
              />
            </div>
            <Button
              id='createProductBtn'
              type='submit'
              disabled={loading || productId === ""}
              onClick={e => submitHandler(e)}
            >Search</Button>
          </form>

          {reviews && reviews.length > 0 ?
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={10}
              disableSelectionOnClick
              className='productListTable'
              autoHeight
            /> : <>
              <h1 style={{ textAlign: "center" }} className='productReviewFormHeading'>No Reviews yet</h1>
            </>
          }

        </div>
      </div>
    </>
  )
}

export default ProductReviews