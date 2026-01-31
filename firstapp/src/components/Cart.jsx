import React, { useState, useEffect } from 'react'
import axios from 'axios'

export default function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    fetchCartItems()
  }, [])

  async function fetchCartItems() {
    try {
      const res = await axios.get("http://localhost:4000/api/cart", {
        params: { userId }
      })
      if (res.status === 200) {
        setCartItems(res.data.items)
      }
    } catch (err) {
      console.error("Error fetching cart items:", err)
    } finally {
      setLoading(false)
    }
  }

  // 🗑 Delete item from cart
  async function deleteCartItem(productId) {
    try {
      const res = await axios.delete("http://localhost:4000/api/cart", {
        data: { userId, productId }   // sending userId + productId
      })
      if (res.status === 200) {
        // Refresh cart after deletion
        fetchCartItems()
      }
    } catch (err) {
      console.error("Error deleting cart item:", err)
    }
  }

  return (
    <div className='container mt-4'>
      <h2>Cart List</h2>
      {
        loading ? (<p>Loading...</p>) : (
          cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className='row row-cols-1 row-cols-md-3 g-4 mt-3'>
              {
                cartItems.map((i) => (
                  <div className="col" key={i.product._id}>
                    <div className="card h-100">
                      <div className="card-body">
                        <h5 className="card-title"><b>Name:</b> {i.product.name}</h5>
                        <p className="card-text"><b>Price: </b>{i.product.price}</p>
                        <p className="card-text"><b>Category: </b>{i.product.category}</p>
                        <p className="card-text"><b>Description: </b>{i.product.description}</p>
                        <p className="card-text"><b>Stock: </b>{i.product.stock}</p>
                        <p className="card-text"><b>Quantity: </b>{i.quantity}</p>
                        {/* 🗑 Delete Button */}
                        <button 
                          className="btn btn-danger mt-2"
                          onClick={() => deleteCartItem(i.product._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          )
        )
      }
    </div>
  )
}