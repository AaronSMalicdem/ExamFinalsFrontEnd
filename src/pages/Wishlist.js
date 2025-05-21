import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FiTrash2 } from 'react-icons/fi';

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const [error, setError] = useState('');
    const { token } = useContext(AuthContext);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/wishlist', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setWishlist(response.data);
            } catch (err) {
                setError('Failed to load wishlist');
            }
        };
        fetchWishlist();
    }, [token]);

    const removeFromWishlist = async (productId) => {
        try {
            const response = await axios.delete(`http://127.0.0.1:8000/api/wishlist/${productId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert(response.data.message);
            setWishlist(wishlist.filter((item) => item.id !== productId));
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove from wishlist');
        }
    };

    return (
        <div>
            <h1>My Wishlist</h1>
            {error && <div className="error">{error}</div>}
            <div className="product-list">
                {wishlist.map((product) => (
                    <div key={product.id} className="product-card">
                        <h3>{product.name}</h3>
                        <p>{product.description || 'No description'}</p>
                        <p>Price: ${product.price}</p>
                        <p>Stock: {product.stock_quantity}</p>
                        {product.image_url && <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.name} />}
                        <button
                            className="delete-button"
                            onClick={() => removeFromWishlist(product.id)}
                            title="Remove from Wishlist"
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                marginTop: '10px',
                            }}
                        >
                            <FiTrash2 size={20} color="red" />
                        </button>


                    </div>
                ))}
            </div>
        </div>
    );
}

export default Wishlist;