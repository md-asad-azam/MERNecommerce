import React, { useEffect } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import { Button } from '@mui/material';
import MetaData from '../layout/MetaData';
import Sidebar from './Sidebar';
import { DataGrid } from '@mui/x-data-grid';
import "./ProductList.css"
import { clearErrors, deleteProduct, getAdminProducts } from '../../actions/productAction';
import { DELETE_PRODUCT_RESET } from '../../constants/productConstants';


const ProductList = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const { products, error, loading } = useSelector(state => state.products)
    const { error: deleteError, isDeleted } = useSelector(state => state.product)

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }
        if (isDeleted) {
            alert.success("Product deleted successfully!")
            dispatch({ type: DELETE_PRODUCT_RESET })
        }

        dispatch(getAdminProducts())
    }, [dispatch, error, alert, deleteError, isDeleted])


    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 0.5,
            renderCell: (params) => (
                <Link to={`/product/${params.getValue(params.id, "id")}`}>
                    {params.getValue(params.id, "id")}
                </Link>)
        },
        {
            field: "name",
            headerName: "Name",
            flex: 0.7,
        },
        { field: "stock", headerName: "Stock", type: "number", flex: 0.3, },
        { field: "price", headerName: "Price", type: "number", flex: 0.5, },
        {
            field: "action",
            headerName: "Action",
            headerClassName: "action",
            type: "number",
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (<>
                    <Link to={`/admin/product/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button onClick={() => dispatch(deleteProduct(params.getValue(params.id, "id")))}>
                        <DeleteIcon />
                    </Button>
                </>)
            }
        },
    ]
    const rows = []
    products && products.forEach((item, i) => {
        rows.push({
            id: item._id,
            name: item.name,
            stock: item.Stock,
            price: item.price
        })
    });

    return (
        <>
            <MetaData title="All Products --Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="productListContainer">
                    <h1 id="productListHeading">All Products</h1>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='productListTable'
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default ProductList