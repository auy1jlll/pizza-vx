import Link from 'next/link';

export default function Home() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-4xl font-bold mb-4">🍕 Pizza Builder Pro</h1>
      <p className="text-lg mb-6">Create your perfect pizza with fresh ingredients</p>
      <Link 
        href="/pizza-builder"
        className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
      >
        Start Building Your Pizza
      </Link>
    </div>
  );
}
