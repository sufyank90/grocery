import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index( props ) {
    const { settings, rows } = props;
    console.log(settings);
    console.log(rows);
    const { data, setData, post, errors, progress } = useForm(settings);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('settings.update'), {
            onSuccess: () => {
                setSuccessMessage('Settings updated successfully!');
            },
        });
    };

    

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Site Setting</h2>}
        >
            <Head title="Setting" />

            <div className="pl-32 pr-32 mt-10"> {/* Reduced padding on the main container */}

                <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-semibold mb-6">Site Settings</h1>

                    <form onSubmit={handleSubmit}>
                        {rows.length > 0 && rows.map((setting) => (
                            <div className="mb-4">
                                <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700">
                                    {setting.name}
                                </label>
                                <input
                                    id={setting.key}
                                    type="text"
                                    value={data[setting.key]}
                                    onChange={(e) => setData(setting.key, e.target.value)}
                                    className={`mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 `}
                                />
                                {errors[setting.key] && <p className="text-red-500 text-sm mt-1">{errors[setting.key]}</p>}
                            </div>
                        ))}
                        
                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Save Settings
                            </button>
                        </div>
                    </form>
                    {successMessage && <p className="text-green-500 mt-4">{successMessage}</p>}
                </div>

                
            </div>
        </AuthenticatedLayout>
    );
}
