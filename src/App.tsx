import React, { useState } from "react";
import DOMPurify from "dompurify"; // Para sanitizar los mensajes
import bcrypt from "bcryptjs"; // Para encriptar las contraseñas
import "./App.css";

interface User {
  username: string;
  passwordHash: string;
  loginAttempts: number;
  blockedUntil: number | null;
}

const App = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [form, setForm] = useState({ username: "", password: "" });
  const [comment, setComment] = useState("");

  const MAX_ATTEMPTS = 5;
  const BLOCK_TIME = 5 * 60 * 1000; // 5 minutos

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumber &&
      hasSpecialChar
    );
  };

  const handleRegister = async () => {
    if (users.find((u) => u.username === form.username)) {
      alert("El usuario ya existe");
      return;
    }

    if (!validatePassword(form.password)) {
      alert("La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula, un número y un carácter especial.");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(form.password, salt);

    setUsers([...users, { username: form.username, passwordHash, loginAttempts: 0, blockedUntil: null }]);
    alert("Usuario registrado");
  };

  const handleLogin = async () => {
    const userIndex = users.findIndex((u) => u.username === form.username);
    if (userIndex === -1) {
      alert("Usuario no encontrado");
      return;
    }

    const user = users[userIndex];
    const now = Date.now();

    if (user.blockedUntil && user.blockedUntil > now) {
      alert("Cuenta bloqueada. Intenta más tarde.");
      return;
    }

    const isMatch = await bcrypt.compare(form.password, user.passwordHash);
    if (isMatch) {
      setCurrentUser(user);
      alert("Login exitoso");
      users[userIndex].loginAttempts = 0;
      setUsers([...users]);
    } else {
      users[userIndex].loginAttempts += 1;
      if (users[userIndex].loginAttempts >= MAX_ATTEMPTS) {
        users[userIndex].blockedUntil = now + BLOCK_TIME;
        alert("Cuenta bloqueada por múltiples intentos fallidos.");
      } else {
        alert("Credenciales inválidas");
      }
      setUsers([...users]);
    }
  };

  const handleMessage = () => {
    const sanitizedComment = DOMPurify.sanitize(comment);
    if(comment === "" && !comment.trim()) {alert("No puedes enviar un mensaje vacío");}else {
      setMessages([...messages, sanitizedComment]);
    }
    
  };

  return (
    <div className="container">
      <h2>Login / Registro</h2>
      <div className="form-container">
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <div className="button-group">
          <button onClick={handleRegister} className="btn">Registrarse</button>
          <button onClick={handleLogin} className="btn">Iniciar Sesión</button>
        </div>
      </div>

      {currentUser && (
        <div className="comment-section">
          <h2>Área de comentarios</h2>
          <textarea
            placeholder="Escribe un mensaje"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button onClick={handleMessage} className="btn">Enviar</button>
          <div className="message-list">
            {messages.map((msg, index) => (
              <p key={index} className="message">{msg}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;