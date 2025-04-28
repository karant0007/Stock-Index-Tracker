import RegisterForm from "@/components/RegisterForm";

export const metadata = {
  title: "Register - Stock Index Tracker",
  description: "Create a new Stock Index Tracker account",
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create an Account
          </h1>
          <p className="mt-2 text-gray-600">
            Join Stock Index Tracker to monitor indices and set alerts
          </p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}
