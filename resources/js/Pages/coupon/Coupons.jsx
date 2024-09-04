import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function Coupons(props) {
    const { coupons } = props;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const openEditModal = (product) => {
        setSelectedProduct(product);
        setIsEditModalOpen(true);
    };
    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Coupons List</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex">
                    <div className="w-full pl-32 pr-32 mt-10">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Coupons</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    style={{ background: '#fcb609' }}
                                    className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
                                >
                                    Create
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    style={{ background: '#fcb609' }}
                                    className="text-black py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Search
                                </button>
                            </div>
                        </div>

                        <table className="min-w-full bg-white rounded-lg shadow-lg">
                            <thead>
                                <tr>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">#</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Code</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Type</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Value</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Usage Type</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Usage Limit</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Expiry Date</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-right font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {coupons.data.length === 0 ? (
                                    <tr>
                                        <td
                                            className="py-2 px-4 border-b border-gray-200 text-center text-gray-700"
                                            colSpan="8"
                                        >
                                            No coupons found
                                        </td>
                                    </tr>
                                ) :
                                    (
                                        <>
                                            {coupons.data.map((product, index) => (
                                                <tr key={product.id} className="hover:bg-gray-100">
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{index + 1}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.code}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.type}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.value}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.usage_type}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.usage_limit}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.expiry_date}</td>
                                                    <td className="py-2 px-4 border-b border-gray-200 text-right">
                                                        <div className="text-right space-x-2">
                                                            <button
                                                                onClick={() => openEditModal(product)}

                                                            >
                                                                <FaEdit
                                                                    className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedProduct(product);
                                                                    setIsDeleteModalOpen(true);
                                                                }}

                                                            >
                                                                <MdDelete

                                                                    className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )
                                }


                            </tbody>
                        </table>



                        {/* Pagination */}
                        <div className="flex justify-end mt-4 space-x-1">
                            {coupons.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-1 border ${link.active ? 'bg-yellow-500 text-white' : 'bg-gray-200 hover:bg-yellow-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Create Coupon Modal */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            code: '',
                            type: '',
                            value: '',
                            usage_type: '',
                            usage_limit: '',
                            expiry_date: '',
                        }}
                        validationSchema={Yup.object({
                            code: Yup.string().required('Code is required'),
                            type: Yup.string().required('Type is required'),
                            value: Yup.number().required('Value is required'),
                            usage_type: Yup.string().required('Usage Type is required'),
                            usage_limit: Yup.number().required('Usage Limit is required'),
                            expiry_date: Yup.date().required('Expiry Date is required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.post(route('coupon.store'), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col">
                            <h2 className="text-xl font-bold mb-4 text-center">Create Coupon</h2>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    name="code"
                                    type="text"
                                    placeholder=" "
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                <label
                                    htmlFor="code"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                                >
                                    Code
                                </label>
                                <ErrorMessage name="code" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    as="select"
                                    name="type"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="">Select Type</option>
                                    <option value="fixed">Fixed</option>
                                    <option value="percentage">Percentage</option>
                                </Field>
                                <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    name="value"
                                    type="number"
                                    placeholder=" "
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                <label
                                    htmlFor="value"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                                >
                                    Value
                                </label>
                                <ErrorMessage name="value" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    as="select"
                                    name="usage_type"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="">Select Usage Type</option>
                                    <option value="single">Single Use</option>
                                    <option value="multiple">Multiple Use</option>
                                </Field>
                                <ErrorMessage name="usage_type" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    name="usage_limit"
                                    type="number"
                                    placeholder=" "
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                <label
                                    htmlFor="usage_limit"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                                >
                                    Usage Limit
                                </label>
                                <ErrorMessage name="usage_limit" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5">
                                <Field
                                    name="expiry_date"
                                    type="date"
                                    placeholder=" "
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                <label
                                    htmlFor="expiry_date"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                                >
                                    Expiry Date
                                </label>
                                <ErrorMessage name="expiry_date" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="submit"
                                    className="text-white bg-yellow-500 hover:bg-yellow-600 rounded-lg text-sm px-5 py-2.5"
                                >
                                    Submit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Close
                                </button>
                            </div>
                        </Form>

                    </Formik>
                </Modal>





                {/* Edit Coupon Modal */}
                <Modal
                    show={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            code: selectedProduct ? selectedProduct.code : '',
                            type: selectedProduct ? selectedProduct.type : '',
                            value: selectedProduct ? selectedProduct.value : '',
                            usage_type: selectedProduct ? selectedProduct.usage_type : '',
                            usage_limit: selectedProduct ? selectedProduct.usage_limit : '',
                            expiry_date: selectedProduct ? selectedProduct.expiry_date : '',
                        }}
                        validationSchema={Yup.object({
                            code: Yup.string().required('Code is required'),
                            type: Yup.string().required('Type is required'),
                            value: Yup.number().required('Value is required'),
                            usage_type: Yup.string().required('Usage Type is required'),
                            usage_limit: Yup.number().required('Usage Limit is required'),
                            expiry_date: Yup.date().required('Expiry Date is required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.put(route('coupon.update', selectedProduct.id), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsEditModalOpen(false);
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg max-w-3xl mx-auto flex flex-col space-y-4">
                            <h2 className="text-xl font-bold text-center text-gray-800">Edit Coupon</h2>

                            {/* Coupon Code Field */}
                            <div className="relative z-0 w-full">
                                <Field
                                    name="code"
                                    type="text"
                                    placeholder=" "
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                />
                                <label
                                    htmlFor="code"
                                    className="absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-focus:text-blue-600"
                                >
                                    Code
                                </label>
                                <ErrorMessage name="code" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Coupon Type Field */}
                            <div>
                                <Field
                                    as="select"
                                    name="type"
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Type</option>
                                    <option value="fixed">Fixed</option>
                                    <option value="percentage">Percentage</option>
                                </Field>
                                <ErrorMessage name="type" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Value Field */}
                            <div>
                                <Field
                                    name="value"
                                    type="number"
                                    placeholder="Value"
                                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <ErrorMessage name="value" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Usage Type Field */}
                            <div>
                                <Field
                                    as="select"
                                    name="usage_type"
                                    className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                >
                                    <option value="">Select Usage Type</option>
                                    <option value="single">Single Use</option>
                                    <option value="multiple">Multiple Use</option>
                                </Field>
                                <ErrorMessage name="usage_type" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Usage Limit Field */}
                            <div>
                                <Field
                                    name="usage_limit"
                                    type="number"
                                    placeholder="Usage Limit"
                                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <ErrorMessage name="usage_limit" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Expiry Date Field */}
                            <div>
                                <Field
                                    name="expiry_date"
                                    type="date"
                                    placeholder="Expiry Date"
                                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                <ErrorMessage name="expiry_date" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end space-x-2 mt-6">
                                <button
                                    type="submit"
                                    className="text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none focus:ring-4 focus:ring-gray-300"
                                >
                                    Close
                                </button>
                            </div>
                        </Form>

                    </Formik>
                </Modal>




                {/* Delete Confirmation Modal */}
                <Modal
                    show={isDeleteModalOpen}
                    onClose={() => setIsDeleteModalOpen(false)}
                    maxWidth="sm"
                >
                    <Formik
                        initialValues={{ confirmation: '' }}
                        validationSchema={Yup.object({
                            confirmation: Yup.string().required('Type "DELETE" to confirm').oneOf(['DELETE'], 'Type "DELETE" to confirm'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.delete(route('coupon.destroy', selectedProduct.id), {
                                onSuccess: () => {
                                    resetForm();
                                    setIsDeleteModalOpen(false);
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this Coupon ?</p>
                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="confirmation"
                                    type="text"
                                    id="delete_confirmation"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-red-600 peer"
                                    placeholder="Type DELETE to confirm"
                                />
                                <ErrorMessage name="confirmation" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Delete
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </Form>
                    </Formik>
                </Modal>

            </AuthenticatedLayout>
        </>
    )
}

export default Coupons
