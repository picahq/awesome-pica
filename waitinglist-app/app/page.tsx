import EmailSignup from "@/components/EmailSignup";
import AdminDashboard from "@/components/AdminDashboard";

export default function Home() {
  return (
    <div>
      <EmailSignup />
      <div className="mt-16">
        <AdminDashboard />
      </div>
    </div>
  );
}