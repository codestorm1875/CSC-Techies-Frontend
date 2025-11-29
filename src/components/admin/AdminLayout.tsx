import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
    LayoutDashboard,
    BookOpen,
    FileText,
    Calendar,
    CalendarDays,
    GraduationCap,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
    { icon: FileText, label: 'Materials', path: '/admin/materials' },
    { icon: Calendar, label: 'Exams', path: '/admin/exams' },
    { icon: CalendarDays, label: 'Timetable', path: '/admin/timetable' },
    { icon: GraduationCap, label: 'Events', path: '/admin/events' },
    { icon: GraduationCap, label: 'Semesters', path: '/admin/semesters' },
    { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    const getInitials = () => {
        if (!user) return 'A';
        return `${user.firstname[0]}${user.lastname[0]}`.toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-6 border-b">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            CSC Admin
                        </h1>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => setSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                            ? 'bg-indigo-50 text-indigo-600 font-medium'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <Icon className="h-5 w-5" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="lg:pl-64">
                {/* Header */}
                <header className="sticky top-0 z-40 bg-white border-b">
                    <div className="flex items-center justify-between px-6 py-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="lg:hidden"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div className="flex-1" />

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-indigo-600 text-white">
                                            {getInitials()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="hidden md:block text-left">
                                        <p className="text-sm font-medium">
                                            {user?.firstname} {user?.lastname}
                                        </p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    Logout
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}
