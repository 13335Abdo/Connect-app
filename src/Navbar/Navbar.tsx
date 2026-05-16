import { Avatar } from "@heroui/react";
import { useContext, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import img from "../../public/Gemini_Generated_Image_4viszz4viszz4vis.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../contrext/AuthContext";
import { userContex } from "../contrext/UserContext";

export default function Navbar() {



  const { settoken } = useContext(authContext)

  const nav = useNavigate()


  function logOut() {
    settoken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("loggedUser")
    nav("/login")
  }

  let loged = null

  if (localStorage.getItem("loggedUser")) {

    loged = JSON.parse(localStorage.getItem("loggedUser") || "{}");

    console.log("loged", loged);
  }



  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  // روابط التنقل (يمكنك تعديلها)
  const navLinks = [
    { name: "home", href: "/", active: false },
    { name: "Notifications", href: "/notifications", active: false },
    { name: "my profile", href: "/myProfile", active: false },
    { name: "add Friends", href: "/addFriends", active: false },
  ];

  return (
    <>
      {/* شريط الـ Navbar الرئيسي */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* القسم الأيسر: Logo + روابط سطح المكتب */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <div className="shrink-0 flex items-center gap-2">
                <img src={img} className="w-8 h-8 rounded-md" />

                <span className="font-bold text-gray-800 text-lg hidden sm:block">ConnectApp</span>
              </div>

              {/* روابط (تظهر فقط من md فما فوق) */}

            </div>
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 ${link.active
                    ? "text-blue-600 border-b-2 border-blue-600 pb-1"
                    : "text-gray-700"
                    }`}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            {/* القسم الأيمن: بحث + أفاتار */}
            <div className="flex items-center gap-3">


              {/* أفاتار المستخدم مع Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-1 focus:outline-none"
                ><Avatar className="cursor-pointer">
                    <Avatar.Image alt={loged?.name} src={loged?.photo} />
                    <Avatar.Fallback>JD</Avatar.Fallback>
                  </Avatar>
                </button>

                {/* قائمة Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800">john@example.com</p>
                    </div>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Settings
                    </a>
                    <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Team Settings
                    </a>
                    <Link to="change-password" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Change Password
                    </Link>
                    <hr className="my-1" />
                    <button onClick={logOut} className="flex cursor-pointer w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* زر هامبرغر (يظهر فقط على الشاشات الصغيرة والمتوسطة) */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none"
              >
                {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* القائمة الجانبية للهواتف (Mobile Menu) - تظهر عند فتح isMobileMenuOpen */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* طبقة الخلفية المعتمة */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleMobileMenu}
          ></div>
          {/* القائمة نفسها */}
          <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                  A
                </div>
                <span className="font-bold text-gray-800">ACME</span>
              </div>
            </div>
            <div className="flex flex-col p-4 space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-base font-medium ${link.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                    }`}
                  onClick={toggleMobileMenu}
                >
                  {link.name}
                </a>
              ))}
              <hr className="my-2" />
              <a href="#" className="px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                Settings
              </a>
              <button onClick={logOut} className="px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md">
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}