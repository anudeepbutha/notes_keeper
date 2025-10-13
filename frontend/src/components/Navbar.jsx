import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="p-4 bg-gray-100 flex gap-4">
      <Link to="/" className="text-blue-600 hover:underline">Home</Link>
      <Link to="/about" className="text-blue-600 hover:underline">About</Link>
      <Link to="/contact" className="text-blue-600 hover:underline">Contact</Link>
      <Link to="/itemCounter" className="text-blue-600 hover:underline">ItemCounter</Link>
    </nav>
  );
}
