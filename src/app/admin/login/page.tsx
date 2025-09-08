import LoginForm from '@/components/admin/LoginForm';

export default function AdminLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Admin Login
        </h2>
        <LoginForm />
      </div>
    </div>
  );
}
