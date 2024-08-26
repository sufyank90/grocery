import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Home(props) {



    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting</h2>}
        >
            <Head title="Setting" />

            <div className="flex">
               

                {/* Main Content */}
                <div className="w-full pl-32 pr-32 mt-10">
                    <div className="py-4">
                        <div className="flex space-x-4">
                          
                       
                        </div>
                    </div>
                    

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
