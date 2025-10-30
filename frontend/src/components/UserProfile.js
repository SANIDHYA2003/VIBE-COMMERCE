"use client"

import { useState, useEffect } from "react"
import "../styles/UserProfile.css"

function UserProfile({ userId, onBack }) {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    bio: "",
  })

  useEffect(() => {
    fetchProfile()
  }, [userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:5000/api/user-profile/${userId}`)
      const data = await response.json()
      setProfile(data)
      setFormData({
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phoneNumber: data.phoneNumber || "",
        bio: data.bio || "",
      })
    } catch (error) {
      console.log("[v0] Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`http://localhost:5000/api/user-profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setEditing(false)
        alert("Profile updated successfully!")
      }
    } catch (error) {
      console.log("[v0] Error updating profile:", error)
      alert("Failed to update profile")
    }
  }

  if (loading) return <div className="loading">Loading profile...</div>
  if (!profile) return <div className="error">Failed to load profile</div>

  return (
    <div className="user-profile-container">
      <button onClick={onBack} className="back-btn">
        ← Back
      </button>

      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">{profile.firstName?.charAt(0) || "U"}</div>
        </div>
        <div className="profile-info">
          <h1>
            {profile.firstName} {profile.lastName}
          </h1>
          <p className="member-since">Member since {new Date(profile.memberSince).toLocaleDateString()}</p>
        </div>
        <button onClick={() => setEditing(!editing)} className="edit-btn">
          {editing ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
              />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
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
            />
          </div>

          <div className="form-group">
            <label>Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself..."
              rows="4"
            />
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      ) : (
        <div className="profile-details">
          <div className="detail-section">
            <h3>Contact Information</h3>
            <div className="detail-item">
              <span className="label">Email:</span>
              <span className="value">{profile.email || "Not provided"}</span>
            </div>
            <div className="detail-item">
              <span className="label">Phone:</span>
              <span className="value">{profile.phoneNumber || "Not provided"}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Bio</h3>
            <p className="bio-text">{profile.bio || "No bio added yet"}</p>
          </div>

          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-value">{profile.totalOrders}</div>
              <div className="stat-label">Total Orders</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">${profile.totalSpent.toFixed(2)}</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">
                {profile.lastLogin ? new Date(profile.lastLogin).toLocaleDateString() : "N/A"}
              </div>
              <div className="stat-label">Last Login</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfile
