import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function Category(props) {
    const { categorys } = props;
    console.log(categorys)
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
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Category List</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className="flex">
                    <div className="w-full pl-32 pr-32 mt-10">
                        <div className="flex justify-between items-center mt-6 mb-4">
                            <h3 className="text-lg font-bold">Categories</h3>
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
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Name</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-left font-semibold text-gray-700">Image</th>
                                    <th className="py-3 px-4 border-b-2 border-gray-200 text-right font-semibold text-gray-700">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categorys.data.length === 0 ? (

                                    <tr>
                                        <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">No products found</td>
                                    </tr>
                                ) : (
                                    <>
                                        {categorys.data.map((product, index) => (
                                            <tr key={product.id} className="hover:bg-gray-100">
                                                <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{index + 1}</td>
                                                <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">{product.name}</td>
                                                <td className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">
                                                    {product.media && product.media.length > 0 && product.media[0].original_url ? (
                                                        <img src={product.media[0].original_url} height={100} width={100} className='rounded-lg' />
                                                    ) : (
                                                        <p>No image</p>
                                                    )}
                                                </td>
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
                        <div className="flex justify-end mt-4 space-x-1 mb-8">
                            {categorys.links.map((link, index) => (
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
                            name: '', file: null,

                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            file: Yup.mixed()
                                .required('File is required')
                                .test(
                                    'fileFormat',
                                    'Unsupported file format',
                                    (value) => {
                                        console.log(value)
                                        if (!value) return true; // If no file uploaded, skip validation
                                        return ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(value.type);
                                    }
                                )

                        })}
                        onSubmit={async (values, { setSubmitting, resetForm, isSubmitting }) => {

                            const formData = new FormData();
                            formData.append('file', values.file);
                            formData.append('name', values.name);

                            await router.post(route('category.store'), formData, {
                                preserveScroll: true,
                                preserveState: true,
                                onSuccess: () => {
                                    resetForm();
                                    setIsModalOpen(false);
                                },
                            });
                        }}
                    >

                        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
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


                                <div class="flex items-center justify-center w-full">
                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50     hover:bg-gray-100      ">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            {!values.file ? (<>
                                                <svg class="w-8 h-8 mb-4 text-gray-500  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p class="mb-2 text-sm text-gray-500  "><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p class="text-xs text-gray-500  ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </>) : (
                                                <>
                                                    <div className="relative">
                                                        <img height={100} width={100} className='rounded-lg' src={URL.createObjectURL(values.file)} alt="Preview" />
                                                        <IoMdCloseCircleOutline size={30} onClick={() => setFieldValue("file", null)} className="absolute top-[-20px] right-[-20px] m-2 p-1 bg-white rounded-full cursor-pointer" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input onChange={(event) => {
                                            // validate the file type
                                            const fileType = event.target.files[0].type;
                                            const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
                                            if (!allowedTypes.includes(fileType)) {
                                                toast.error('Unsupported file type. Only SVG, PNG, JPG, JPEG, GIF are allowed.');
                                                return;
                                            }
                                            setFieldValue("file", event.currentTarget.files[0])
                                        }} id="dropzone-file" type="file" class="hidden" />
                                    </label>
                                </div>
                                <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />





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
                            file: selectedProduct && selectedProduct.media && selectedProduct.media[0] && selectedProduct.media[0].original_url
                                ? selectedProduct.media[0].original_url
                                : null,

                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            file: selectedProduct && selectedProduct.media && selectedProduct.media[0] && selectedProduct.media[0].original_url
                                ? null : Yup.mixed()
                                    .required('File is required')
                                    .test(
                                        'fileFormat',
                                        'Unsupported file format',
                                        (value) => {
                                            console.log(value)
                                            if (!value) return true; // If no file uploaded, skip validation
                                            return ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'].includes(value.type);
                                        }
                                    )

                        })}
                        onSubmit={(values, { resetForm }) => {

                            const formData = new FormData();

                            formData.append('name', values.name);
                            if (values.file && values.file !== selectedProduct.media[0]?.original_url) {
                                formData.append('file', values.file);
                            }

                            router.post(route('category.updatewithfile', selectedProduct.id), formData, {
                                onSuccess: () => {
                                    resetForm();
                                    setIsEditModalOpen(false);
                                },
                            });
                        }}

                    >
                        {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                            <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                <h2 className="text-lg font-bold mb-4">Edit Product </h2>

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


                                <div class="flex items-center justify-center w-full">
                                    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50     hover:bg-gray-100      ">
                                        <div class="flex flex-col items-center justify-center pt-5 pb-6">
                                            {!values.file ? (<>
                                                <svg class="w-8 h-8 mb-4 text-gray-500  " aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                </svg>
                                                <p class="mb-2 text-sm text-gray-500  "><span class="font-semibold">Click to upload</span> or drag and drop</p>
                                                <p class="text-xs text-gray-500  ">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                            </>) : (
                                                <>
                                                    <div className="relative">
                                                        <img height={100} width={100} className='rounded-lg' src={typeof values.file === 'string' ? values.file : URL.createObjectURL(values.file)} alt="Preview" />
                                                        <IoMdCloseCircleOutline size={30} onClick={() => setFieldValue("file", null)} className="absolute top-[-20px] right-[-20px] m-2 p-1 bg-white rounded-full cursor-pointer" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input onChange={(event) => {
                                            // validate the file type
                                            const fileType = event.target.files[0].type;
                                            const allowedTypes = ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif'];
                                            if (!allowedTypes.includes(fileType)) {
                                                toast.error('Unsupported file type. Only SVG, PNG, JPG, JPEG, GIF are allowed.');
                                                return;
                                            }
                                            setFieldValue("file", event.currentTarget.files[0])
                                        }} id="dropzone-file" type="file" class="hidden" />
                                    </label>
                                </div>
                                <ErrorMessage name="file" component="div" className="text-red-500 text-sm" />





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
                        )}
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
                            router.delete(route('category.destroy', selectedProduct.id), {
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
    )
}

export default Category
