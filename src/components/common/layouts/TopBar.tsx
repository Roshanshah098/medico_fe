import { Menu, Text, TextInput } from "@mantine/core";
import { useUserStore } from "../../../stores/tokenStore";
import { Icons } from "../../../assets/icons";
import { Link } from "react-router-dom";

const TopBar = () => {
  const { userProfile, setUserProfile, removeUserProfile } = useUserStore();

  const handleLogout = () => {
    removeUserProfile();
  };
  return (
    <div className="h-20  flex  w-10/12 justify-between  items-center  text-black pr-8 fixed  left-3/12 top-0 ">
      <TextInput
        leftSection={<Icons.Search />}
        className="rounded-xl outline-none"
      ></TextInput>

      <div className="flex items-center space-x-4">
        <Menu>
          {/* <Menu.Target>
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors duration-200 relative">
              <Icons.Bell className="w-6 h-6" />
              <span className="absolute top-0 right-0 h-3 w-3 bg-red-500 rounded-full"></span>
            </button>
          </Menu.Target> */}
          {/* <Menu.Dropdown className="mt-2">
            <Menu.Item className="hover:bg-gray-100">
              <div className="py-2">
                <Text size="sm">Notification 1</Text>
              </div>
            </Menu.Item>
            <Menu.Item className="hover:bg-gray-100">
              <div className="py-2">
                <Text size="sm">Notification 2</Text>
              </div>
            </Menu.Item>
          </Menu.Dropdown> */}
        </Menu>

        <Menu>
          <Menu.Target>
            <div className="flex items-center space-x-3 p-2 hover:bg-white/10 rounded-full transition-colors duration-200 cursor-pointer">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Icons.User className="w-5 h-5" />
              </div>
              <span className="font-medium">{userProfile?.name}</span>
            </div>
          </Menu.Target>
          <Menu.Dropdown className="mt-2">
            <Menu.Item className="hover:bg-gray-100">
              <Link to="/profile">
                <Text size="sm">Profile</Text>
              </Link>
            </Menu.Item>
            <Menu.Item className="hover:bg-gray-100" onClick={handleLogout}>
              <Text size="sm" color="red">
                Logout
              </Text>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default TopBar;
