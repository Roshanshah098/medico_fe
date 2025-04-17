import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

const DashboardLayout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <TopBar />
        <div className="p-4">dcdcdc</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
