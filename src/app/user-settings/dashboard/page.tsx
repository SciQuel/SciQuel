import DashboardArticles from "@/components/UserSettings/dashboard/DashboardArticles";
import DashboardGreeting from "@/components/UserSettings/dashboard/DashboardGreeting";
import DashboardQuizRecap from "@/components/UserSettings/dashboard/DashboardQuizRecap";

export default function UserDashPage() {
  return (
    <div className="relative flex grow flex-col pt-6 md:pl-56">
      <DashboardGreeting />
      <DashboardQuizRecap />
      <DashboardArticles />
    </div>
  );
}
