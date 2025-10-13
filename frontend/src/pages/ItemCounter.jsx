import { useState, useEffect } from 'react';

export default function ItemCounter() 
{

  const [count, setCount] = useState(0);

  const [items, setItems] = useState([]);

  useEffect(() => {

    const fetchItems = () => {
      const data = ["Apple", "Banana", "Orange"];
      setItems(data);
    };

    fetchItems();
  }, []); 

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Counter: {count}</h1>
      <div className="flex gap-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
        <button
          className="px-4 py-2 bg-gray-500 text-white rounded"
          onClick={() => setCount(0)}
        >
          Reset
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-2">Items:</h2>
      <ul className="list-disc list-inside">
        {items.map((item, index) => (
          <li key={index} className="text-gray-700">{item}</li>
        ))}
      </ul>
    </div>
  );
}
