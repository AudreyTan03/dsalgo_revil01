import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserDetails, updateUserProfile, resetUpdateProfile } from '../actions/userActions';
import StudentNav from '../Components/StudentNav'; // Import the StudentNav component here

function ProfileScreen() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const userProfileUpdate = useSelector((state) => state.userUpdateProfile);
    const { loading, error, user } = userDetails;
    const { loading: updateLoading, success: updateSuccess, error: updateError } = userProfileUpdate;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [fileName, setFileName] = useState('');
    const [editMode, setEditMode] = useState(false); // Add edit mode state
    // const defaultPictureUrl = '/default_profile_picture.jpg'; // Update with your default picture URL

    useEffect(() => {
        dispatch(getUserDetails());
    }, [dispatch]);

    useEffect(() => {
        console.log('User Details:', userDetails); // Debugging statement
        // console.log('User Data:', user.data); // Debugging statement
        // console.log('Profile Data:', user.data.user_data); // Debugging statement
        console.log('Loading:', loading); // Debugging statement
        console.log('Error:', error); // Debugging statement
    }, [userDetails]);

    useEffect(() => {
        if (updateSuccess) {
            dispatch(resetUpdateProfile());
            dispatch(getUserDetails());
            setEditMode(false); // Exit edit mode after successful update
        }
    }, [updateSuccess, dispatch]);

    useEffect(() => {
        if (user?.data?.user_data) {
            const { name: userName, email: userEmail } = user.data.user_data;
            setName(userName || '');
            setEmail(userEmail || '');
        }
    }, [user]);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setProfilePicture(selectedFile);
            setFileName(selectedFile.name);
        } else {
            setProfilePicture(null);
            setFileName('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = {
            name,
            email,
        };
        await dispatch(updateUserProfile(updatedUser, profilePicture));
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
    };

    return (
        <div>
            <StudentNav /> {/* Render the StudentNav component here */}
            <div className="profile-container">
                <h2>Profile</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <div className="profile-details">
                        {editMode ? ( // Show edit form if in edit mode
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="name">Name:</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="profilePicture">Profile Picture:</label>
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        onChange={handleFileChange}
                                    />
                                    {fileName && <p>Selected file: {fileName}</p>}
                                </div>
                                <button type="submit" disabled={updateLoading}>
                                    {updateLoading ? 'Updating...' : 'Update Profile'}
                                </button>
                                {updateError && <p>Error: {updateError}</p>}
                            </form>
                        ) : ( // Show view mode otherwise
                            <>
                                <div className="details-group">
                                    <p><strong>Name:</strong> {user?.data?.user_data?.name}</p>
                                    <p><strong>Email:</strong> {user?.data?.user_data?.email}</p>
                                </div>
                                {/* <div className="profile-image">
                                    <img src={defaultPictureUrl} alt="Default Profile" />
                                </div> */}
                            </>
                        )}
                        <button onClick={toggleEditMode}>
                            {editMode ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileScreen;
