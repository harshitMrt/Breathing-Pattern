export default function UserForm() {
  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
      <label>Stress Level</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mt-1 mb-4"
      />
      <label>Sleep Quality</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mt-1 mb-4"
      />
      <label>Goal</label>
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded mt-1 mb-4"
      />
      <button className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition">
        Submit
      </button>
    </div>
  );
}
