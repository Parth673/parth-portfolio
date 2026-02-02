import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const CLIENTS = [
  { name: 'MetricDust', logo: '/assets/media/clients/metricdust.png' },
  { name: 'Hireko', logo: '/assets/media/clients/hireko.png' },
  { name: 'Digident', logo: '/assets/media/clients/digident.png' },
];

export function ClientsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Use GSAP for smooth infinite scroll if preferred, 
    // but CSS marquee is often smoother for simple brand layouts.
    // I'll stick to CSS for the base and add some GSAP for entrance.

    gsap.fromTo('.clients-title',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        scrollTrigger: {
          trigger: '.clients-section',
          start: 'top 80%',
        }
      }
    );
  }, []);

  // Double the clients for seamless loop
  const marqueeClients = [...CLIENTS, ...CLIENTS, ...CLIENTS, ...CLIENTS];

  return (
    <section className="clients-section" style={{
      padding: '1rem 0',
      background: 'transparent',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <style>
        {`
          @keyframes slide {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          
          @keyframes blink-cursor {
            from, to { opacity: 1; }
            50% { opacity: 0; }
          }
          
          .clients-header {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-bottom: 5rem;
            color: #000000;
          }

          .clients-header-content {
            display: flex;
            align-items: center;
            gap: 0.375rem;
          }

          .clients-cursor {
            display: inline-block;
            width: 0.6rem;
            height: 1.5rem;
            background-color: #000000;
            margin-right: 0.5rem;
            animation: blink-cursor 0.8s step-end infinite;
          }

          .clients-title {
            text-transform: uppercase;
            letter-spacing: 0.05em;
            font-size: 1.5rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            font-family: 'Inter', sans-serif;
            color: #000000;
          }

          .clients-marquee-container {
            position: relative;
            padding: 0;
          }

          .clients-marquee {
            display: flex;
            width: fit-content;
            animation: slide 25s linear infinite;
            gap: 120px;
            align-items: center;
          }
          
          .client-item {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 200px;
            height: 70px;
            transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 1;
          }
          
          .client-item:hover {
            transform: scale(1.05);
          }
          
          .client-logo {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
          }

          @media (max-width: 768px) {
            .client-item {
              width: 150px;
              height: 50px;
              gap: 60px;
            }
            .clients-title {
              font-size: 1.2rem;
            }
          }
        `}
      </style>

      <div className="container" style={{ position: 'relative', maxWidth: '1536px', margin: '0 auto' }}>
        <div className="clients-header">
          <div className="clients-header-content">
            <span className="clients-cursor"></span>
            <h2 className="clients-title">Worked For</h2>
          </div>
        </div>

        <div className="clients-marquee-container">
          <div className="clients-marquee">
            {marqueeClients.map((client, index) => (
              <div key={index} className="client-item" style={{ cursor: 'none' }}>
                <img src={client.logo} alt={client.name} className="client-logo" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
