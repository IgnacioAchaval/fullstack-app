import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

// Use environment variable for backend base URL
const getBaseURL = () => {
  if (typeof window !== 'undefined' && window.__TEST__) {
    return 'http://localhost:5000';
  }
  return 'http://localhost:5000'; // Default for both test and development
};

const baseURL = getBaseURL();

function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    axios.get(`${baseURL}/users`).then((res) => setUsers(res.data));
  }, []);

  const addUser = async () => {
    // Post new user to backend and update the list
    await axios.post(`${baseURL}/users`, { name, email });
    setUsers([...users, { name, email }]);
    // clear inputs
    setName("");
    setEmail("");
  };

  return (
    <div className="container">
      <h1>Usuarios</h1>
      <div className="form">
        <div className="form-group">
          <label>Nombre</label>
          <input
            type="text"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button onClick={addUser}>Agregar</button>
      </div>
      <div className="users-list">
        <h2>Lista de Usuarios</h2>
        {users.length > 0 ? (
          <ul>
            {users.map((user, index) => (
              <li key={index}>
                <span className="user-name">{user.name}</span> -{' '}
                <span className="user-email">{user.email}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios.</p>
        )}
      </div>
    </div>
  );
}

export default App;
