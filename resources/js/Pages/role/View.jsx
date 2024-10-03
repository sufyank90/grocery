import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';



function View(props) {
    const { role, permissions,permissionsList } = props;





        const groupedPermissions = permissionsList.reduce((acc, permission) => {
            const [action, ...rest] = permission.split(' '); // Split into action and item
            const item = rest.join(' '); // Join the rest as the item name
            acc[item] = acc[item] || []; // Create an array for each item type if it doesn't exist
            acc[item].push({ action, permission }); // Push the action and permission into the respective item array
            return acc;
        }, {});





    // Initialize the state with the current permissions
    const [selectedPermissions, setSelectedPermissions] = useState(permissions);

    const handleCheckboxChange = (permission) => {
        setSelectedPermissions((prev) => {
            if (prev.includes(permission)) {
                return prev.filter((perm) => perm !== permission); // Uncheck
            } else {
                return [...prev, permission]; // Check
            }
        });
    };

    const handleSave = async () => {
        await router.put(route('role.updatePermission', role.id),selectedPermissions);
    };



    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role: {role.name}</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex justify-center py-6 bg-gray-100">
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-lg font-medium text-center">Manage Permissions</h3>


                        <div className="mt-4">
                           {/* select all checkbox */}
                            <label className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    checked={permissionsList.length === selectedPermissions.length}
                                    onChange={
                                        (e) => {
                                            if (e.target.checked) {
                                                setSelectedPermissions(permissionsList);
                                            } else {
                                                setSelectedPermissions([]);
                                            }
                                        }
                                    }
                                />
                                <span className="ml-2">Select All</span>
                            </label>
                        </div>


                        
                        <div className="mt-4">
                        <hr/>
                        {Object.entries(groupedPermissions).map(([item, actions]) => (
                            <>
                                <div key={item} className="my-4">
                                    <h4 className="font-semibold capitalize flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={actions.every(({ permission }) => selectedPermissions.includes(permission))}
                                        onChange={() => {
                                            const allPermissions = actions.map(({ permission }) => permission);
                                            const allSelected = allPermissions.every((perm) => selectedPermissions.includes(perm));
                                            setSelectedPermissions((prev) => 
                                                allSelected 
                                                ? prev.filter((perm) => !allPermissions.includes(perm)) 
                                                : [...prev, ...allPermissions]
                                            );
                                        }}
                                    />   
                                        {item}
                                    </h4>
                                    {actions.map(({ action, permission }) => (
                                        <label className="flex items-center mt-2" key={permission}>
                                            <input
                                                type="checkbox"
                                                checked={selectedPermissions.includes(permission)}
                                                onChange={() => handleCheckboxChange(permission)}
                                            />
                                            <span className="ml-2">{action} {item}</span>
                                        </label>
                                    ))}
                                </div>
                                <hr/>
                                </>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Save
                            </button>
                            <button
                                onClick={()=>router.get(route('role.index'))}
                                className="px-4 py-2 bg-gray-500 ml-2 text-white rounded hover:bg-gray-600"
                            >
                                Cancle
                            </button>
                        </div>

                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

export default View;
