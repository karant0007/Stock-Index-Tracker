import LoginForm from "@/components/LoginForm";

export const metadata = {
  title: "Login - Stock Index Tracker",
  description: "Login to your Stock Index Tracker account",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Login</h1>
          <p className="mt-2 text-gray-600">
            Access your Stock Index Tracker account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
