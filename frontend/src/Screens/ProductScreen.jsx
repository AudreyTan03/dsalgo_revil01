import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../actions/cartActions';

const ProductScreen = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInstructor, setIsInstructor] = useState(false); // State to track if the user is an instructor

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/products/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch product. Status: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
    
    // Check if the user is an instructor
    const userIsInstructor = localStorage.getItem('is_instructor') === 'true';
    setIsInstructor(userIsInstructor);
  }, [id]);

  const handleAddToCart = () => {
    dispatch(addToCart(id, qty));
    navigate('/cart');
  };

  const handleDeleteProduct = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/products/${id}/delete/`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete product. Status: ${response.status}`);
      }
      navigate('/'); // Navigate back to the home page or any other appropriate page
    } catch (error) {
      setError(error.message);
    }
  };

  const handleEditProduct = () => {
    navigate(`/edit`); // Navigate to the edit screen for the current product
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!product) {
    return <div>No product found</div>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {product.video && (
        <video controls style={{ width: '100%' }}>
          <source src={product.video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
      <img src={product.image} alt={product.name} />
      <p>{product.description}</p>
      <p>{product.price}</p>
      <p> created at ito{product.createdAt}</p>

      <p> edited at {product.editedAt}</p>

      <div>
        <label>Quantity:</label>
        <select value={qty} onChange={(e) => setQty(Number(e.target.value))}>
          {[...Array(product.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </select>
      </div>

        <div>
          <button onClick={handleAddToCart}>Add to Cart</button>
          <button onClick={handleDeleteProduct}>Delete Product</button>
          <button onClick={handleEditProduct}>Edit Product</button>
        </div>
      
    </div>
  );
};

export default ProductScreen;
