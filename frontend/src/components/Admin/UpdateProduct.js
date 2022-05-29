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
import { useNavigate, useParams } from 'react-router-dom';
import { clearErrors, getProductDetails, updateProduct } from '../../actions/productAction';
import { UPDATE_PRODUCT_RESET } from '../../constants/productConstants';
import "./UpdateProduct.css"

const UpdateProduct = () => {

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

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [Stock, setStock] = useState(0);
    const [oldImages, setOldImages] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);

    const { error, product } = useSelector(state => state.productDetails)
    const { loading, error: updateError, isUpdated } = useSelector(state => state.product)

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

        dispatch(updateProduct(id, myForm))
    }

    const productImageChange = (e) => {
        const files = Array.from(e.target.files)

        setOldImages([])

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

    const [loaded, setLoaded] = useState("") //to load the product every time the comp. mounts 

    useEffect(() => {

        if (product && product._id !== loaded) {
            dispatch(getProductDetails(id))
            setLoaded(id)
        } else {
            setName(product.name)
            setPrice(product.price)
            setDescription(product.description)
            setCategory(product.category)
            setStock(product.Stock)
            setOldImages(product.images)
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success("Product updated successfully")
            navigate("/admin/products")
            dispatch({ type: UPDATE_PRODUCT_RESET })
        }

    }, [dispatch, error, isUpdated, alert, navigate, product, id])


    return (
        <>
            <MetaData title="Update Product" />
            <div className="dashboard">
                <Sidebar />
                <div className="updateProductContainer">
                    <form
                        encType='multipart/form-data'
                        className="updateProductForm"
                        onSubmit={e => productSubmitHandler(e)}
                    >
                        <h1>Update Product</h1>
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
                                value={price}
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
                            <select value={category} onChange={(e) => setCategory(e.target.value)}>
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
                                value={Stock}
                                onChange={(e) => setStock(e.target.value)}
                            />
                        </div>

                        <div id="updateProductFormFile">
                            <input
                                type="file"
                                name="avatar"
                                accept='image/*'
                                multiple
                                onChange={productImageChange}
                            />
                        </div>

                        <div id="updateProductFormImage">
                            {oldImages && oldImages.map((img, i) => (
                                <img key={i} src={img.url} alt="old product preview" />
                            ))}
                        </div>

                        <div id="updateProductFormImage">
                            {imagesPreview.map((img, i) => (
                                <img key={i} src={img} alt="product preview" />
                            ))}
                        </div>

                        <Button
                            id='updateProductBtn'
                            type='submit'
                            disabled={loading}
                            onClick={e => productSubmitHandler(e)}
                        >Update</Button>

                    </form>
                </div>
            </div>
        </>
    )
}

export default UpdateProduct