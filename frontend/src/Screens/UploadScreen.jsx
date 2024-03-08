import React, { useState } from 'react';
import axios from 'axios';

const UploadScreen = () => {
    const [file, setFile] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [countInStock, setCountInStock] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handlePriceChange = (e) => {
        setPrice(e.target.value);
    };

    const handleCountInStockChange = (e) => {
        setCountInStock(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let formData = new FormData();
        formData.append('image', file);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('countInStock', countInStock);

        axios.post('http://localhost:8000/api/post-product/', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            console.log(response.data);
            // Reset form fields
            setFile(null);
            setName('');
            setDescription('');
            setPrice('');
            setCountInStock('');
        })
        .catch(error => {
            console.error('Error uploading product:', error);
        });
    };

    return (
        <div>
            <h2>Upload Product</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="image">Image:</label>
                    <input type="file" id="image" onChange={handleFileChange} required />
                </div>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" value={description} onChange={handleDescriptionChange} required />
                </div>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" value={price} onChange={handlePriceChange} required />
                </div>
                <div>
                    <label htmlFor="countInStock">Count in Stock:</label>
                    <input type="number" id="countInStock" value={countInStock} onChange={handleCountInStockChange} required />
                </div>
                <button type="submit">Upload</button>
            </form>
        </div>
    );
};

export default UploadScreen;
