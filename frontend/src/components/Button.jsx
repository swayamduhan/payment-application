export default function Button({ label, handleClick }) {
    return <button onClick={handleClick} type="button"  className="my-2 border w-full bg-gray-800 hover:bg-gray-900 transition-colors text-white rounded-lg py-2 font-semibold">{label}</button>
}