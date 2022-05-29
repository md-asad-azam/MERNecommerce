import React, { useEffect, useState } from 'react'
import { useAlert } from 'react-alert'
import { useDispatch, useSelector } from 'react-redux'
import MetaData from '../layout/MetaData'
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DescriptionIcon from "@mui/icons-material/Description";
import StorageIcon from "@mui/icons-material/Storage";
import SpellcheckIcon from "@mui/icons-material/Spellcheck";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Sidebar from './Sidebar'
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { clearErrors, newProduct } from '../../actions/productAction';
import { NEW_PRODUCT_RESET } from '../../constants/productConstants';
import "./NewProduct.css"

const NewProduct = () => {

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

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const alert = useAlert()

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { loading, error, success } = useSelector(state => state.newProduct)

    const productSubmitHandler = (e) => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set("name", name)
        myForm.set("price", price)
        myForm.set("description", description)
        myForm.set("category", category)
        myForm.set("Stock", Stock)

        images.forEach((img) => {
            myForm.append("images", img)
        })

        dispatch(newProduct(myForm))
    }

    const productImageChange = (e) => {
        const files = Array.from(e.target.files)

        // setImages([])
        // setImagesPreview([])

        files.forEach((file) => {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setImagesPreview((old) => [...old, reader.result])
                    setImages((old) => [...old, reader.result])
                }
            }

            reader.readAsDataURL(file)
        })
    }

    useEffect(() => {
        if (error) {
            alert.error(error)
            dispatch(clearErrors())
            navigate("/admin/dashboard")
        }
        if (success) {
            alert.success("Product created successfully")
            navigate("/admin/dashboard")
            dispatch({ type: NEW_PRODUCT_RESET })
        }
    }, [dispatch, error, success, alert, navigate])


    return (
        <>
            <MetaData title="Create Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="newProductContainer">
                    <form
                        encType='multipart/form-data'
                        className="createProductForm"
                        onSubmit={e => productSubmitHandler(e)}
                    >
                        <h1>Create Product</h1>
                        <div>
                            <SpellcheckIcon />
                            <input
                                type="text"
                                placeholder='Product Name'
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <AttachMoneyIcon />
                            <input
                                type="number"
                                placeholder="Price"
                                required
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>

                        <div>
                            <DescriptionIcon />
                            <textarea
                                placeholder="Product Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                cols="30"
                                rows="1"
                            ></textarea>
                        </div>

                        <div>
                            <AccountTreeIcon />
                            <select onChange={(e) => setCategory(e.target.value)}>
                                <option value="">Choose Category</option>
                                {categories.map((cate) => (
                                    <option key={cate} value={cate}>
                                        {cate}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <StorageIcon />
                            <input
                                type="number"
                                placeholder="Stock"
                                required
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>
                        <div id="createProductFormFile">
                            <input
                                type="file"
                                name="avatar"
                                accept='image/*'
                                multiple
                                onChange={productImageChange}
                            />
                        </div>
                        <div id="createProductFormImage">
                            {imagesPreview.map((img, i) => (
                                <img key={i} src={img} alt="product preview" />
                            ))}
                        </div>
                        <Button
                            id='createProductBtn'
                            type='submit'
                            disabled={loading}
                            onClick={e => productSubmitHandler(e)}
                        >Create</Button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default NewProduct