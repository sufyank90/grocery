import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Home(props) {



    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Setting</h2>}
        >
            <Head title="Setting" />

            <div className="">
               

                {/* Main Content */}
                <div className="w-full pl-32 pr-32 mt-10">
                    <div className="py-4">
                        <div className="">
                          
                          <Link href={route('banner.index')} >
                        <div class="p-5 mt-10 overflow-x-auto    shadow-md rounded-lg bg-white border border-gray-200 rounded-lg shadow     ">
                            <h1 >Banner</h1>
                        </div>
                        </Link>
                        </div>
                    </div>
                    

                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
