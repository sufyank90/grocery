import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { FaEdit } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import Modal from '@/Components/Modal';
import { AiOutlineAppstoreAdd } from "react-icons/ai";
import * as Yup from 'yup';
import { toast } from 'react-toastify';


export default function Home(props) {
    const { attributes } = props;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAttribute, setSelectedAttribute] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItem, setDeleteItem] = useState(null);

    const openEditModal = (attribute) => {
        setSelectedAttribute(attribute);
        setIsModalOpen(true);
    };

    const openDeleteModal = (attributeId) => {
        setDeleteItem(attributeId);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (deleteItem) {
            router.delete(route('attribute.destroy', deleteItem), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                },
                onError: () => {
                    console.error("Error deleting attribute");
                }
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attribute</h2>}
        >
            <Head title="Attribute" />

            <div className="flex">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mt-6 mb-4">
                        <h3 className="text-lg font-bold">Attribute</h3>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => {
                                    setSelectedAttribute(null); // Clear selection for new attribute
                                    setIsModalOpen(true);
                                }}
                                style={{ background: '#fcb609' }}
                                className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
                            >
                                Create
                            </button>
                        </div>
                    </div>

                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b text-left">#</th>
                                <th className="py-2 px-4 border-b text-left">Name</th>
                                <th className="py-2 px-4 border-b text-left">Actions</th>
                            </tr>
                        </thead>

                        <tbody className='text-center'>
                            {attributes.map((attribute, index) => (
                                <tr key={attribute.id}>
                                    <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                                    <td className="py-2 px-4 border-b truncate text-left">{attribute.name}</td>
                                    <td className="py-2 px-4 border-b text-left">
                                        <div className="flex items-center ">
                                            <FaEdit
                                                onClick={() => openEditModal(attribute)}
                                                className="w-7 h-7 cursor-pointer"
                                                style={{ color: '#fcb609' }}
                                            />
                                            <span className="mx-1"></span>
                                            <MdDelete
                                                onClick={() => openDeleteModal(attribute.id)}
                                                className="w-7 h-7 cursor-pointer"
                                                style={{ color: '#fcb609' }}
                                            />
                                            <AiOutlineAppstoreAdd 
                                                onClick={() => router.get(route('attributevalue.show', attribute.id))}
                                                className="w-7 h-7 cursor-pointer"
                                                style={{ color: '#fcb609' }}
                                            />

                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit/Create Attribute Modal */}
            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
                <Formik
                    initialValues={{
                        name: selectedAttribute ? selectedAttribute.name : '',
                    }}
                    validationSchema={
                        Yup.object({
                            name: Yup.string().required('Name is required'),
                        })
                    }
                    
                    onSubmit={async(values)  => {
             
                        const action = selectedAttribute

                            ? route('attribute.update', selectedAttribute.id) 
                            : route('attribute.store');
                        
                        const method = selectedAttribute ? 'put' : 'post';

                     await   router[method](action, values, {
                            onSuccess: () => {
                               toast.success("Attribute saved successfully");
                            },
                            onError: () => {
                                toast.error("The attribute name has already been taken for this attribute.");
                            }
                        });
                    }}
                >
                    <Form className="p-6">
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
                                Name
                            </label>
                            <Field
                                id="name"
                                name="name"
                                type="text"
                                placeholder="Enter attribute name"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            />
                            <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 mt-2"
                            />
                        </div>
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                {selectedAttribute ? 'Update' : 'Create'}
                            </button>
                        </div>
                    </Form>
                </Formik>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                <div className="p-6 text-center">
                    <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this attribute?</h2>
                    <button onClick={handleDelete} className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700">
                        Delete
                    </button>
                    <button onClick={() => setIsDeleteModalOpen(false)} className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ml-2">
                        Cancel
                    </button>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
