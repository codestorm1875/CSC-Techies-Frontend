import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { BookOpen, FileText, Calendar, CalendarDays, GraduationCap, Users } from 'lucide-react';

export default function Dashboard() {
    const stats = [
        { icon: BookOpen, label: 'Total Courses', value: '12', color: 'text-blue-600', bg: 'bg-blue-50' },
        { icon: FileText, label: 'Materials', value: '48', color: 'text-green-600', bg: 'bg-green-50' },
        { icon: Calendar, label: 'Upcoming Exams', value: '5', color: 'text-red-600', bg: 'bg-red-50' },
        { icon: CalendarDays, label: 'Events', value: '8', color: 'text-purple-600', bg: 'bg-purple-50' },
        { icon: GraduationCap, label: 'Semesters', value: '3', color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { icon: Users, label: 'Active Users', value: '156', color: 'text-orange-600', bg: 'bg-orange-50' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Welcome back! Here's what's happening.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.label} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium text-gray-600">
                                    {stat.label}
                                </CardTitle>
                                <div className={`p-2 rounded-lg ${stat.bg}`}>
                                    <Icon className={`h-5 w-5 ${stat.color}`} />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold">{stat.value}</div>
                                <CardDescription className="mt-1">
                                    View all {stat.label.toLowerCase()}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>Common tasks and shortcuts</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border">
                            <div className="font-medium">Add New Course</div>
                            <div className="text-sm text-gray-500">Create a new course for the semester</div>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border">
                            <div className="font-medium">Upload Materials</div>
                            <div className="text-sm text-gray-500">Add study materials for students</div>
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border">
                            <div className="font-medium">Schedule Event</div>
                            <div className="text-sm text-gray-500">Create a new event or announcement</div>
                        </button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Latest updates and changes</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-start gap-3 pb-3 border-b">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <BookOpen className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">New course added</p>
                                <p className="text-xs text-gray-500">Data Structures - 2 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 pb-3 border-b">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Material uploaded</p>
                                <p className="text-xs text-gray-500">Algorithms PDF - 5 hours ago</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <CalendarDays className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Event scheduled</p>
                                <p className="text-xs text-gray-500">Tech Talk - Yesterday</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
