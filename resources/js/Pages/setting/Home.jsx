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

            <div className="pl-32 pr-32 "> {/* Reduced padding on the main container */}

                {/* Main Content */}
                <div className="space-y-4 m-4"> {/* Using space-y to manage vertical spacing */}
                    <Link href={route('banner.index')}>
                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h1 className="text-lg font-semibold">Banner</h1>
                        </div>
                    </Link>
                    {props.auth.superadmin &&  (
                        <>
                        <Link href={route('admin.index')}>
                        <div className="p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h1 className="text-lg font-semibold">User Management</h1>
                        </div>
                    </Link>
                        <Link href={route('attribute.index')}>
                        <div className="p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h1 className="text-lg font-semibold">Attribute</h1>
                        </div>
                    </Link>
                    <Link href={route('role.index')}>
                        <div className="p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h1 className="text-lg font-semibold">Role</h1>
                        </div>
                    </Link>
                    <Link href={route('settings.update')}>
                        <div className="p-4 mt-4 bg-white border border-gray-200 rounded-lg shadow-md">
                            <h1 className="text-lg font-semibold">Reward</h1>
                        </div>
                    </Link>
                    </>
                    )}
                    
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
