import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import "./Dashboard.css"
import { Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import { Doughnut, Line } from "react-chartjs-2"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from "chart.js";
import { useDispatch, useSelector } from 'react-redux'
import { getAdminProducts } from '../../actions/productAction'
import MetaData from '../layout/MetaData'
import { getAllOrders } from '../../actions/orderAction'
import { getAllUsers } from '../../actions/userAction'

const Dashboard = () => {

    ChartJS.register(
        CategoryScale,
        LinearScale,
        PointElement,
        LineElement,
        ArcElement,
        Title,
        Tooltip,
        Legend,
    );

    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.products);
    const { orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.allUsers);

    let outOfStock = 0;
    products && products.forEach((item) => {
        if (item.Stock === 0) {
            outOfStock += 1;
        }
    });

    let totalAmount=0
    orders && orders.forEach(item => {
        totalAmount += item.totalPrice
    })

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(getAllOrders());
        dispatch(getAllUsers());
    }, [dispatch]);

    const lineState = {
        labels: ["Initial Amount", "Amount Earned"],
        datasets: [
            {
                label: "TOTAL AMOUNT",
                backgroundColor: "rgba(255, 196, 0, 0.5)",
                hoverBackgroundColor: "rgba(255, 196, 0, 1)",
                data: [0, totalAmount]
            },
        ]
    }

    const doughnutState = {
        labels: ["Out of Stock", "In Stock"],
        datasets: [
            {
                backgroundColor: ["rgba(255, 196, 0, 0.5)", "rgba(0,199,183, 0.5)"],
                hoverBackgroundColor: ["rgba(255, 196, 0, 1)", "rgba(0,199,183, 1)"],
                data: [outOfStock, products.length - outOfStock]
            },
        ]
    }

    return (
        <>
        <MetaData title="Dashboard --Admin Panel" />
            <div className="dashboard">
                <Sidebar />

                <div className="dashboardContainer">
                    <Typography component="h1">Dashboard</Typography>
                    <div className="dashboardSummary">
                        <div>
                            <p>Total Amount <br /> ₹{totalAmount}</p>
                        </div>
                        <div className="dashboardSummaryBox2">
                            <Link to="/admin/products">
                                <p>Products</p>
                                <p>{products && products.length}</p>
                            </Link>
                            <Link to="/admin/orders">
                                <p>Orders</p>
                                <p>{orders && orders.length}</p>
                            </Link>
                            <Link to="/admin/users">
                                <p>Users</p>
                                <p>{users && users.length}</p>
                            </Link>
                        </div>
                    </div>

                    <div className="lineChart">
                        <Line data={lineState} />
                    </div>
                    <div className="doughnutChart">
                        <Doughnut data={doughnutState} />
                    </div>

                </div>
            </div>
        </>
    )
}

export default Dashboard