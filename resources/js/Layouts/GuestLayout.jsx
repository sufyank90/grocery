import { Link } from '@inertiajs/react';
// import logo from '@public/DealtoCard.jpg';

export default function Guest({ children }) {
    return (
        <>
            <div className='flex flex-col md:flex-row w-full justify-center items-center h-screen bg-[#fcb609]'>
                <div className='w-full md:w-1/3 flex justify-center md:justify-start pl-10 md:pl-60 mt-8 md:mt-0'>
                    <img src="/image/logo.png" alt="Logo" className='w-2/3 lg:full md:w-auto' />
                </div>
                <div className='w-full md:w-2/3 p-8 md:pl-80 md:pr-32'>
                    <h1 className='text-2xl font-bold mb-10 text-center lg:text-center md:text-left'>
                        Welcome to Air Express Mart Admin Panel
                    </h1>
                    {children}
                </div>
            </div>

        </>

    );
}
