import React, { useState } from 'react'
import { useAlert } from "react-alert"
import { useDispatch, useSelector } from "react-redux"
import HomeIcon from '@mui/icons-material/Home';
import MetaData from '../layout/MetaData'
import PublicIcon from '@mui/icons-material/Public';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import FiberPinIcon from '@mui/icons-material/FiberPin';
import { saveShippingInfo } from '../../actions/cartAction'
import { Country, State } from "country-state-city"
import "./Shipping.css"
import CheckoutSteps from './CheckoutSteps';
import { useNavigate } from 'react-router-dom';

const Shipping = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { shippingInfo } = useSelector(state => state.cart)
  const alert = useAlert()

  const [address, setAddress] = useState(shippingInfo.address);
  const [city, setCity] = useState(shippingInfo.city);
  const [state, setState] = useState(shippingInfo.state);
  const [country, setCountry] = useState(shippingInfo.country);
  const [pinCode, setPinCode] = useState(shippingInfo.pinCode);
  const [phoneNo, setPhoneNo] = useState(shippingInfo.phoneNo);

  const shippingSubmit = (e) => {
    e.preventDefault()

    if (phoneNo.length < 10 || phoneNo.length > 10) {
      alert.error("Phone Number should be 10 digits")
      return
    }
    dispatch(
      saveShippingInfo({ address, pinCode, phoneNo, country, state, city })
    )
    navigate("/order/confirm")
  }

  return (
    <>
      <MetaData title="Shipping Details" />
      <CheckoutSteps activeStep={0} />

      <div className="shippingContainer">
        <div className="shippingBox">
          <h2 className="shippingHeading">Shipping Details</h2>
          <form
            encType='multipart/form-data'
            className="shippingForm"
            onSubmit={e => shippingSubmit(e)}
          >
            <div>
              <HomeIcon />
              <input
                type="text"
                placeholder='Address'
                required
                value={address}
                onChange={e => setAddress(e.target.value)}
              />
            </div>

            <div>
              <FiberPinIcon />
              <input
                type="number"
                placeholder='Pin Code'
                required
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
              />
            </div>

            <div>
              <PhoneAndroidIcon />
              <input
                type="number"
                placeholder='Phone Number'
                required
                value={phoneNo}
                onChange={e => setPhoneNo(e.target.value)}
                size="10"
              />
            </div>

            <div>
              <PublicIcon />
              <select
                required
                value={country}
                onChange={e => setCountry(e.target.value)}
              >
                <option value="">Country</option>
                {Country && Country.getAllCountries().map(item => (
                  <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                ))}
              </select>
            </div>

            {country && (
              <div>
                <MyLocationIcon />
                <select
                  required
                  value={state}
                  onChange={e => setState(e.target.value)}
                >
                  <option value="">State</option>
                  {State && State.getStatesOfCountry(country).map(item => (
                    <option key={item.isoCode} value={item.isoCode}>{item.name}</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <LocationCityIcon />
              <input
                type="text"
                placeholder='City'
                required
                value={city}
                onChange={e => setCity(e.target.value)}
              />
            </div>

            <input type="submit"
              value="Continue"
              className='shippingBtn'
              disabled={!state}
              onClick={e => shippingSubmit(e)}
            />

          </form>
        </div>
      </div>

    </>
  )
}

export default Shipping