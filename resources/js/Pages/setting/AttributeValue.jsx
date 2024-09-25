import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import React, { useState } from 'react';
import * as Yup from 'yup';

export default function AttributeValue(props) {
    const { attributevalues, id } = props;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [formError, setFormError] = useState(null); // State for form errors

    const openDeleteModal = (id) => {
        setDeleteItemId(id);
        setIsDeleteModalOpen(true);
    };

    const handleDelete = () => {
        if (deleteItemId) {
            router.delete(route('attributevalue.destroy', deleteItemId), {
                onSuccess: () => {
                    setIsDeleteModalOpen(false);
                    toast.error("Attribute value deleted successfully");
                },
                onError: () => {
                    console.error("Error deleting attribute value");
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">AttributeValue</h2>}
        >
            <Head title="AttributeValue" />

            <div className="pl-32 pr-32 mt-10 ">
                <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-semibold mb-6">Attribute Value</h1>

                    <Formik
                        initialValues={{ value: '', attribute_id: id }}
                        validationSchema={Yup.object({
                            value: Yup.string().required('Attribute value is required'),
                        })}
                        onSubmit={(values, { setSubmitting }) => {
                            setFormError(null); // Reset form error on new submission
                            router.post(route('attributevalue.store'), values, {
                                onSuccess: () => {
                                    toast.success("Attribute value created successfully");
                                },
                                onError: (errors) => {
                                        toast.error("The attribute value name has already been taken for this attribute.");  
                                },
                                onFinally: () => setSubmitting(false), // Stop submitting state
                            });
                        }}
                    >
                        <Form>
                            <div className="mb-4">
                                <label htmlFor="value" className="block text-gray-700 font-bold mb-2">
                                    Attribute Value Name
                                </label>
                                <Field
                                    id="value"
                                    name="value"
                                    type="text"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Enter attribute value"
                                />
                                <ErrorMessage
                                    name="value"
                                    component="div"
                                    className="text-red-500 mt-2"
                                />
                                {formError && <div className="text-red-500 mt-2">{formError}</div>} {/* Display custom error */}
                            </div>
                            <div className="flex justify-start mb-4">
                                <button
                                    type="submit"
                                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                >
                                    Create
                                </button>
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
                                    {attributevalues.map((attribute, index) => (
                                        <tr key={attribute.id}>
                                            <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                                            <td className="py-2 px-4 border-b truncate text-left">{attribute.value}</td>
                                            <td className="py-2 px-4 border-b text-left">
                                                <div className="flex items-center">
                                                    <span className="mx-1"></span>
                                                    <MdDelete
                                                        onClick={() => openDeleteModal(attribute.id)}
                                                        className="w-7 h-7 cursor-pointer"
                                                        style={{ color: '#fcb609' }}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Form>
                    </Formik>

                    {/* Delete Confirmation Modal */}
                    <Modal show={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} maxWidth="sm">
                        <div className="p-6 text-center">
                            <h2 className="text-lg font-bold mb-4">Are you sure you want to delete this attribute value?</h2>
                            <button 
                                onClick={handleDelete}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
                            >
                                Delete
                            </button>
                            <button 
                                onClick={() => setIsDeleteModalOpen(false)} 
                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 ml-2"
                            >
                                Cancel
                            </button>
                        </div>
                    </Modal>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
