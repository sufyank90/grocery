import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function PasswordResetSucess(props) {
  

    return (
        <GuestLayout>
            <Head title="Email Verification" />

            <div className="mb-4 max-w-md mx-auto text-sm text-gray-600">
                Your password has been reset! You are now able to login with your new password in your application.
            </div>

          
          
        </GuestLayout>
    );
}
