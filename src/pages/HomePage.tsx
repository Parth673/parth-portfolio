import { Navigation } from '../components/layout/Navigation';
import { Footer } from '../components/layout/Footer';
import { HeroSection } from '../components/home/HeroSection';
import { IntroSection } from '../components/home/IntroSection';
import { GenieEffect } from '../components/home/GenieEffect';
import OurServices from '../components/home/OurServices';
import { RobotSequenceWithCallouts } from '../components/home/RobotSequence';

export function HomePage() {
    return (
        <>
            <Navigation />
            <main>
                <HeroSection />
                <IntroSection />
                <GenieEffect />
                <OurServices />
                {/* <RobotSequenceWithCallouts /> */}
                <Footer />
            </main>
        </>
    );
}
