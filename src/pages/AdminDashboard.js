import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', description: '', price: '', stock_quantity: '', image: null });
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, [token]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (err) {
      setError('Failed to load products');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if (form.name) formData.append('name', form.name);
    if (form.description) formData.append('description', form.description);
    if (form.price) formData.append('price', form.price);
    if (form.stock_quantity) formData.append('stock_quantity', form.stock_quantity);
    if (form.image) formData.append('image', form.image);

    try {
      if (editingId) {
        const response = await axios.put(
          `http://127.0.0.1:8000/api/products/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product updated');
        setEditingId(null);
      } else {
        const response = await axios.post(
          'http://127.0.0.1:8000/api/products',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Product created');
      }
      setForm({ name: '', description: '', price: '', stock_quantity: '', image: null });
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Operation failed');
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock_quantity: product.stock_quantity,
      image: null,
    });
    setIsModalOpen(true);
    setViewProduct(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Product deleted');
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleView = (product) => {
    setViewProduct(product);
    setIsModalOpen(true);
    setEditingId(null);
    setForm({ name: '', description: '', price: '', stock_quantity: '', image: null });
    setError('');
  };

  const openModal = () => {
    setEditingId(null);
    setForm({ name: '', description: '', price: '', stock_quantity: '', image: null });
    setError('');
    setIsModalOpen(true);
    setViewProduct(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', description: '', price: '', stock_quantity: '', image: null });
    setError('');
    setViewProduct(null);
  };

  return (
    <div>
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button className="create-button" onClick={openModal} title="Create Product" aria-label="Create a new product">
          <FaPlus />
        </button>
      </div>
      {error && <div className="error">{error}</div>}
      <h2>Products</h2>
      <div className="product-list">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description ? product.description.substring(0, 50) + '...' : 'No description'}</p>
            <p>Price: ₱{product.price}</p>
            <p>Stock: {product.stock_quantity}</p>
            {product.image_url && <img src={`http://127.0.0.1:8000${product.image_url}`} alt={product.name} />}
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
                className="edit-button"
                onClick={() => handleEdit(product)}
                title="Edit product"
                aria-label={`Edit ${product.name}`}
              >
                <FaEdit />
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(product.id)}
                title="Delete product"
                aria-label={`Delete ${product.name}`}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <button className="close-button" onClick={closeModal} title="Close modal" aria-label="Close modal">
              ×
            </button>
            {viewProduct ? (
              <div className="view-modal-content">
                <h2>{viewProduct.name}</h2>
                {viewProduct.image_url && (
                  <img src={`http://127.0.0.1:8000${viewProduct.image_url}`} alt={viewProduct.name} />
                )}
                <p><strong>Description:</strong> {viewProduct.description || 'No description'}</p>
                <p><strong>Price:</strong> ${viewProduct.price}</p>
                <p><strong>Stock Quantity:</strong> {viewProduct.stock_quantity}</p>
              </div>
            ) : (
              <>
                <h2>{editingId ? 'Edit Product' : 'Create Product'}</h2>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label>Description:</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <label>Price:</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })}
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label>Stock Quantity:</label>
                    <input
                      type="number"
                      value={form.stock_quantity}
                      onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                      min="0"
                      required
                    />
                  </div>
                  <div>
                    <label>Image:</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                    />
                  </div>
                  {error && <div className="error">{error}</div>}
                  <button type="submit">{editingId ? 'Update Product' : 'Create Product'}</button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;