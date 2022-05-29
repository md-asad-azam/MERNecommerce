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
import { clearErrors, deleteOrder, getAllOrders } from '../../actions/orderAction';
import { DELETE_ORDER_RESET } from '../../constants/orderConstants';
import "./OrderList.css"


const OrderList = () => {

    const dispatch = useDispatch()
    const alert = useAlert()
    const { orders, error } = useSelector(state => state.allOrders)
    const { error: deleteError, isDeleted } = useSelector(state => state.order)

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
            alert.success("Order deleted successfully!")
            dispatch({ type: DELETE_ORDER_RESET })
        }

        dispatch(getAllOrders())
    }, [dispatch, error, alert, deleteError, isDeleted])


    const columns = [
        {
            field: "id",
            headerName: "ID",
            flex: 1,
            renderCell: (params) => (
                <Link to={`/order/${params.getValue(params.id, "id")}`}>
                    {params.getValue(params.id, "id")}
                </Link>
            )
        },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ?
                    "greenColor" : "redColor"
            }
        },
        { field: "itemsQty", headerName: "Items Qty", type: "number", flex: 0.3, },
        { field: "amount", headerName: "Amount", type: "number", flex: 0.5, },
        {
            field: "action",
            headerName: "Action",
            headerClassName: "action",
            type: "number",
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (<>
                    <Link to={`/admin/order/${params.getValue(params.id, "id")}`}>
                        <EditIcon />
                    </Link>
                    <Button onClick={() => dispatch(deleteOrder(params.getValue(params.id, "id")))}>
                        <DeleteIcon />
                    </Button>
                </>)
            }
        },
    ]
    const rows = []
    orders && orders.forEach((item, i) => {
        rows.push({
            id: item._id,
            status: item.orderStatus,
            itemsQty: item.orderItems.length,
            amount: item.totalPrice
        })
    });

    return (
        <>
            <MetaData title="All Orders --Admin" />
            <div className="dashboard">
                <Sidebar />
                <div className="orderListContainer">
                    <h1 id="orderListHeading">All Orders</h1>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className='orderListTable'
                        autoHeight
                    />
                </div>
            </div>
        </>
    )
}

export default OrderList