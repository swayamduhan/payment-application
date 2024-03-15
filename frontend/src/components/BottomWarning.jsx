import { Link } from 'react-router-dom'

export default function BottomWarning({ label, buttonText, path }) {
    return <div className='mb-1 flex justify-center text-sm'>
        <div>
            {label}
        </div>
        <Link className='pl-1 text-blue-900 underline' to={path}>
            {buttonText}
        </Link>
    </div>
}