"use client"

import { useState, useEffect, useCallback } from "react"
import "../styles/AddressManager.css"

function AddressManager({ userId, onSelectAddress, selectedAddressId }) {
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    addressType: "home",
  })

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/addresses/user/${userId}`)
      const data = await response.json()
      setAddresses(data)
      if (data.length > 0 && !selectedAddressId) {
        onSelectAddress(data[0]._id)
      }
    } catch (error) {
      console.log("[v0] Error fetching addresses:", error)
    } finally {
      setLoading(false)
    }
  }, [userId, selectedAddressId, onSelectAddress])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.fullName ||
      !formData.phoneNumber ||
      !formData.streetAddress ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.country
    ) {
      alert("Please fill in all fields")
      return
    }

    try {
      const url = editingId ? `http://localhost:5000/api/addresses/${editingId}` : "http://localhost:5000/api/addresses"

      const method = editingId ? "PUT" : "POST"
      const body = editingId ? formData : { ...formData, userId }

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        alert(editingId ? "Address updated!" : "Address added!")
        resetForm()
        await fetchAddresses()
      }
    } catch (error) {
      console.log("[v0] Error saving address:", error)
      alert("Failed to save address")
    }
  }

  const handleEdit = (address) => {
    setFormData({
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      addressType: address.addressType,
    })
    setEditingId(address._id)
    setShowForm(true)
  }

  const handleDelete = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return

    try {
      const response = await fetch(`http://localhost:5000/api/addresses/${addressId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Address deleted!")
        await fetchAddresses()
      }
    } catch (error) {
      console.log("[v0] Error deleting address:", error)
      alert("Failed to delete address")
    }
  }

  const handleSetDefault = async (addressId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/addresses/${addressId}/set-default`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (response.ok) {
        await fetchAddresses()
      }
    } catch (error) {
      console.log("[v0] Error setting default address:", error)
    }
  }

  const resetForm = () => {
    setFormData({
      fullName: "",
      phoneNumber: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
      addressType: "home",
    })
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className="loading">Loading addresses...</div>

  return (
    <div className="address-manager">
      <div className="address-header">
        <h3>Delivery Address</h3>
        <button onClick={() => setShowForm(!showForm)} className="add-address-btn">
          {showForm ? "Cancel" : "+ Add New Address"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="+1 (555) 123-4567"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="123 Main Street"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="New York"
                required
              />
            </div>
            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="NY"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                placeholder="10001"
                required
              />
            </div>
            <div className="form-group">
              <label>Country</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="United States"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Address Type</label>
            <select name="addressType" value={formData.addressType} onChange={handleChange}>
              <option value="home">Home</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="button" onClick={resetForm} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              {editingId ? "Update Address" : "Save Address"}
            </button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <p className="no-addresses">No addresses saved. Add one to get started!</p>
        ) : (
          addresses.map((address) => (
            <div
              key={address._id}
              className={`address-card ${selectedAddressId === address._id ? "selected" : ""}`}
              onClick={() => onSelectAddress(address._id)}
            >
              <div className="address-content">
                <div className="address-header-info">
                  <h4>{address.fullName}</h4>
                  <span className="address-type">{address.addressType}</span>
                  {address.isDefault && <span className="default-badge">Default</span>}
                </div>
                <p className="address-text">{address.streetAddress}</p>
                <p className="address-text">
                  {address.city}, {address.state} {address.zipCode}
                </p>
                <p className="address-text">{address.country}</p>
                <p className="address-phone">{address.phoneNumber}</p>
              </div>
              <div className="address-actions">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleEdit(address)
                  }}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(address._id)
                  }}
                  className="delete-btn"
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleSetDefault(address._id)
                    }}
                    className="default-btn"
                  >
                    Set Default
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AddressManager
