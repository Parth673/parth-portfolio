import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { GenieEffect } from '../components/home/GenieEffect';
import { RobotSequenceWithCallouts } from '../components/home/RobotSequence';

export function HomePage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <IntroSection />
                <GenieEffect />
                <RobotSequenceWithCallouts />
                <Footer />
            </main>
        </>
    );
}
