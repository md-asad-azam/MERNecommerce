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
import { clearErrors, deleteUser, getAllUsers } from '../../actions/userAction';
import { DELETE_USER_RESET } from '../../constants/userConstants';
import Loader from '../layout/loader/Loader';


const UsersList = () => {

  const dispatch = useDispatch()
  const alert = useAlert()
  const { users, error } = useSelector(state => state.allUsers)
  const { error: deleteError, isDeleted, message } = useSelector(state => state.profile)

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
      alert.success(message)
      dispatch({ type: DELETE_USER_RESET })
    }

    dispatch(getAllUsers())
  }, [dispatch, error, alert, deleteError, isDeleted, message])


  const columns = [
    {
      field: "id",
      headerName: "User ID",
      flex: 0.5,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    { field: "email", headerName: "Email", flex: 0.7 },
    {
      field: "role",
      headerName: "Role",
      flex: 0.3,
      cellClassName: (params) => {
        return params.getValue(params.id, "role") === "admin" ?
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
          <Link to={`/admin/user/${params.getValue(params.id, "id")}`}>
            <EditIcon />
          </Link>
          <Button onClick={() => dispatch(deleteUser(params.getValue(params.id, "id")))}>
            <DeleteIcon />
          </Button>
        </>)
      }
    },
  ]
  const rows = []
  users && users.forEach((item, i) => {
    rows.push({
      id: item._id,
      name: item.name,
      email: item.email,
      role: item.role,
    })
  });

  return (
    <>
      <MetaData title="All Users --Admin" />
      <div className="dashboard">
        <Sidebar />
        <div className="productListContainer">
          <h1 id="productListHeading">All Users</h1>
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

export default UsersList