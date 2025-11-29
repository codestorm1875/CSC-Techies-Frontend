import { useState, useEffect } from 'react';
import { materialsService } from '../../services/admin.service';
import type { Material, CreateMaterialDto } from '../../services/admin.service';
import { coursesService } from '../../services/courses.service';
import type { Course } from '../../services/courses.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';

export default function MaterialsManagement() {
    const [materials, setMaterials] = useState<Material[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
    const [formData, setFormData] = useState<CreateMaterialDto>({
        title: '',
        description: '',
        url: '',
        courseId: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [materialsData, coursesData] = await Promise.all([
                materialsService.getAll(),
                coursesService.getAll(),
            ]);
            setMaterials(materialsData);
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
            if (editingMaterial) {
                await materialsService.update(editingMaterial.id, formData);
                toast.success('Material updated successfully');
            } else {
                await materialsService.create(formData);
                toast.success('Material created successfully');
            }
            setDialogOpen(false);
            resetForm();
            fetchData();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save material');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (material: Material) => {
        setEditingMaterial(material);
        setFormData({
            title: material.title,
            description: material.description,
            url: material.url,
            courseId: material.courseId,
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this material?')) return;

        try {
            await materialsService.delete(id);
            toast.success('Material deleted successfully');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete material');
        }
    };

    const resetForm = () => {
        setEditingMaterial(null);
        setFormData({ title: '', description: '', url: '', courseId: '' });
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
                    <h1 className="text-3xl font-bold">Materials</h1>
                    <p className="text-gray-500 mt-1">Manage course materials and resources</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Material
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingMaterial ? 'Edit Material' : 'Add New Material'}</DialogTitle>
                            <DialogDescription>
                                {editingMaterial ? 'Update material information' : 'Upload a new study material'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Lecture Notes - Week 1"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Introduction to algorithms"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">URL</label>
                                <Input
                                    value={formData.url}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="https://drive.google.com/..."
                                    type="url"
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
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingMaterial ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Materials</CardTitle>
                    <CardDescription>{materials.length} materials available</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium">Title</th>
                                    <th className="text-left p-4 font-medium">Description</th>
                                    <th className="text-left p-4 font-medium">Link</th>
                                    <th className="text-right p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {materials.map((material) => (
                                    <tr key={material.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{material.title}</td>
                                        <td className="p-4 text-sm text-gray-600">{material.description}</td>
                                        <td className="p-4">
                                            <a href={material.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                                                <ExternalLink className="h-3 w-3" />
                                                View
                                            </a>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(material)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(material.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {materials.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No materials found. Add your first material to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
