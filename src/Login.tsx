import React, { useState } from 'react';
import './Login.css';
import { Errors } from "./errorEnums";
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch(`https://localhost:44372/api/Home/Login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const userId = await response.json();
                navigate('/sets', { state: { userId: userId } });
            } else {
                setError("Problem while logging in")
            }
        } catch (error) {
            setError(Errors.NETWORK);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>

                <div className="signup-container">
                    <a href="/signup" className="signup">Sign up</a>
                </div>

                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default Login;
