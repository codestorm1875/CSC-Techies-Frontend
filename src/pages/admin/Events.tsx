import { useState, useEffect } from 'react';
import { eventsService } from '../../services/admin.service';
import type { Event, CreateEventDto } from '../../services/admin.service';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/skeleton';
import { format } from 'date-fns';

export default function EventsManagement() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);
    const [formData, setFormData] = useState<CreateEventDto>({
        title: '',
        description: '',
        venue: '',
        startDate: '',
        endDate: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const data = await eventsService.getAll();
            setEvents(data);
        } catch (error) {
            toast.error('Failed to fetch events');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingEvent) {
                await eventsService.update(editingEvent.id, formData);
                toast.success('Event updated successfully');
            } else {
                await eventsService.create(formData);
                toast.success('Event created successfully');
            }
            setDialogOpen(false);
            resetForm();
            fetchEvents();
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save event');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (event: Event) => {
        setEditingEvent(event);
        setFormData({
            title: event.title,
            description: event.description,
            venue: event.venue,
            startDate: event.startDate.split('T')[0],
            endDate: event.endDate.split('T')[0],
        });
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        try {
            await eventsService.delete(id);
            toast.success('Event deleted successfully');
            fetchEvents();
        } catch (error) {
            toast.error('Failed to delete event');
        }
    };

    const resetForm = () => {
        setEditingEvent(null);
        setFormData({ title: '', description: '', venue: '', startDate: '', endDate: '' });
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
                    <h1 className="text-3xl font-bold">Events</h1>
                    <p className="text-gray-500 mt-1">Manage department events and activities</p>
                </div>
                <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Event
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
                            <DialogDescription>
                                {editingEvent ? 'Update event information' : 'Create a new event or announcement'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Tech Talk: AI in Education"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Description</label>
                                <Input
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Join us for an exciting discussion..."
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium">Venue</label>
                                <Input
                                    value={formData.venue}
                                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                                    placeholder="Lecture Hall 1"
                                    required
                                />
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
                            <div className="flex gap-2 justify-end">
                                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                    {editingEvent ? 'Update' : 'Create'}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Events</CardTitle>
                    <CardDescription>{events.length} events scheduled</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-4 font-medium">Title</th>
                                    <th className="text-left p-4 font-medium">Description</th>
                                    <th className="text-left p-4 font-medium">Date</th>
                                    <th className="text-left p-4 font-medium">Venue</th>
                                    <th className="text-right p-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.map((event) => (
                                    <tr key={event.id} className="border-b hover:bg-gray-50">
                                        <td className="p-4 font-medium">{event.title}</td>
                                        <td className="p-4 text-sm text-gray-600">{event.description}</td>
                                        <td className="p-4 text-sm">
                                            {format(new Date(event.startDate), 'MMM dd, yyyy')}
                                        </td>
                                        <td className="p-4">{event.venue}</td>
                                        <td className="p-4 text-right">
                                            <div className="flex gap-2 justify-end">
                                                <Button size="sm" variant="outline" onClick={() => handleEdit(event)}>
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button size="sm" variant="outline" onClick={() => handleDelete(event.id)} className="text-red-600 hover:text-red-700">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {events.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                                No events found. Add your first event to get started.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
