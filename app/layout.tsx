import Navbar from './components/Navbar';

export const metadata = {
  title: 'Euro Painters Management System',
  description: 'Manage jobs, employees, customers, and timesheets',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
