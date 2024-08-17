import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';

export default function Product(props) {
    const { products, categories } = props;

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
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Products List</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex">
                    <div className="w-full pl-32 pr-32 mt-10">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Products</h3>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
                                >
                                    Create
                                </button>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="py-2 px-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
                                    Search
                                </button>
                            </div>
                        </div>

                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b text-left">#</th>
                                    <th className="py-2 px-4 border-b text-left">Name</th>
                                    <th className="py-2 px-4 border-b text-left">Description</th>
                                    <th className="py-2 px-4 border-b text-left">Price</th>
                                    <th className="py-2 px-4 border-b text-left">Status</th>
                                    <th className="py-2 px-4 border-b text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {products.data.map((product) => (
                                    <tr key={product.id}>
                                        <td className="py-2 px-4 border-b text-left">{product.id}</td>
                                        <td className="py-2 px-4 border-b text-left">{product.name}</td>
                                        <td className="py-2 px-4 border-b text-left">{product.description}</td>
                                        <td className="py-2 px-4 border-b text-left">${parseFloat(product.price).toFixed(2)}</td>
                                        <td className="py-2 px-4 border-b text-left">{product.status}</td>
                                        <td className="py-2 px-4 border-b text-left">
                                            <div className="flex justify-center space-x-2">
                                                <button
                                                    onClick={() => openEditModal(product)}
                                                    className="text-white py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedProduct(product);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    className="text-white py-2 px-4 rounded-lg bg-red-500 hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        {/* Pagination */}
                        <div className="flex justify-end mt-4 space-x-1">
                            {products.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url}
                                    className={`px-3 py-1 border ${link.active ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Create Product Modal */}
                <Modal
                    show={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            price: '',
                            status: 'instock',
                            categories: [],
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                            categories: Yup.array().min(1, 'At least one category is required').required('Required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            console.log(values);
                            router.post(route('product.store'), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                            });
                        }}
                    >
                         {({ values, setFieldValue }) => (
                        <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Create Product</h2>
                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="name"
                                    type="text"
                                    id="name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="name"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Name
                                </label>
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="description"
                                    as="textarea"
                                    id="description"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="description"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Description
                                </label>
                                <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="price"
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="price"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Price
                                </label>
                                <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    as="select"
                                    name="status"
                                    id="status"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="instock">In Stock</option>
                                    <option value="outofstock">Out of Stock</option>
                                    <option value="active">Active</option>
                                </Field>
                                <label
                                    htmlFor="status"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Status
                                </label>
                                <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                               <InputLabel className="" value={"Select Category"}/>
                                {categories.map((category) => (
                                   <div key={category.id} className="flex items-center">
                                   <label className="flex items-center">
                                     <Field
                                       type="checkbox"
                                       name="categories"
                                       value={category.id}
                                       checked={values.categories.includes(category.id)}
                                       onChange={(e) => {
                                         const { checked } = e.target;
                                         if (checked) {
                                           setFieldValue("categories", [...values.categories, category.id]);
                                         } else {
                                           setFieldValue("categories", values.categories.filter((id) => id !== category.id));
                                         }
                                       }}
                                       className="mr-2"
                                     />
                                     {category.name}
                                   </label>
                                
                                 </div>
                                ))}
                                   <ErrorMessage name="categories" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
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
                         )}
                    </Formik>
                </Modal>


                {/* Edit Product Modal */}
                <Modal
                    show={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    maxWidth="2xl"
                >
                    <Formik
                        initialValues={{
                            name: selectedProduct ? selectedProduct.name : '',
                            description: selectedProduct ? selectedProduct.description : '',
                            price: selectedProduct ? selectedProduct.price : '',
                            status: selectedProduct ? selectedProduct.status : 'instock',
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                        })}
                        onSubmit={(values, { resetForm }) => {
                            router.put(route('product.update', selectedProduct.id), values, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsEditModalOpen(false);
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Edit Product</h2>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="name"
                                    type="text"
                                    id="edit_name"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_name"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Name
                                </label>
                                <ErrorMessage name="name" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="description"
                                    as="textarea"
                                    id="edit_description"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_description"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Description
                                </label>
                                <ErrorMessage name="description" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    name="price"
                                    type="number"
                                    id="edit_price"
                                    step="0.01"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                    placeholder=" "
                                />
                                <label
                                    htmlFor="edit_price"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Price
                                </label>
                                <ErrorMessage name="price" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="relative z-0 w-full mb-5 group">
                                <Field
                                    as="select"
                                    name="status"
                                    id="edit_status"
                                    className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                >
                                    <option value="instock">In Stock</option>
                                    <option value="outofstock">Out of Stock</option>
                                    <option value="active">Active</option>
                                </Field>
                                <label
                                    htmlFor="edit_status"
                                    className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                >
                                    Status
                                </label>
                                <ErrorMessage name="status" component="div" className="text-red-600 text-sm mt-1" />
                            </div>

                            <div className="flex justify-end space-x-2 mt-4">
                                <button
                                    type="submit"
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                >
                                    Update
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
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
                            router.delete(route('product.destroy', selectedProduct.id), {
                                onSuccess: () => {
                                    resetForm();
                                    setIsDeleteModalOpen(false);
                                },
                            });
                        }}
                    >
                        <Form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto flex flex-col items-center">
                            <h2 className="text-lg font-bold mb-4">Confirm Deletion</h2>
                            <p className="mb-4 text-gray-700">Are you sure you want to delete this product?</p>
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
    );
}
