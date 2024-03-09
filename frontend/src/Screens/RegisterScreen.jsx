import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { register } from '../actions/userActions'; // Import the register action
import FormContainer from '../Components/FormContainer';
import './register.css'; //Import the CSS file

function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('student'); // Default to student
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    
  
    if (password !== confirmPassword) {
      alert('Passwords do not match');
    } else {
      dispatch(register(name, email, password, userType, confirmPassword)); // Dispatch the register action
      navigate('/login');
    }
  };
  

  return (
    <div className="inputContainer">
      <Row>
        <Col className='video' md={6} style={{ position: 'relative' }}>
          <video src="/Images/Gifforcode.mp4" autoPlay muted loop></video>
          
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'rgba(255, 255, 255, 0.5)', padding: '10px', borderRadius: '5px' }}>
            <p style={{ margin: 0 }}>REVIL: Resources for Video Learning</p>
          </div>
        </Col>
        <Col md={6}>
          <h1>Register</h1>
          <Form onSubmit={submitHandler}>
            <div className='userInputContainer'>
              <Form.Group controlId='name'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Enter your name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
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
            <div className='userInputContainer'>
              <Form.Group controlId='confirmPassword'>
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </div>
            <div className='userInputContainer'>
              <Form.Group controlId='userType'>
                <Form.Label>User Type</Form.Label>
                <Form.Control
                  as='select'
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                >
                  <option value='student'>Student</option>
                  <option value='instructor'>Instructor</option>
                </Form.Control>
              </Form.Group>
            </div>
            <Button type='submit' variant='primary'>
              Register
            </Button>
          </Form>
          <Row className='py-3'>
            <Col>
              Already registered? <Link to='/login'>Sign In</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
}

export default RegisterScreen;

