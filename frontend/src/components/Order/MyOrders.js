import React, { useEffect } from 'react'
import MetaData from "../layout/MetaData"
import Loader from "../layout/loader/Loader"
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from "react-redux"
import { useAlert } from "react-alert"
import { Link } from "react-router-dom"
import LaunchIcon from '@mui/icons-material/Launch';
import { clearErrors, myOrders } from "../../actions/orderAction"
import "./MyOrders.css"

const MyOrders = () => {

    const alert = useAlert()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const { error, loading, orders } = useSelector(state => state.myOrders)

    const columns = [
        { field: "id", headerName: "ID", flex: 1, },
        {
            field: "status",
            headerName: "Status",
            flex: 0.5,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Delivered" ?
                    "greenColor" : "redColor"
            }
        },
        { field: "items", headerName: "Items", type: "number", flex: 0.3, },
        { field: "amount", headerName: "Amount", type: "number", flex: 0.5, },
        {
            field: "action",
            headerName: "Action",
            type: "number",
            flex: 0.3,
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/order/${params.getValue(params.id, "id")}`}>
                        <LaunchIcon />
                    </Link>
                )
            }
        },
    ]
    const rows = []
    orders && orders.forEach((item, i) => {
        rows.push({
            items: item.orderItems.length,
            id: item._id,
            status: item.orderStatus,
            amount: item.totalPrice
        })
    });

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        dispatch(myOrders())
    }, [dispatch, error, alert])


    return (
        <>
            <MetaData title={`${user.name}'s Orders`} />
            {(loading || loading === undefined) ? <Loader /> : (
                <div className="myOrdersPage">
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={10}
                        disableSelectionOnClick
                        className="myOrdersTable"
                        autoHeigth
                    />
                </div>
            )}
        </>
    )
}

export default MyOrders