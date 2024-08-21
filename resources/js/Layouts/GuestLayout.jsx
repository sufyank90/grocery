import { Link } from '@inertiajs/react';
// import logo from '@public/DealtoCard.jpg';

export default function Guest({ children }) {
    return (
        <>
            <div className='flex w-full justify-center items-center  h-screen  gap-2 bg-[#fcb609]'>
            <div className='w-full pl-60 mt-32'>
                    <img src="/image/logo.png" alt="" />
                </div>
                <div className='w-full pl-80 pr-32'>
                   
                   <h1 className='text-2xl font-bold mb-10'>Welcome to Air Express Mart Admin Panel</h1>
                    
                    {children}
                
                </div>

                
            </div>

        </>

    );
}
