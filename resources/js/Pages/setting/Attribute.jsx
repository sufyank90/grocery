import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

function AttributeManagement(props) {
  const { attributes } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  const handleDelete = () => {
    if (deleteItem) {
      router.delete(route('attributes.destroy', deleteItem));
      setIsDeleteModalOpen(false);
    }
  };

  const openDeleteModal = (attributeId) => {
    setDeleteItem(attributeId);
    setIsDeleteModalOpen(true);
  };

  const openEditModal = (attribute) => {
    setSelectedAttribute(attribute);
    setIsEditModalOpen(true);
  };

  const handleUpdate = (values) => {
    router.put(route('attributes.update', selectedAttribute.id), values, {
      onSuccess: () => {
        setIsEditModalOpen(false);
      },
    });
  };

  return (
    <AuthenticatedLayout
      auth={props.auth}
      errors={props.errors}
      header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Attribute Management</h2>}
    >
      <Head title="Attribute Management" />

      <div className="flex">
        <div className="max-w-7xl mt-10 mx-auto w-full">
          <div className="flex justify-between items-center mt-6 mb-4">
            <h3 className="text-lg font-bold">Attributes</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              style={{ background: '#fcb609' }}
              className="text-black py-2 px-4 rounded-lg hover:bg-green-600"
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
              {attributes.data.length === 0 && (
                <tr>
                  <td className="py-2 px-4 border-b text-center" colSpan="3">
                    No attributes found
                  </td>
                </tr>
              )}
              {attributes.data.map((attribute, index) => (
                <tr key={attribute.id}>
                  <td className="py-2 px-4 border-b text-left">{index + 1}</td>
                  <td className="py-2 px-4 border-b text-left">{attribute.name}</td>
                  <td className="py-2 px-4 border-b text-left">
                    <div className="flex items-center">
                      <FaEdit onClick={() => openEditModal(attribute)} className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                      <span className="mx-1"></span>
                      <MdDelete onClick={() => openDeleteModal(attribute.id)} className="w-7 h-7 cursor-pointer" style={{ color: '#fcb609' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-end mt-4 space-x-1">
            {attributes.links.map((link, index) => (
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

      {/* Create Attribute Modal */}
      <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="2xl">
        <Formik
          initialValues={{ name: '' }}
          validationSchema={Yup.object({ name: Yup.string().required('Name is required') })}
          onSubmit={(values, { resetForm }) => {
            router.post(route('attributes.store'), values, {
              onSuccess: () => {
                resetForm();
                setIsModalOpen(false);
              },
            });
          }}
        >
          {({ errors, touched }) => (
            <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4">Create Attribute</h2>
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="name"
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
              <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4">
                Create Attribute
              </button>
            </Form>
          )}
        </Formik>
      </Modal>

      {/* Edit Attribute Modal */}
      <Modal show={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} maxWidth="2xl">
        <Formik
          initialValues={{ name: selectedAttribute?.name || '' }}
          validationSchema={Yup.object({ name: Yup.string().required('Name is required') })}
          onSubmit={(values) => handleUpdate(values)}
        >
          {({ errors, touched }) => (
            <Form className="bg-white p-6 w-full max-w-lg mx-auto flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4">Edit Attribute</h2>
              <div className="relative z-0 w-full mb-5 group">
                <Field
                  type="text"
                  name="name"
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
              <button type="submit" className="bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 mt-4">
                Update Attribute
              </button>
            </Form>
          )}
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

export default AttributeManagement;
