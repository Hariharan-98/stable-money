import { Navbar } from './Navbar';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-200">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    );
};
