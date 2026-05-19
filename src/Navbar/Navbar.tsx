import { Avatar } from "@heroui/react";
import { Home, LockKeyhole, LogOut, Settings, UserRound, UserRoundPlus } from "lucide-react";
import { useContext, useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { authContext } from "../contrext/AuthContext";
import { profilephotoContext } from "../contrext/photoContext";

const img = "/Gemini_Generated_Image_4viszz4viszz4vis.png";

export default function Navbar() {



  const { settoken } = useContext(authContext)
  const { profilePicture } = useContext(profilephotoContext)

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
    { name: "Home", href: "/", icon: Home },
    { name: "My bookmarks", href: "/myProfile", icon: UserRound },
    { name: "my Profile", href: `/userData/${loged._id}`, icon: UserRoundPlus },
  ];

  return (
    <>
      {/* شريط الـ Navbar الرئيسي */}
      <nav className="sticky top-0 z-50 border-b border-white/70 bg-white/85 shadow-sm shadow-slate-200/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* القسم الأيسر: Logo + روابط سطح المكتب */}
            <div className="flex items-center gap-6">
              {/* Logo */}
              <Link to="/" className="shrink-0 flex items-center gap-2.5">
                <img src={img} className="w-9 h-9 rounded-xl shadow-sm ring-1 ring-slate-200" />

                <span className="font-bold text-slate-900 text-lg hidden sm:block tracking-tight">ConnectApp</span>
              </Link>

              {/* روابط (تظهر فقط من md فما فوق) */}

            </div>
            <div className="hidden md:flex items-center gap-1 rounded-full bg-slate-100/80 p-1 ring-1 ring-slate-200/70">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all ${isActive
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200"
                      : "text-slate-600 hover:bg-white/70 hover:text-slate-950"
                    }`
                  }
                >
                  <link.icon size={16} />
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
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 pr-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-blue-600 focus:outline-none"
                ><Avatar className="cursor-pointer">
                    <Avatar.Image alt={loged?.name} src={profilePicture??loged?.photo} />
                    <Avatar.Fallback>JD</Avatar.Fallback>
                  </Avatar>
                  <span className="hidden max-w-28 truncate sm:block">{loged?.name ?? "Account"}</span>
                </button>

                {/* قائمة Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white py-2 shadow-xl shadow-slate-200/80 z-20">
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">{loged?.email ?? loged?.username ?? "Your account"}</p>
                    </div>
                    <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <Settings size={16} />
                      My Settings
                    </a>
                    <a href="#" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <UserRoundPlus size={16} />
                      Team Settings
                    </a>
                    <Link to="change-password" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                      <LockKeyhole size={16} />
                      Change Password
                    </Link>
                    <hr className="my-1" />
                    <button onClick={logOut} className="flex cursor-pointer w-full items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50">
                      <LogOut size={16} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>

              {/* زر هامبرغر (يظهر فقط على الشاشات الصغيرة والمتوسطة) */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:text-blue-600 focus:outline-none"
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
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={toggleMobileMenu}
          ></div>
          {/* القائمة نفسها */}
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="p-5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <img src={img} className="w-9 h-9 rounded-xl shadow-sm ring-1 ring-slate-200" />
                <span className="font-bold text-slate-900">ConnectApp</span>
              </div>
            </div>
            <div className="flex flex-col p-4 space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
                    }`
                  }
                  onClick={toggleMobileMenu}
                >
                  <link.icon size={18} />
                  {link.name}
                </NavLink>
              ))}
              <hr className="my-2" />
              <a href="#" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                <Settings size={18} />
                Settings
              </a>
              <button onClick={logOut} className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
