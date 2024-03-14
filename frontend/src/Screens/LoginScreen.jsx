import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../Components/Loader';
import Message from '../Components/Message';
import axios from 'axios'; // Import axios
import FormContainer from '../Components/FormContainer';
import './register.css';

function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const userLogin = useSelector(state => state.userLogin);
    const { loading, userInfo } = userLogin;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [error, setError] = useState('');

    

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/users/login/', { email, password });
            const { token, user_type, msg } = response.data;
            // You can now store the token and user type in your Redux store or local storage
            // For example, dispatch a login action with the token and user type
            // dispatch(loginSuccess(token, user_type));
            // Navigate to the appropriate page based on the user type
            if (user_type === 'instructor') {
                navigate('/HomeScreen');
            } else {
                navigate('/studenthomescreen');
            }
        } catch (error) {
            setError('Email or password is incorrect');
        }
    }

    // Handle request password change
    const handleRequestPasswordChange = () => {
        navigate('/request-changepass');
    }

    return (
        <div className="inputContainer">
            <Row>
                <Col className='video' md={6}>
                    <video src="/Images/Gifforcode.mp4" autoPlay muted loop></video>
                </Col>
                <Col md={6} style={{ paddingTop: '20px' }}>
                    <FormContainer>
                        <h1>Sign In</h1>
                        <p className='ms-60'>WELCOME BACK!</p>
                        {error && <Message variant='danger'>{error}</Message>}
                        {loading && <Loader />}
                        <Form onSubmit={submitHandler}>
                            <div className='userInputContainer'>
                                <Form.Group controlId='email'>
                                    <Form.Label>Email Address</Form.Label>
                                    <Form.Control
                                        type='text'
                                        placeholder='Enter email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </Form.Group>
                            </div>

                            <div className='userInputContainer'>
                                <Form.Group controlId='password'>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type='password'
                                        placeholder='Enter password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </Form.Group>
                            </div>

                            <Button type='submit' variant='primary'>
                                Sign In
                            </Button>
                        </Form>
                        <Row className='py-3'>
                            <Col>
                                <Link to='/register'>Register</Link>
                            </Col>
                            <Col>
                                <Button variant='link' onClick={handleRequestPasswordChange}>
                                    Forgot password?
                                </Button>
                            </Col>
                        </Row>
                    </FormContainer>
                </Col>
            </Row>
        </div>
    );
}

export default LoginScreen;
