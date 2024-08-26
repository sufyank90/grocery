import Modal from '@/Components/Modal';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ErrorMessage, Form, Formik, Field } from 'formik';
import { FaDownload } from 'react-icons/fa';
import { IoCloseOutline } from 'react-icons/io5';
import { MdDeleteForever } from 'react-icons/md';
import * as Yup from 'yup';
import { useState } from 'react';

export default function Posters(props) {

    const {poster} = props;

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Banners</h2>}
        >
            <Head title="Banners" />

            <div className="flex">


                {/* Main Content */}
                <div className="w-full pl-32 pr-32 mt-10">
                    <div className="py-4">
                        <div className="">




                            <div class="p-5 mt-10 overflow-x-auto    shadow-md rounded-lg bg-white border border-gray-200 rounded-lg shadow     ">
                                <Formik
                                    initialValues={{
                                        file: null,
                                    }}
                                    validationSchema={
                                        Yup.object({
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
                                        })
                                    }
                                    onSubmit={async (values, { setSubmitting, resetForm, isSubmitting }) => {
                                        try {
                                            setSubmitting(true);
                                            const formData = new FormData();
                                            formData.append('file', values.file);
                                           
                                            await router.post(route('banner.store'), formData, {
                                                preserveScroll: true,
                                                preserveState: true,
                                            }
                                            );
                                        } catch (error) {
                                            // Handle errors if necessary
                                            // toast.error(error.message);
                                            console.error(error);
                                        } finally {
                                            // Make sure to setSubmitting(false) after processing is done
                                            setSubmitting(false);
                                            resetForm();
                                        }
                                    }}
                                >
                                    {({ isSubmitting, handleSubmit, setFieldValue, values }) => (
                                        <Form>
                                            <div class="flex items-center justify-between mb-2">
                                                <h5 class="text-xl font-bold leading-none text-gray-500  ">Upload</h5>
                                                {values.file && (
                                                    <button type="submit" className='bg-[#f3d08140] text-[#D2A43C] px-4 py-2 rounded-lg text-bold disabled:opacity-50'>
                                                        {isSubmitting ? 'Uploading...' : 'Upload'}
                                                    </button>
                                                )}
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
                                                                    <IoCloseOutline size={30} onClick={() => setFieldValue("file", null)} className="absolute top-[-20px] right-[-20px] m-2 p-1 bg-white rounded-full cursor-pointer" />
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
                                        </Form>
                                    )}
                                </Formik>
                                {poster && poster.length > 0 && (
                                   poster.map((media) => (
                                        console.log(media),
                                        <div class="mt-2  flex items-center justify-between mb-2 bg-[#f3d08140] px-2 py-2 rounded-lg">
                                            <img key={media.media[0].id} src={media.media[0].original_url} height={100} width={100} className='rounded-lg' />
                                            <div class="flex gap-3">
                                                <a href={media.media[0].original_url} download className='bg-[#e5e5e5e5] text-gray-500 px-2 py-2 disabled rounded-lg text-bold mt-4'
                                                >
                                                    <FaDownload size={20} />
                                                </a>
                                                <button className='bg-red-500 text-white px-2 py-2 disabled rounded-lg text-bold mt-4'
                                                    onClick={() => {
                                                        setSelectedProduct(media.id);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                >
                                                    <MdDeleteForever size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>



                        </div>
                    </div>



                </div>
            </div>



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
                            router.delete(route('banner.destroy', selectedProduct), {
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
    );
}
