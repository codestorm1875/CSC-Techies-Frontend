import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Skeleton } from '../components/ui/skeleton';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="space-y-4 w-full max-w-md p-8">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />;
    }

    return <>{children}</>;
};
