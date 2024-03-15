import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Fetch all products
    axios.get('http://127.0.0.1:8000/api/products/')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  const handleSelectProduct = productId => {
    // Find the selected product in the products array
    const product = products.find(product => product._id === productId);
    setSelectedProduct(product);
  };

  const handleChange = e => {
    setSelectedProduct({
      ...selectedProduct,
      name: e.target.value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();

    // Patch request to update the name of the selected product
    axios.patch(`http://127.0.0.1:8000/api/products/${selectedProduct._id}/edit/`, { name: selectedProduct.name })
      .then(response => {
        console.log('Product name updated:', response.data);
        // Optionally, you can redirect or show a success message here
      })
      .catch(error => {
        console.error('Error updating product name:', error);
      });
  };

  return (
    <div>
      <h2>Edit Product</h2>
      <ul>
        {products.map(product => (
          <li key={product._id} onClick={() => handleSelectProduct(product._id)}>
            {product.name}
          </li>
        ))}
      </ul>
      {selectedProduct && (
        <form onSubmit={handleSubmit}>
          {/* Input field for editing the name of the selected product */}
          <input type="text" name="name" value={selectedProduct.name} onChange={handleChange} />
          

          <button type="submit">Update Name</button>
        </form>
      )}
    </div>
  );
};

export default EditProduct;
