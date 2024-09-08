import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { IoIosAddCircleOutline, IoMdRemoveCircleOutline } from 'react-icons/io';
import Select from 'react-select';



function Edit(props) {
    const { product, categories, shippingRates, defaultshippingrate } = props;

    // Extract category IDs from the product to pre-check the checkboxes
    const initialCategoryIds = product.categories.map(category => category.id);


    const extractShippingRateIds = (shippingRates) => {
        if (Array.isArray(shippingRates)) {
            return shippingRates.map(rate => rate.value); // Extract 'value' property for IDs
        }
        return []; // Return empty array if shippingRates is not an array
    };

    // Assuming defaultshippingrate is available in your component
    const shippingRateIds = extractShippingRateIds(defaultshippingrate);

    const initialFiles = product?.media?.length > 0
        ? product.media.map(media => ({ url: media.original_url, id: media.id }))
        : [];

    return (
        <>
            <AuthenticatedLayout
                auth={props.auth}
                errors={props.errors}
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product</h2>}
            >
                <Head title="Admin Dashboard" />

                <div className='flex justify-center mt-10 '>
                    <div className="block w-1/2 p-6 bg-white border border-gray-200 rounded-lg shadow h-full mb-10">

                        <Formik
                            initialValues={{
                                name: product ? product.name : '',
                                description: product ? product.description : '',
                                price: product ? product.price : '',
                                status: product ? product.status : '',
                                categories: initialCategoryIds, // Initialize with selected categories
                                shipping_rates: defaultshippingrate ? shippingRateIds : [],
                                file: initialFiles

                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Required'),
                                description: Yup.string().required('Required'),
                                price: Yup.number().required('Required').positive(),
                                status: Yup.string().required('Required'),
                                categories: Yup.array().min(1, 'At least one category is required').required('Required'),
                                file: product && product.media && product.media[0] && product.media[0].original_url
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
                                formData.append('description', values.description);
                                formData.append('price', values.price);
                                formData.append('status', values.status);
                                formData.append('shipping_rates', values.shipping_rates);
                                formData.append('categories', values.categories.join(',')); // Join category IDs into a string
                                if (values.file) {
                                    values.file.forEach((file) => {
                                        // Ensure that only File objects are appended
                                        if (file instanceof File) {
                                            formData.append('file[]', file); // Append each file separately
                                        }
                                        else {
                                            formData.append('ids[]', file.id);
                                        }
                                    });
                                }

                                router.post(route('product.updatewithfile', product.id), formData, {
                                    onSuccess: () => {
                                        resetForm();
                                    },
                                });
                            }}
                        >
                            {({ values, setFieldValue }) => {

                                return (
                                    <Form className="bg-white p-2 mt-2 mb-2 w-full max-w-lg mx-auto flex flex-col items-center">
                                        <h2 className="text-lg font-bold mb-4">Edit Product</h2>

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
                                            <InputLabel className="" value={"Select Category"} />
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


      {/* Thumbnail Upload */}
<div className="flex items-center justify-center w-full">
    <label htmlFor="thumbnail" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {!values.file ? (
                <>
                    <svg className="w-8 h-8 mb-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </>
            ) : (
                <span></span>
            )}
        </div>
        <input
            onChange={(event) => {
                const file = event.currentTarget.files[0];
                setFieldValue('thumbnail', file);
            }}
            id="thumbnail"
            type="file"
            className="hidden"
            accept="image/*"
        />
    </label>
</div>

{/* Thumbnail Preview */}
<div className='w-full space-y-4 mb-5'>
    {values.file && values.file.length > 0 && (
        <div className="relative flex items-center justify-between bg-[#f3d08140] px-2 py-2 rounded-lg">
            <img
                height={100}
                width={100}
                className="rounded-lg"
                src={values.file[0].url ? values.file[0].url : URL.createObjectURL(values.file[0])}
                alt="Thumbnail Preview"
            />
            {/* Delete Icon */}
            <IoMdRemoveCircleOutline
                size={30}
                onClick={() => {
                    // Clear the file input
                    document.getElementById('thumbnail').value = null;
                    // Reset the thumbnail in Formik state
                    setFieldValue('thumbnail', null);
                }}
                className="absolute top-[-10px] right-[-10px] m-2 p-1 bg-white rounded-full cursor-pointer text-red-500"
                title="Remove Thumbnail"
            />
        </div>
    )}
    <ErrorMessage name="thumbnail" component="div" className="text-red-500 text-sm mt-1" />
</div>

{/* File Upload */}
<div className="flex items-center justify-center w-full">
    <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {!values.file || values.file.length === 0 ? (
                <>
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                </>
            ) : (
                <span></span>
            )}
        </div>
        <input
            onChange={(event) => {
                const newFiles = Array.from(event.currentTarget.files);
                const updatedFiles = values.file ? [...values.file, ...newFiles] : newFiles;
                setFieldValue('file', updatedFiles); // Append new files to existing ones
            }}
            id="dropzone-file"
            type="file"
            className="hidden"
            multiple
            accept="image/*"
        />
    </label>
</div>

<div className="w-full space-y-4">
    {values.file && values.file.length > 1 && Array.from(values.file).slice(1).map((file, index) => (
        <div key={index} className="relative flex items-center justify-between bg-[#f3d08140] px-2 py-2 rounded-lg">
            <img
                height={100}
                width={100}
                className="rounded-lg"
                src={file.url ? file.url : URL.createObjectURL(file)}
                alt="Preview"
            />
            {/* Delete Icon */}
            <IoMdRemoveCircleOutline
                size={30}
                onClick={(e) => {
                    e.stopPropagation();
                    const newFiles = Array.from(values.file).filter((_, i) => i !== index + 1); // +1 to account for the thumbnail
                    setFieldValue('file', newFiles.length > 1 ? newFiles : null); // Preserve at least the thumbnail
                }}
                className="absolute top-[-10px] right-[-10px] m-2 p-1 bg-white rounded-full cursor-pointer text-red-500"
                title="Remove Image"
            />
        </div>
    ))}
</div>

<ErrorMessage name="file" component="div" className="text-red-500 text-sm" />



                                        <div className="relative z-0 w-full mb-5 mt-5 group">
                                            <InputLabel className="" value={"Select for specific areas"} />
                                            <Select
                                                defaultValue={defaultshippingrate}
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


                                        <div className="flex justify-end space-x-2 mt-4">
                                            <button
                                                type="submit"
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"

                                                onClick={() => {

                                                    router.get(route('product.index'));
                                                }}
                                                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                            >
                                                Close
                                            </button>
                                        </div>

                                    </Form>

                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}

export default Edit;
