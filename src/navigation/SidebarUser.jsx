import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHeadset } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";

const SidebarUser = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [userName, setUserName] = useState("Customer");
    const [userInitial, setUserInitial] = useState("U");
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    // Toggle mobile menu
    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    // Check if the current route matches the link
    const isActive = (path) => {
        if (path === "/user" && location.pathname === "/user") {
            return true;
        }
        return location.pathname.startsWith(path) && path !== "/user";
    };

    // Get user data from localStorage
    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            if (user && user.name) {
                setUserName(user.name);
                setUserInitial(user.name.charAt(0).toUpperCase());
            }
        } catch (error) {
            console.error("Error parsing user data:", error);
        }

        // Check screen size
        const checkScreenSize = () => {
            const smallScreen = window.innerWidth < 768;
            setIsSmallScreen(smallScreen);
            if (smallScreen) {
                setIsOpen(false);
                setShowMobileMenu(false);
            } else {
                setIsOpen(true);
            }
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);

        return () => {
            window.removeEventListener("resize", checkScreenSize);
        };
    }, []);

    // Handle logout
    const handleLogout = () => {
        // Show loading toast
        const loadingToast = toast.loading("Logging out...", {
            style: {
                background: "#5C3B2E",
                color: "#fff",
                border: "1px solid #D2AB7C",
            },
        });

        // Simulate logout process (replace with actual logout logic)
        setTimeout(() => {
            // Clear localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.setItem("showLogoutSuccess", "true");

            // Dismiss loading toast and show success
            toast.dismiss(loadingToast);
            toast.success("Logout berhasil!", {
                duration: 3000,
                style: {
                    background: "#5C3B2E",
                    color: "#fff",
                    border: "1px solid #D2AB7C",
                },
                icon: "👋",
            });

            // Redirect to login
            navigate("/login");
        }, 1000);
    };

    // Mobile menu button
    const MobileMenuButton = () => (
        <button
            onClick={toggleMobileMenu}
            className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-900 text-white"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                {showMobileMenu ? (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                ) : (
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                )}
            </svg>
        </button>
    );

    // Sidebar content
    const SidebarContent = () => (
        <div
            className={`${isOpen ? "w-64" : "w-20"} shadow-lg bg-blue-900 text-white transition-all duration-300 h-screen fixed md:relative z-60`}
            style={{ display: isSmallScreen ? (showMobileMenu ? "block" : "none") : "block" }}
        >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b text-amber-100">
                {isOpen ? (
                    <div className="text-xl font-bold text-white">Inventaris</div>
                ) : (
                    <div className="text-xl font-bold text-white mx-auto">I</div>
                )}
                {!isSmallScreen && (
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-full hover:bg-gray-800 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-50"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                />
                            )}
                        </svg>
                    </button>
                )}
            </div>

            {/* User Profile Section */}
            <div className="px-4 py-3 border-b">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                        {userInitial}
                    </div>
                    {isOpen && (
                        <div className="ml-3">
                            <div className="font-medium">{userName}</div>
                            <div className="text-xs text-gray-50">User</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-4 text-amber-100">
                <ul className="text-white">
                    {/* Dashboard */}
                    <li>
                        <Link
                            to="/dashboardUser"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/dashboardUser")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {isOpen && <span className="ml-3">Dashboard</span>}
                        </Link>
                    </li>

                    {/* Catalog */}
                    <li>
                        <Link
                            to="/catalog"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/catalog")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                            </svg>
                            {isOpen && <span className="ml-3">Katalog Barang</span>}
                        </Link>
                    </li>

                    {/* My Loans */}
                    <li>
                        <Link
                            to="/myRental"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/myRental")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                            </svg>
                            {isOpen && <span className="ml-3">Peminjaman Saya</span>}
                        </Link>
                    </li>

                    {/* History */}
                    <li>
                        <Link
                            to="/history"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/history")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            {isOpen && <span className="ml-3">Riwayat</span>}
                        </Link>
                    </li>

                    {/* Ticket */}
                    <li>
                        <Link
                            to="/ticket"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/ticket")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <BiSupport className="h-5 w-5" />   
                            {isOpen && <span className="ml-3">Admin Support</span>}
                        </Link>
                    </li>

                    {/* Profile */}
                    <li>
                        <Link
                            to="/user/profile"
                            className={`flex items-center px-4 py-3 font-bold transition-colors ${isActive("/user/profile")
                                ? "bg-[#101b31] text-[#fffb00] border-r-4 border-[#fffb00]"
                                : "text-white hover:bg-[#69bac5]"
                                }`}
                            onClick={() => isSmallScreen && setShowMobileMenu(false)}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                            {isOpen && <span className="ml-3">Profil</span>}
                        </Link>
                    </li>
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="absolute bottom-0 w-full p-4">
                <button
                    onClick={() => {
                        handleLogout();
                        isSmallScreen && setShowMobileMenu(false);
                    }}
                    className={`flex items-center justify-center w-full px-4 py-3 font-bold text-red-600 hover:bg-red-50 rounded-full`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {isOpen && <span className="ml-3">Logout</span>}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {isSmallScreen && <MobileMenuButton />}
            <SidebarContent />
            {isSmallScreen && showMobileMenu && (
                <div
                    className="fixed inset-0 bg-black/50 z-30"
                    onClick={() => setShowMobileMenu(false)}
                />
            )}
        </>
    );
};

export default SidebarUser;