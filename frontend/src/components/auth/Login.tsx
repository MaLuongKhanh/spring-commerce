import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import axiosInstance from '../../api/axiosInstance';

interface LoginProps {
    onLoginSuccess: (token: string) => void; // Callback after successful login
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/authenticate', {
                email: email,
                password: password,
            });

            if (response.data && response.data.token) {
                onLoginSuccess(response.data.token); // Pass token to parent
            } else {
                setError('Login failed: Invalid response from server.');
            }
        } catch (err: any) {
            console.error("Login error:", err);
            if (err.response && err.response.status === 403) {
                setError('Login failed: Invalid email or password.');
            } else {
                setError('Login failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-fluid flex justify-content-center">
            <div className="card w-full md:w-6">
                <h2 className="text-center">Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="field">
                        <label htmlFor="password">Password</label>
                        <Password
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            feedback={false} // Disable password strength indicator
                            required
                        />
                    </div>
                    {error && (
                        <div className="mb-3">
                            <Message severity="error" text={error} />
                        </div>
                    )}
                    <div className="text-center">
                        <Button label="Login" type="submit" icon="pi pi-sign-in" loading={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
