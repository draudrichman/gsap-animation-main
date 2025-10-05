export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-stone-800 mb-4">
          404 - Page Not Found
        </h1>
        <p className="text-stone-600">
          The page you're looking for doesn't exist.
        </p>
      </div>
    </div>
  );
}
