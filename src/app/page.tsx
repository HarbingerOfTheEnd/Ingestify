'use client';

import axios from 'axios';
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
    type ReactNode,
} from 'react';
import toast from 'react-hot-toast';

type EmailConfig = {
    id?: string;
    emailAddress: string;
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    accessToken?: string;
};

export default function EmailConfigPage(): ReactNode {
    const [configs, setConfigs] = useState<EmailConfig[]>([]);
    const [formData, setFormData] = useState<EmailConfig>({
        emailAddress: '',
        host: '',
        port: 993,
        username: '',
        password: '',
    });

    useEffect(() => {
        (async () => {
            try {
                const response = await axios.get('/api/email-ingestion/config');
                setConfigs(response.data);
            } catch (error) {
                toast.error('Failed to load email configurations.');
            }
        })();
    }, []);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ): void => {
        if (e.target.name === 'port') {
            setFormData((prev) => ({
                ...prev,
                [e.target.name]: (e as ChangeEvent<HTMLInputElement>).target
                    .valueAsNumber,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [e.target.name]: e.target.value,
            }));
        }
    };

    const checkInbox = async (): Promise<void> => {
        try {
            await axios.get('/api/email-ingestion/fetch');
            toast.success('Inbox checked for new PDFs.');
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const handleSubmit = async (e: FormEvent): Promise<void> => {
        e.preventDefault();
        const method = formData.id ? 'PUT' : 'POST';
        try {
            await axios({
                method,
                url: '/api/email-ingestion/config',
                data: formData,
                headers: { 'Content-Type': 'application/json' },
            });
        } catch (error) {
            toast.error((error as Error).message);
            return;
        }

        try {
            const response = await axios.get('/api/email-ingestion/config');
            setConfigs(response.data);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/email-ingestion/config/${id}`);
            setConfigs(configs.filter((config) => config.id !== id));
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">
                Manage Email Configurations
            </h1>

            <form onSubmit={handleSubmit} className="mb-6 space-y-3">
                <input
                    name="emailAddress"
                    placeholder="Email Address"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />

                <input
                    name="host"
                    placeholder="Host"
                    value={formData.host}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="port"
                    type="number"
                    placeholder="Port"
                    value={formData.port}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="border p-2 w-full"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    {formData.id ? 'Update' : 'Add'} Email Config
                </button>
            </form>

            <h2 className="text-xl font-bold mb-2">Configured Emails</h2>
            {!configs ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {configs.map((config) => (
                        <li
                            key={config.id}
                            className="border p-2 mb-2 flex justify-between"
                        >
                            <span>{config.emailAddress} (IMAP)</span>
                            <button
                                type="button"
                                onClick={() => handleDelete(config.id ?? '')}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <button
                type="button"
                onClick={checkInbox}
                className="bg-green-500 text-white px-4 py-2 rounded cursor-pointer"
            >
                Check Inbox
            </button>
        </div>
    );
}
