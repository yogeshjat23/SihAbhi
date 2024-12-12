// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import './Signin.css';


// // const loginUser = async ({ email, password }) => {
// //   try {
// //     const response = await axios.post('http://localhost:5000/api/login', { email, password });
// //     return response.status === 200;
// //   } catch (error) {
// //     return false;
// //   }
// // };

// const Signin = () => {
//   const [formData, setFormData] = useState({ email: '', password: '' });
//   const { username, password } = formData;
//   const navigate = useNavigate();

//   const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = async e => {
//     e.preventDefault();
      
//     console.log("form submitted", formData);

//   };

//   return (
//     <div className="container">
//       <p className="title">Sign-In Form</p>
//       <form onSubmit={e => onSubmit(e)} className="form">
        
//         <input
//           placeholder="Username"
//           type="text"
//           name="username"
//           value={uername}
//           onChange={e => onChange(e)}
//           required
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           name="password"
//           value={password}
//           onChange={e => onChange(e)}
//           required
//         />
//         <button type="submit">SignIn</button>
//       </form>
//     </div>
//   );
// };

// export default Signin;

/* 
/////////////////////////////////////////////

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'client' });
  const { username, password, role } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form submitted", formData);

      // API call for login with role
      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200 && response.data.success) {
        console.log("Login successful", response.data);

        // Navigate to homepage with user role information
        navigate('/', { state: { isAdmin: response.data.isAdmin, role } });
      } else {
        alert("Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error", error);

      if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 401) {
          alert("Unauthorized: Incorrect username, password, or role.");
        } else if (error.response.status === 500) {
          alert("Server error: Please try again later.");
        } else {
          alert(`Unexpected error: ${error.response.data.message || 'Please try again.'}`);
        }
      } else {
        alert("Network error: Please check your connection.");
      }
    }
  };

  return (
    <div className="container">
      <p className="title">Sign-In Form</p>
      <form onSubmit={onSubmit} className="form">
        <input
          placeholder="Username"
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          required
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <select name="role" value={role} onChange={onChange} required>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
*/
////////////////////////////////////////////////////////






// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import './Signin.css';

// const Signin = () => {
//   const [formData, setFormData] = useState({ username: '', password: '', role: 'client' });
//   const { username, password, role } = formData;
//   const navigate = useNavigate();

//   const HARD_CODED_USERNAME = 'admin_motor';
//   const HARD_CODED_PASSWORD = 'admin1234';

//   const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const onSubmit = (e) => {
//     e.preventDefault();

//     if (username === HARD_CODED_USERNAME && password === HARD_CODED_PASSWORD) {
//       console.log("Login successful");

//       // Navigate to homepage with user role information
//       navigate('/', { state: { isAdmin: true, role: 'admin' } });
//     } else {
//       alert("Invalid credentials. Please try again.");
//     }
//   };

//   return (
//     <div className="container">
//       <p className="title">Sign-In Form</p>
//       <form onSubmit={onSubmit} className="form">
//         <input
//           placeholder="Username"
//           type="text"
//           name="username"
//           value={username}
//           onChange={onChange}
//           required
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           name="password"
//           value={password}
//           onChange={onChange}
//           required
//         />
//         <button type="submit">Sign In</button>
//       </form>
//     </div>
//   );
// };

// export default Signin;
  


// Signin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';  // Import useAuth hook
import './Signin.css';

const Signin = () => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'client' });
  const { username, password, role } = formData;
  const navigate = useNavigate();
  const { login } = useAuth();  // Get the login function from context

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Form submitted", formData);

      // API call for login with role
      const response = await axios.post('http://localhost:5000/api/login', formData);

      if (response.status === 200 && response.data.success) {
        console.log("Login successful", response.data);

        // Update the AuthContext with the login state
        if (role === 'admin') {
          login('admin', password);  // Update auth context for admin
        } else {
          login('client', password);  // Update auth context for client
        }

        // Navigate to homepage with user role information
        navigate('/', { state: { isAdmin: response.data.isAdmin, role } });
      } else {
        alert("Invalid login credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login error", error);

      if (error.response) {
        // Handle specific HTTP errors
        if (error.response.status === 401) {
          alert("Unauthorized: Incorrect username, password, or role.");
        } else if (error.response.status === 500) {
          alert("Server error: Please try again later.");
        } else {
          alert(`Unexpected error: ${error.response.data.message || 'Please try again.'}`);
        }
      } else {
        alert("Network error: Please check your connection.");
      }
    }
  };

  return (
    <div className="container">
      <p className="title">Sign-In Form</p>
      <form onSubmit={onSubmit} className="form">
        <input
          placeholder="Username"
          type="text"
          name="username"
          value={username}
          onChange={onChange}
          required
        />
        <input
          placeholder="Password"
          type="password"
          name="password"
          value={password}
          onChange={onChange}
          required
        />
        <select name="role" value={role} onChange={onChange} required>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default Signin;
