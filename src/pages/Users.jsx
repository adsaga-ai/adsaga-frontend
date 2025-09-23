import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { userService } from '../services'

const Users = () => {
  const { isAuthenticated } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    password: ''
  })

  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const data = await userService.getUsers()
      setUsers(data.data || data)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.user_id, formData)
      }
      setShowForm(false)
      setEditingUser(null)
      setFormData({ fullname: '', email: '', password: '' })
      fetchUsers()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleEdit = (user) => {
    setEditingUser(user)
    setFormData({
      fullname: user.fullname,
      email: user.email,
      password: ''
    })
    setShowForm(true)
  }

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(userId)
        fetchUsers()
      } catch (error) {
        setError(error.message)
      }
    }
  }

  const resetForm = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({ fullname: '', email: '', password: '' })
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-foreground">Please login to manage users</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-foreground mb-4">User Management</h1>
        <p className="text-lg text-muted-foreground">Manage users in your system</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-8">
        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-4 sm:mb-0">Users</h2>
            <button 
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              Add New User
            </button>
          </div>

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading users...</p>
            </div>
          )}

          {!loading && users.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-muted-foreground text-lg">No users found. Add your first user to get started.</p>
            </div>
          )}

          {!loading && users.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.map((user) => (
                <div key={user.user_id} className="card group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">
                        {user.fullname?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        className="btn btn-secondary text-sm px-3 py-1"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-danger text-sm px-3 py-1"
                        onClick={() => handleDelete(user.user_id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                    {user.fullname}
                  </h3>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="font-medium">Email:</span> {user.email}</p>
                    <p><span className="font-medium">Organisation:</span> {user.organisation_name || 'Not assigned'}</p>
                    <p><span className="font-medium">Created:</span> {new Date(user.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {showForm && (
          <div className="card">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group">
                  <label htmlFor="fullname" className="form-label">Full Name</label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>

              {!editingUser && (
                <div className="form-group">
                  <label htmlFor="password" className="form-label">Password</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="Enter password"
                    required={!editingUser}
                  />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <button type="submit" className="btn btn-primary">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default Users
