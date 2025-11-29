import { useState, useEffect } from 'react';
import { examsService } from '../../services/admin.service';
import type { Exam, CreateExamDto } from '../../services/admin.service';
import { coursesService } from '../../services/courses.service';
import type { Course } from '../../services/courses.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { format } from 'date-fns';

export default function ExamsManagement() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingExam, setEditingExam] = useState<Exam | null>(null);
    const [formData, setFormData] = useState<CreateExamDto>({
        title: '',
        courseId: '',
        startDate: '',
        endDate: '',
        venue: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [examsData, coursesData] = await Promise.all([
                examsService.getAll(),
                coursesService.getAll(),
            ]);
            setExams(examsData);
            setCourses(coursesData);
        } catch (error) {
            toast.error('Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingExam) {
                await examsService.update(editingExam.id, formData);
                toast.success('Exam updated successfully');
            } else {
                await examsService.create(formData);
                toast.success('Exam created successfully');
            }
            setDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save exam');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (exam: Exam) => {
        setEditingExam(exam);
        setFormData({
            title: exam.title,
            courseId: exam.courseId,
            startDate: exam.startDate.split('T')[0],
            endDate: exam.endDate.split('T')[0],
            venue: exam.venue,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;

        try {
            await examsService.delete(id);
            toast.success('Exam deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete exam');
        }
    };

    const resetForm = () => {
        setEditingExam(null);
        setFormData({ title: '', courseId: '', startDate: '', endDate: '', venue: '' });
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
                    <h1 className="text-3xl font-bold">Exams</h1>
                    <p className="text-gray-500 mt-1">Manage examination schedule</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Exam
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingExam ? 'Edit Exam' : 'Add New Exam'}</DialogTitle>
                            <DialogDescription>
                                {editingExam ? 'Update exam information' : 'Schedule a new examination'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Midterm Exam"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Course</label>
                                <select
                                    className="w-full p-2 border rounded-md"
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                                    required
                                >
                                    <option value="">Select a course</option>
                                    {courses.map((course) => (
                                        <option key={course.id} value={course.id}>
                                            {course.courseCode} - {course.courseTitle}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Start Date</label>
                                <Input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">End Date</label>
                                <Input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Venue</label>
                                <Input
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    placeholder="Main Hall"
                                    required
                                />
                            </div>
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingExam ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Exams</CardTitle>
                    <CardDescription>{exams.length} exams scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium">Title</th>
                                    <th className="text-left p-4 font-medium">Date</th>
                                    <th className="text-left p-4 font-medium">Venue</th>
                                    <th className="text-right p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {exams.map((exam) => (
                                    <tr key={exam.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{exam.title}</td>
                                        <td className="p-4 text-sm">
                                            {format(new Date(exam.startDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="p-4">{exam.venue}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(exam)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(exam.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {exams.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No exams scheduled. Add your first exam to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
