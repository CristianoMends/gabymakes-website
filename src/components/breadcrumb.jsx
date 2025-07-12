import { Link, useLocation } from 'react-router-dom';

export default function Breadcrumb() {
    const location = useLocation();

    const pathnames = location.pathname.split('/').filter((x) => x);

    return (
        <nav className="text-sm text-gray-600 w-full text-left px-4 py-2">
            <ul className="flex flex-wrap gap-1">
                <li>
                    <Link to="/" className="hover:underline text-pink-500">Home</Link>
                    {pathnames.length > 0 && <span className="px-1 text-gray-400">&gt;</span>}
                </li>
                {pathnames.map((segment, index) => {
                    const routeTo = '/' + pathnames.slice(0, index + 1).join('/');
                    const isLast = index === pathnames.length - 1;
                    return (
                        <li key={routeTo}>
                            {!isLast ? (
                                <>
                                    <Link to={routeTo} className="hover:underline text-pink-500 capitalize">
                                        {decodeURIComponent(segment)}
                                    </Link>
                                    <span className="px-1 text-gray-400">&gt;</span>
                                </>
                            ) : (
                                <span className="text-gray-500 capitalize">{decodeURIComponent(segment)}</span>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
