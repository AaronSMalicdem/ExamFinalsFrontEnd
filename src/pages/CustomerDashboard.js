import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaEye } from 'react-icons/fa';

function CustomerDashboard() {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [error, setError] = useState('');
  const [viewProduct, setViewProduct] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productResponse = await axios.get('http://127.0.0.1:8000/api/products', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(productResponse.data);

        // Fetch wishlist
        const wishlistResponse = await axios.get('http://127.0.0.1:8000/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlistResponse.data.map(item => item.id));
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load data');
      }
    };
    if (token) {
      fetchData();
    } else {
      setError('Please log in to view products');
    }
  }, [token]);

  const toggleWishlist = async (productId) => {
    try {
      if (wishlist.includes(productId)) {
        // Remove from wishlist
        const response = await axios.delete(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWishlist(wishlist.filter(id => id !== productId));
        alert(response.data.message);
      } else {
        // Add to wishlist
        const response = await axios.post(
          `http://127.0.0.1:8000/api/wishlist/${productId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWishlist([...wishlist, productId]);
        alert(response.data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update wishlist');
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
  };

  const closeModal = () => {
    setViewProduct(null);
  };

  return (
    <div>
      <h1>Customer Dashboard</h1>
      <h2>Products</h2>
      {error && <div className="error">{error}</div>}
      {products.length === 0 && !error && (
        <p>No products available at the moment.</p>
      )}
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description ? product.description.substring(0, 50) + '...' : 'No description'}</p>
            <p>Price: ₱{product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            {product.image_url && <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.name} loading="lazy" />}
            <div className="button-container">
              <button
                className="view-button"
                onClick={() => handleView(product)}
                title="View product details"
                aria-label={`View details for ${product.name}`}
              >
                <FaEye />
              </button>
              <button
                className="wishlist-button"
                onClick={() => toggleWishlist(product.id)}
                title={wishlist.includes(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
                aria-label={wishlist.includes(product.id) ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
              >
                {wishlist.includes(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          </div>
        ))}
      </div>
      {viewProduct && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal} title="Close modal" aria-label="Close modal">
              ×
            </button>
            <div className="view-modal-content">
              <h2>{viewProduct.name}</h2>
              {viewProduct.image_url && (
                <img src={`http://127.0.0.1:8000${viewProduct.image_url}`} alt={viewProduct.name} loading="lazy" />
              )}
              <p><strong>Description:</strong> {viewProduct.description || 'No description'}</p>
              <p><strong>Price:</strong> ₱{viewProduct.price}</p>
              <p><strong>Stock Quantity:</strong> {viewProduct.stock_quantity}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerDashboard;