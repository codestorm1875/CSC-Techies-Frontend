import api from '../lib/axios';

export interface Material {
    id: string;
    title: string;
    description: string;
    url: string;
    courseId: string;
    semesterId: string;
    createdAt: string;
}

export interface CreateMaterialDto {
    title: string;
    description: string;
    url: string;
    courseId: string;
}

export const materialsService = {
    async getAll(): Promise<Material[]> {
        const { data } = await api.get('/materials');
        return data.data;
    },

    async create(material: CreateMaterialDto): Promise<Material> {
        const { data } = await api.post('/materials', material);
        return data.data;
    },

    async update(id: string, material: Partial<CreateMaterialDto>): Promise<Material> {
        const { data } = await api.put(`/materials/${id}`, material);
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/materials/${id}`);
    },
};

export interface Exam {
    id: string;
    title: string;
    courseId: string;
    startDate: string;
    endDate: string;
    venue: string;
    semesterId: string;
}

export interface CreateExamDto {
    title: string;
    courseId: string;
    startDate: string;
    endDate: string;
    venue: string;
}

export const examsService = {
    async getAll(): Promise<Exam[]> {
        const { data } = await api.get('/exams');
        return data.data;
    },

    async create(exam: CreateExamDto): Promise<Exam> {
        const { data } = await api.post('/exams', exam);
        return data.data;
    },

    async update(id: string, exam: Partial<CreateExamDto>): Promise<Exam> {
        const { data } = await api.put(`/exams/${id}`, exam);
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/exams/${id}`);
    },
};

export interface Event {
    id: string;
    title: string;
    description: string;
    venue: string;
    startDate: string;
    endDate: string;
    semesterId: string;
}

export interface CreateEventDto {
    title: string;
    description: string;
    venue: string;
    startDate: string;
    endDate: string;
}

export const eventsService = {
    async getAll(): Promise<Event[]> {
        const { data } = await api.get('/events');
        return data.data;
    },

    async create(event: CreateEventDto): Promise<Event> {
        const { data } = await api.post('/events', event);
        return data.data;
    },

    async update(id: string, event: Partial<CreateEventDto>): Promise<Event> {
        const { data } = await api.put(`/events/${id}`, event);
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/events/${id}`);
    },
};
