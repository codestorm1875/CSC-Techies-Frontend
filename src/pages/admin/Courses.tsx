import { useState, useEffect } from 'react';
import { coursesService } from '../../services/courses.service';
import type { Course, CreateCourseDto } from '../../services/courses.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

export default function CoursesManagement() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState<Course | null>(null);
    const [formData, setFormData] = useState<CreateCourseDto>({
        courseCode: '',
        courseTitle: '',
        units: 0,
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await coursesService.getAll();
            setCourses(data);
        } catch (error) {
            toast.error('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingCourse) {
                await coursesService.update(editingCourse.id, formData);
                toast.success('Course updated successfully');
            } else {
                await coursesService.create(formData);
                toast.success('Course created successfully');
            }
            setDialogOpen(false);
            resetForm();
            fetchCourses();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save course');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (course: Course) => {
        setEditingCourse(course);
        setFormData({
            courseCode: course.courseCode,
            courseTitle: course.courseTitle,
            units: course.units,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this course?')) return;

        try {
            await coursesService.delete(id);
            toast.success('Course deleted successfully');
            fetchCourses();
        } catch (error) {
            toast.error('Failed to delete course');
        }
    };

    const resetForm = () => {
        setEditingCourse(null);
        setFormData({ courseCode: '', courseTitle: '', units: 0 });
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Courses</h1>
                    <p className="text-gray-500 mt-1">Manage course offerings</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Course
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
                            <DialogDescription>
                                {editingCourse ? 'Update course information' : 'Create a new course for the semester'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Course Code</label>
                                <Input
                                    value={formData.courseCode}
                                    onChange={(e) => setFormData({ ...formData, courseCode: e.target.value })}
                                    placeholder="CSC101"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Course Title</label>
                                <Input
                                    value={formData.courseTitle}
                                    onChange={(e) => setFormData({ ...formData, courseTitle: e.target.value })}
                                    placeholder="Introduction to Computer Science"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Units</label>
                                <Input
                                    type="number"
                                    value={formData.units}
                                    onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) })}
                                    min="1"
                                    max="6"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingCourse ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Courses</CardTitle>
                    <CardDescription>{courses.length} courses in total</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium">Code</th>
                                    <th className="text-left p-4 font-medium">Title</th>
                                    <th className="text-left p-4 font-medium">Units</th>
                                    <th className="text-right p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map((course) => (
                                    <tr key={course.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-mono text-sm">{course.courseCode}</td>
                                        <td className="p-4">{course.courseTitle}</td>
                                        <td className="p-4">{course.units}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(course)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(course.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {courses.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No courses found. Add your first course to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
