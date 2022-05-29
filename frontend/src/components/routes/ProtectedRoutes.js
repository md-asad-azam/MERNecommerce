import React from 'react'
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from "../Admin/Dashboard"
import Loader from '../layout/loader/Loader';


const ProtectedRoutes = ({ isAdmin, ele }) => {

    const { isAuthenticated, user, loading } = useSelector(state => state.user)

    if (loading === false) {
        if (!isAuthenticated)
            return <Navigate to="/login" />

        if (isAdmin && user.role !== "admin")
            return <Navigate to="/login" />

        return ele

    } else {
        return <Loader />
    }
}

export default ProtectedRoutes