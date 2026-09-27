import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollToTop() {
    const { pathname } = useLocation();

    useLayoutEffect(() => {
        // Prevent browser's automatic scroll restoration from restoring intermediate scroll positions
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // Scroll to top immediately before paint
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;

        // Clear ScrollTrigger's scroll memory to avoid stale coordinate calculations
        ScrollTrigger.clearScrollMemory?.();

        // Refresh ScrollTrigger calculations after paint
        const timer = setTimeout(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTop = 0;
            document.body.scrollTop = 0;
            ScrollTrigger.refresh();
        }, 50);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
