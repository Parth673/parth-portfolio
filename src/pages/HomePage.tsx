import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { ClientsSection } from '../components/home/ClientsSection';
import { GenieEffect } from '../components/home/GenieEffect';
import OurServices from '../components/home/OurServices';

export function HomePage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <IntroSection />
                <GenieEffect />
                <OurServices />
                <ClientsSection />
                <Footer />
            </main>
        </>
    );
}
