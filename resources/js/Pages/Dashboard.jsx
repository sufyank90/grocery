import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminPanel(props) {
    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="flex">
               

                {/* Main Content */}
                <div className="w-full pl-32 pr-32 mt-10">
                    <div className="py-4">
                        <div className="flex space-x-4">
                            {/* Cards */}
                            <div className="w-1/3 bg-blue-500 text-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Total Customers</h3>
                                <p className="mt-2 text-xl">120</p>
                            </div>
                            <div className="w-1/3 bg-green-500 text-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Active Customers</h3>
                                <p className="mt-2 text-xl">85</p>
                            </div>
                            <div className="w-1/3 bg-red-500 text-white p-4 rounded-lg shadow">
                                <h3 className="text-lg font-bold">Pending Requests</h3>
                                <p className="mt-2 text-xl">15</p>
                            </div>
                        </div>
                    </div>
                    

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
