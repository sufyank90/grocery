import React, { useState } from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import InputLabel from '@/Components/InputLabel';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { IoMdRemoveCircleOutline } from 'react-icons/io';
import Select from 'react-select';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTrash } from 'react-icons/fa';


const FormObserver = () => {
    const { values } = useFormikContext();

    useEffect(() => {
        console.log("Form values have changed:", values);
    }, [values]);

    return null;
};


function Create(props) {
    const { products, categories, shippingRates, attribute } = props;

    // const [variation, setVariation] = useState([]);

    const [searchedAttributes, setSearchedAttributes] = useState([]);


    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Product</h2>}
        >
            <Head title="Admin Dashboard" />
            <div className='flex justify-center mt-10 '>
                <div className="block w-2/4 p-6 bg-white border border-gray-200 rounded-lg shadow  mb-10">
                    <Formik 
                        initialValues={{
                            name: '',
                            description: '',
                            price: '0',
                            status: 'instock',
                            categories: [],
                            shipping_rates: [],
                            file: [],
                            thumbnail: [], 
                            attribute_id: [],                     
                            regular_price: '',
                            sale_price: '0',
                            stock: '',
                            sku: '',
                            tax_class: 'fixed',
                            tax: '',
                            stock_count: '',
                            variation : "single",
                            variations : [],
                            attributesdata : [],
                        }}
                        validationSchema={Yup.object({
                            name: Yup.string().required('Required'),
                            description: Yup.string().required('Required') 
                            .max(800, 'Description must be at most 800 characters'),
                            // price: Yup.number().required('Required').positive(),
                            status: Yup.string().required('Required'),
                            categories: Yup.array().min(1, 'At least one category is required').required('Required'),
                            file: Yup.array()
                                .min(1, 'At least one image is required')
                                .test('fileFormat', 'Unsupported file format', (files) => {
                                    if (!files || files.length === 0) return true;
                                    return files.every(file =>
                                        ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif','image/webp', 'image/bmp', 'image/tiff'].includes(file.type)
                                    );
                                }),
                            thumbnail:Yup.array()
                            .min(1, 'At least one image is required')
                            .max(1, 'Only one image is allowed')
                            .test('fileFormat', 'Unsupported file format', (files) => {
                                if (!files || files.length === 0) return true;
                                return files.every(file =>
                                    ['image/svg+xml', 'image/png', 'image/jpg', 'image/jpeg', 'image/gif','image/webp', 'image/bmp', 'image/tiff'].includes(file.type)
                                );
                            }),
                            regular_price: Yup.number()
                                .required('Regular price is required')
                                .positive('Regular price must be a positive number'),
                            sale_price: Yup.number()
                                
                                .test(
                                    'is-less-than-or-equal-to-regular-price',
                                    'Sale price must be less than or equal to regular price',
                                    function (value) {
                                        const { regular_price } = this.parent;
                                        return !value || value <= regular_price;
                                    }
                                ),
                            tax_class: Yup.string().required('Required'),
                            tax: Yup.number().required('Required'),
                            sku: Yup.string().required('Required'),
                            stock_count: Yup.number().required('Required').positive(),
                            variations: Yup.array().when('variation', {
                                is: 'variation',
                                then: scheme=>scheme.required().min(1, 'At least one variation is required'),
                                otherwise: scheme=>scheme.optional()
                            }),

                        })}
                        onSubmit={(values, { resetForm }) => {
                             console.log(values)
                            let aids = []
                            searchedAttributes.forEach(element => {
                                aids.push( parseInt(attribute.find(item => item.name === element).id) )
                            })
                            values.attributesdata = aids;
                            const formData = {
                                ...values,
                                file: [values.thumbnail[0], ...values.file], // Ensure thumbnail is always the first element
                            };
                            router.post(route('product.store'), formData, {
                                onSuccess: () => {
                                    resetForm();
                                },
                            });
                        }}className="bg-white  mt-2 mb-2 w-full max-w-lg mx-auto "
                    >
                        {({ values, setFieldValue }) => {
                            // Update the price field value whenever regular_price or sale_price changes
                            useEffect(() => {
                                const price = values.sale_price < values.regular_price ? values.sale_price : values.regular_price;
                                setFieldValue('price', price);
                            }, [values.sale_price, values.regular_price, setFieldValue]);


                            const addVariation = (items) => {
                                if (items.length !== searchedAttributes.length) {
                                    toast.error('Please select relevant terms for all attributes');
                                    return;
                                }
                            
                                let variationDataInFormat = [];

                                // Build the variation data from the selected items
                                items.forEach((id) => {
                                    attribute.forEach((item) => {
                                        if (item.attribute_values.length > 0) {
                                            const check = item.attribute_values.find(element => element.id === id);
                                            if (check && !variationDataInFormat.includes(id)) {
                                                variationDataInFormat.push(id);
                                            }
                                        }
                                    });
                                });
                                const isDul = values.variations.find(element => {
                                    // Convert the current variation attribute to a Set and compare with variationDataInFormat
                                    const existingAttributeSet = new Set(element.attribute);
                                    const newAttributeSet = new Set(variationDataInFormat);
                                
                                    // Check if they have the same size and all values are the same
                                    if (existingAttributeSet.size !== newAttributeSet.size) {
                                        return false;
                                    }
                                
                                    
                                    // Check if every element in the new attribute set exists in the existing one
                                    return [...newAttributeSet].every(value => existingAttributeSet.has(value));
                                  
                                });
                                
                                if (isDul) {
                                    toast.error('Variation already exists');
                                    return;
                                }
                                

                                setFieldValue('variations', [
                                    ...values.variations,
                                    {
                                        attribute: variationDataInFormat,
                                        sale_price: 0,
                                        regular_price: 0,
                                        sku: '',
                                        status: 'instock',
                                        stock_count: 0
                                    }
                                ]);
                                toast.success('Variation added successfully');
                               
                                setFieldValue('attribute_id', []);
                            };
                            

                            const removeVariation = (index) => {
                                const newVariations = [...values.variations];
                                newVariations.splice(index, 1);
                                setFieldValue('variations', newVariations);
                            };


                            const [searchAttribute, setSearchAttribute] = useState('');
                           
                            return (
                                <Form>
                                    <h2 className="text-lg font-bold mb-4 text-center">Create Product</h2>

                                    {/* Name Field */}
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

                                    {/* Description Field */}
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="description"
                                            as="textarea"
                                            id="description"
                                            rows="10"
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
                                            as="select"
                                            name="variation"
                                            id="variation"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="single">Single</option>
                                            <option value="variation">Variation</option>
                                        </Field>
                                        <label
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Product Type
                                        </label>
                                        <ErrorMessage name="tax_class" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    {/* Price Field */}
                                    {/* <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="price"
                                            type="number"
                                            id="price"
                                            step="0.01"
                                            min="0"
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
                                    </div> */}

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="regular_price"
                                            type="number"
                                            id="regular_price"
                                            step="0.01"
                                            min="0"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="regular_price"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Regular price
                                        </label>
                                        <ErrorMessage name="regular_price" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="sale_price"
                                            type="number"
                                            id="sale_price"
                                            defaultValue="0"
                                            min="0"
                                            step="0.01"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="sale_price"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Sale price
                                        </label>
                                        <ErrorMessage name="sale_price" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>


                                    

                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            as="select"
                                            name="tax_class"
                                            id="tax_class"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                        >
                                            <option value="fixed">Fixed</option>
                                            <option value="percentage">Percentage</option>
                                        </Field>
                                        <label
                                            htmlFor="tax_class"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Tax Class
                                        </label>
                                        <ErrorMessage name="tax_class" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>



                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="tax"
                                            type="number"
                                            id="tax"
                                            min="0"
                                            step="0"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="tax"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Tax
                                        </label>
                                        <ErrorMessage name="tax" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    <div className="relative z-0 w-full mb-5 group">
                                        <Field
                                            name="sku"
                                            type="text"
                                            id="sku"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="sku"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            SKU
                                        </label>
                                        <ErrorMessage name="sku" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
                                    {/* Status Field */}
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
                                        <Field
                                            name="stock_count"
                                            type="number"
                                            id="stock_count"
                                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                                            placeholder=" "
                                        />
                                        <label
                                            htmlFor="Stock Count"
                                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                                        >
                                            Stock Count
                                        </label>
                                        <ErrorMessage name="stock_count" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>
{/* Variation */}
                                    {values.variation === "variation" && (
                                    <>
                                    <div className="relative z-0 w-full mb-5 group bg-gray-100 p-3 rounded-lg">
                                        <div className='font-bold'>Select Terms</div>

                                        <input type='text' value={searchAttribute} onChange={(e) => setSearchAttribute(e.target.value)} placeholder='Search term' className=" mt-2 border border-gray-300 rounded p-0.5  w-full" />

                                        {searchAttribute !== "" && (
                                        <>             
                                        <ul className=" list-inside mt-2">
                                            {attribute.length > 0 && attribute.filter(element => 
                                                element.name.toLowerCase().includes(searchAttribute.toLowerCase())
                                            ).map((attributes) => (
                                                <li key={attributes.id} className=''>
                                                  <input type="checkbox" className='mb-1 mr-1' checked={searchedAttributes.includes(attributes.name)} onChange={() => {
                                                    if(searchedAttributes.includes(attributes.name)) {
                                                        setSearchedAttributes(searchedAttributes.filter(item => item !== attributes.name))
                                                    }
                                                    else{
                                                        setSearchedAttributes([...searchedAttributes, attributes.name])
                                                    }
                                                 
                                                  }} />  {attributes.name} 
                                                  
                                                </li>
                                            ))}
                                        </ul>
                                        </>
                                        )}

                                        {searchedAttributes.length > 0 && (
                                            <>


                                            <ul className='mt-2'>
                                                    <li className='font-bold'>Selected Attributes</li>
                                                    {searchedAttributes.map((rec,index) => (
                                                        
                                                         <li key={index} className=''>
                                                         <input type="checkbox" className='mb-1 mr-1' checked={searchedAttributes.includes(rec)} onChange={() => {
                                                           if(searchedAttributes.includes(rec)) {
                                                               setSearchedAttributes(searchedAttributes.filter(item => item !== rec))
                                                           }
                                                           else{
                                                               setSearchedAttributes([...searchedAttributes, rec])
                                                           }
                                                        
                                                         }} />  {rec} 
                                                         
                                                       </li>
                                                    ))}
                                            </ul>

                                             <ul className=" list-inside mt-2">
                                            {attribute.length > 0 && attribute.filter(element=>searchedAttributes.includes(element.name) ).map((attributes) => (
                                                <li key={attributes.id}>
                                                    {attributes.name} :
                                                    <ul className='ml-8'>
                                                        {attributes.attribute_values && attributes.attribute_values.map((item) => (
                                                            <li key={item.id} className="flex items-center gap-2 my-1">
                                                                <Field
                                                                    type="checkbox"
                                                                    name="attribute_id"
                                                                    value={item.id}
                                                                    checked={values.attribute_id && values.attribute_id.includes(item.id)}
                                                                    onChange={(e) => {
                                                                        const { checked } = e.target; 
                                                                        const currentValues = values.attribute_id || [];
                                                                    
                                                                    
                                                                        // Check if the same attribute already exists
                                                                        const existingCount = attributes.attribute_values.filter(item => currentValues.includes(item.id)).length;
                                                                        if (existingCount > 0) {
                                                                            //remove that category previous all record
                                                                            const newData = currentValues.filter(id => !attributes.attribute_values.some(item => item.id === id));
                                                                            setFieldValue("attribute_id", [...newData, item.id]);
                                                                            return;
                                                                        }
                                                                    
                                                                        // Update values based on whether the checkbox is checked or unchecked
                                                                        const newValues = checked 
                                                                            ? [...currentValues, item.id] 
                                                                            : currentValues.filter(id => id !== item.id);
                                                                            
                                                                        setFieldValue("attribute_id", newValues);
                                                                    }}
                                                                    
                                                                />
                                                                {item.value}
                                                                

                                                            </li>
                                                        ))}
                                                    </ul>
                                                </li>
                                            ))}
                                        </ul>
                                            <button type="button" className='bg-[#fcb609] text-white px-3 py-1 rounded mt-3' 
                                            onClick={() => addVariation(values.attribute_id)}
                                        >Create Variation</button>
                                        </>
                                        )}

                                    <ErrorMessage name="variations" component="div" className="text-red-600 text-sm mt-1" />
                                    </div>

                                    <div className="overflow-x-auto mt-5 mb-10">
                                        <InputLabel value={"Product Variants"} />
                                        <table className="bg-white w-full border border-gray-200 rounded-lg shadow-sm">
                                            <thead>
                                                <tr className="w-full bg-gray-200 text-gray-600 uppercase text-xs leading-normal">
                                                    <th className="py-1 px-2 text-left">Attribute</th>
                                                 
                                                    <th className="py-1 px-2 text-left">Sale</th>
                                                    <th className="py-1 px-2 text-left">Regular</th>
                                                    <th className="py-1 px-2 text-left">SKU</th>
                                                    <th className="py-1 px-2 text-left">Stock</th>
                                                    <th className="py-1 px-2 text-left">Status</th>
                                                    <th className="py-1 px-2 text-left">
                                                    
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-xs font-light">
                                                {values.variations.map((item, index) => (
                                                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-100">
                                                        <td className="py-1 px-2">
                                                            <ul className='list-disc list-inside'>
                                                            {item.attribute.map((id,index) => (
                                                                console.log(attribute),
                                                                <li key={index}>
                                                                <span className='font-bold'> {attribute
                                                                    .find(att => att.attribute_values.some(value => value.id === id))
                                                                    ?.name} :
                                                                </span>
                                                                {attribute
                                                                    .find(att => att.attribute_values.some(value => value.id === id))
                                                                    ?.attribute_values.find(value => value.id === id)
                                                                    ?.value}
                                                            </li>
                                                            ))}
                                                            </ul>
                                                            </td>
                                                      
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.sale_price}
                                                                 onChange={(e) => setFieldValue(`variations.${index}.sale_price`, e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.regular_price}
                                                                onChange={(e) => setFieldValue(`variations.${index}.regular_price`, e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="text"
                                                                value={item.sku}
                                                                onChange={(e) => setFieldValue(`variations.${index}.sku`, e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <input
                                                                type="number"
                                                                value={item.stock_count}
                                                                onChange={(e) => setFieldValue(`variations.${index}.stock_count`, e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            />
                                                        </td>
                                                        <td className="py-1 px-2">
                                                            <select
                                                                value={item.status}
                                                                onChange={(e) => setFieldValue(`variations.${index}.status`, e.target.value)}
                                                                className="border border-gray-300 rounded p-0.5 text-xs w-full"
                                                            >
                                                                <option value="instock">InStock</option>
                                                                <option value="outofstock">Out of Stock</option>
                                                            </select>
                                                        </td>
                                                        <td className="py-1 px-2">
                                                           <FaTrash color='red' className='cursor-pointer'
                                                           onClick={() => removeVariation(index)}
                                                           />
                                                        </td>
                                                       
                                                    </tr>
                                                ))}

                                                {values.variations.length === 0 && (
                                                    <tr>
                                                        <td colSpan="6" className="py-1 px-2">
                                                            No Variations
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    </>
                                    )}
{/*  end Variation */}


                                    {/* Categories Field */}
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
                                      <label className="block text-sm font-medium text-gray-700 my-2">Thumbnail</label>
                                    <FileUpload
                                        label="SVG, PNG, JPG GIF or WEBP (MAX. 800x400px)"
                                        accept="image/*"
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        fieldName="thumbnail"
                                    />
                                    <FilePreview
                                        files={values.thumbnail}
                                        setFieldValue={setFieldValue}
                                        fieldName="thumbnail"
                                    />

                                    {/* File Upload */}
                                    <label className="block text-sm font-medium text-gray-700 my-2">Pictures</label>
                                    <FileUpload
                                        label="SVG, PNG, JPG GIF or WEBP (MAX. 800x400px)"
                                        accept="*/*" // Change as needed
                                        setFieldValue={setFieldValue}
                                        values={values}
                                        fieldName="file"
                                    />
                                    <FilePreview
                                        files={values.file}
                                        setFieldValue={setFieldValue}
                                        fieldName="file"
                                    />

                                    {/* Shipping Rates */}
                                    <div className="relative z-0 w-full mb-5 mt-5 group">
                                        <InputLabel className="" value={"Select for specific areas"} />
                                        
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

                                    <div className="flex justify-end space-x-2 mt-4">
                                        <button
                                            type="submit"
                                            className="text-white bg-yellow-500 hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => router.get(route('product.index'))}
                                            className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                                        >
                                            Close
                                        </button>
                                    </div>

                                    <FormObserver />
                                </Form>
                            );
                        }}
                    </Formik>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

export default Create;




const FileUpload = ({ label, accept, setFieldValue, values, fieldName }) => {
    return (
        <div className="flex items-center justify-center w-full">
            <label htmlFor={fieldName} className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">{label}</p>
                </div>
                <input
                    onChange={(event) => {
                        const newFiles = Array.from(event.currentTarget.files);
                        const updatedFiles = values[fieldName] ? [...values[fieldName], ...newFiles] : newFiles;
                        setFieldValue(fieldName, updatedFiles);
                    }}
                    id={fieldName}
                    type="file"
                    className="hidden"
                    multiple
                    accept={accept}
                />
            </label>
        </div>
    );
};

const FilePreview = ({ files, setFieldValue, fieldName }) => {
    return (
        <div className="w-full space-y-4">
            {files && Array.from(files).map((file, index) => (
                <div key={index} className="relative flex items-center justify-between bg-[#f3d08140] px-2 py-2 rounded-lg">
                    <img
                        height={100}
                        width={100}
                        className="rounded-lg"
                        src={file.url ? file.url : URL.createObjectURL(file)}
                        alt="Preview"
                    />
                    <IoMdRemoveCircleOutline
                        size={30}
                        onClick={(e) => {
                            e.stopPropagation();
                            const newFiles = Array.from(files).filter((_, i) => i !== index);
                            setFieldValue(fieldName, newFiles.length > 0 ? newFiles : null);
                        }}
                        className="absolute top-[-10px] right-[-10px] m-2 p-1 bg-white rounded-full cursor-pointer text-red-500"
                        title="Remove Image"
                    />
                </div>
            ))}
            <ErrorMessage name={fieldName} component="div" className="text-red-500 text-sm" />
        </div>
    );
};
