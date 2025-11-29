import api from '../lib/axios';

export interface Course {
    id: string;
    courseCode: string;
    courseTitle: string;
    units: number;
    semesterId: string;
    createdAt: string;
}

export interface CreateCourseDto {
    courseCode: string;
    courseTitle: string;
    units: number;
}

export interface UpdateCourseDto {
    courseCode?: string;
    courseTitle?: string;
    units?: number;
}

export const coursesService = {
    async getAll(): Promise<Course[]> {
        const { data } = await api.get('/courses');
        return data.data;
    },

    async getById(id: string): Promise<Course> {
        const { data } = await api.get(`/courses/${id}`);
        return data.data;
    },

    async create(course: CreateCourseDto): Promise<Course> {
        const { data } = await api.post('/courses', course);
        return data.data;
    },

    async update(id: string, course: UpdateCourseDto): Promise<Course> {
        const { data } = await api.put(`/courses/${id}`, course);
        return data.data;
    },

    async delete(id: string): Promise<void> {
        await api.delete(`/courses/${id}`);
    },
};
