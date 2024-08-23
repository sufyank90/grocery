import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function AdminPanel(props) {
    const {countuser,countpendingorder,countcompletedorder} = props;


    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Admin Dashboard" />

            <div className="flex">
               

                {/* Main Content */}
                <div className="w-full pl-32 pr-32 mt-10">
                    <div className="py-4">
                        <div className="flex space-x-4">
                            {/* Cards */}
                            <div className="w-1/3 bg-white border   text-black p-4 rounded-lg shadow  border-[#fcb609]">
                                <h3 className="text-lg font-bold">Total Customers</h3>
                                <p className="mt-2 text-xl">{countuser}</p>
                            </div>
                            <div className="w-1/3 bg-white border   text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Pending Orders</h3>
                                <p className="mt-2 text-xl">{countpendingorder}</p>
                            </div>
                            <div className="w-1/3 bg-white border  text-black p-4 rounded-lg shadow border-[#fcb609]">
                                <h3 className="text-lg font-bold">Completed Orders</h3>
                                <p className="mt-2 text-xl">{countcompletedorder}</p>
                            </div>
                        </div>
                    </div>
                    

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
