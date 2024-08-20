import { Link } from '@inertiajs/react';
// import logo from '@public/DealtoCard.jpg';

export default function Guest({ children }) {
    return (
        <>
            <div className='flex w-full justify-center items-center  h-screen  gap-2 bg-[#fcb609]'>
            <div className='w-full pl-60 mt-32'>
                    <img src="/illustration.svg" alt="" />
                </div>
                <div className='w-full pl-80 pr-32'>
                    <Link href="/">
                        {/* ApplicationLogo component ko remove karke apni logo image use karein */}
                        <img src='/image/logo.png' alt="Logo" className="w-40 h-52 ml-28 "  />
                        {/* <img src={illustration} className='w-full' /> */}
                    </Link>
                    
                    {children}
                
                </div>

                
            </div>

        </>

    );
}
