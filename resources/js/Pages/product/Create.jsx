import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { IoIosAddCircleOutline } from 'react-icons/io';
import Select from 'react-select';



function Create(props) {
    const { products, categories , shippingRates } = props;


    
    return (
        <>
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product</h2>}
        >
            <Head title="Admin Dashboard" />
       


        <div className='flex justify-center mt-10 '>
                <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow h-full mb-10">

                <Formik
                        initialValues={{
                            name: '',
                            description: '',
                            price: '',
                            status: 'instock',
                            categories: [],
                            shipping_rates: [],
                            file: null,
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required'),
                            price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                            categories: Yup.array().min(1, 'At least one category is required').required('Required'),
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
                                ),
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


                            <div className="relative z-0 w-full mb-5 group">
                               <InputLabel className="" value={"Select for specific areas"}/>
                               <Select
                                    onChange={(e) => {
                                        setFieldValue("shipping_rates", e.map((item) => item.value));
                                    }}
                                    isMulti
                                    name="shipping_rates"
                                    options={shippingRates}
                                    className="basic-multi-select"
                                    classNamePrefix="select"
                                />
                                   <ErrorMessage name="shipping_rates" component="div" className="text-red-600 text-sm mt-1" />
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
                                                        <IoIosAddCircleOutline size={30} onClick={() => setFieldValue("file", null)} className="absolute top-[-20px] right-[-20px] m-2 p-1 bg-white rounded-full cursor-pointer" />
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
        </div>        
        </div>
        </AuthenticatedLayout>
        </>
        
    );
}

export default Create