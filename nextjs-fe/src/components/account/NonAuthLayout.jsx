import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { authService } from 'services';

export { NonAuthLayout };

function NonAuthLayout({ children }) {
    const router = useRouter();

    useEffect(() => {
        // redirect to home if already logged in
        if (authService.userValue) {
            router.push('/');
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {children}
        </>
    );
}