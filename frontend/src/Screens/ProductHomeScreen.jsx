import React, { useState, useEffect } from 'react';
import { Row, Col, Form } from 'react-bootstrap';
import Product from '../Components/Product';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';

import Loader from '../Components/Loader';
import Message from '../Components/Message';

function ProductHome() {
  const dispatch = useDispatch();
  const productList = useSelector(state => state.productList);
  const { error, loading, products } = productList;

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    dispatch(listProducts());
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Form>
        <Form.Group controlId="search">
          <Form.Control
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </Form.Group>
      </Form>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <h1>Latest Products</h1>
          <Row>
            {filteredProducts.map(product => (
              <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
        </div>
      )}
    </div>
  );
}

export default ProductHome;
