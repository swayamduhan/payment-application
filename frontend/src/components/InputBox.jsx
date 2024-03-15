export default function InputBox({ label, placeholder, onChange }){
    return <div>
        <div className="text-sm font-medium text-left py-2">
            {label}
        </div>
        <input onChange={onChange} className="border border-slate-200 w-full rounded px-2 py-1 hover:border-slate-400 transition duration-75 ease-in" placeholder={placeholder} type="text" />
    </div>
}