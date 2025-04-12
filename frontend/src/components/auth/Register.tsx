import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import axiosInstance from '../../api/axiosInstance';

interface RegisterProps {
    onRegisterSuccess: (token: string) => void; // Callback after successful registration
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.post('/auth/register', {
                firstname,
                lastname,
                email,
                password,
            });

            if (response.data && response.data.token) {
                onRegisterSuccess(response.data.token); // Pass token to parent
            } else {
                setError('Registration failed: Invalid response from server.');
            }
        } catch (err: any) {
            console.error("Registration error:", err);
             if (err.response && err.response.status === 400) { // Example: Handle duplicate email
                setError('Registration failed: Email might already be in use.');
            } else {
                setError('Registration failed. Please try again later.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-fluid flex justify-content-center">
            <div className="card w-full md:w-6">
                <h2 className="text-center">Register</h2>
                <form onSubmit={handleRegister}>
                    <div className="field">
                        <label htmlFor="firstname">First Name</label>
                        <InputText
                            id="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                     <div className="field">
                        <label htmlFor="lastname">Last Name</label>
                        <InputText
                            id="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
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
                            feedback={false} // You might want to enable feedback for registration
                            required
                        />
                    </div>
                     {error && (
                        <div className="mb-3">
                            <Message severity="error" text={error} />
                        </div>
                    )}
                    <div className="text-center">
                        <Button label="Register" type="submit" icon="pi pi-user-plus" loading={loading} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
