export const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="h-14 w-full flex items-center justify-center px-4 md:px-6">
        <p className="text-sm font-semibold">
          © {currentYear} - TRAILAPP
        </p>
      </footer>
    );
};
