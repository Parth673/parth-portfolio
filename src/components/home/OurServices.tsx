import React from 'react';

const OurServices = () => {
  const services = [
    {
      title: 'Tutorials',
      image: 'https://images.ctfassets.net/euak42jj5j5q/4vb1pKDnAzBthk3H5ikQuu/e97a04a6a11e6d23199ac52d6bebcc03/Slide-Blue.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/EWkoymANyYxKGT5uwDzeF/74be845e8f910ce42e0b923835b27f23/tutorial-04-compressed.mp4',
      description: 'Tune in for weekly tutorials led by our experts and elevate your production skills.',
      type: 'video',
      background: '#5368efff',
    },
    {
      title: 'Track Feedback',
      image: 'https://images.ctfassets.net/euak42jj5j5q/6H4qgQtxSDAifMv0t2DKr1/1bd252f08ad01aec80d8e941666a3bf1/Fresh-Mix-Pink.png',
      headline: 'Submit your latest tracks for feedback and get expert advice.',
      lists: [
        ['Basic tier:', 'Standard tier:', 'Premium tier:'],
        ['From other members', '2x Track Feedback', '5x Track Feedback']
      ],
      type: 'list',
      background: '#ef5360ff',
    },
    {
      title: 'Discord',
      image: 'https://images.ctfassets.net/euak42jj5j5q/6lqGXvJdx1bcZ9MPDm0V5R/d13c056d77313ca8baa4d52e61f4c2f8/Vinyl-Hand-Lime.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/5obWg8fD7hMq7VavjpNRxv/82825794ed63f0e678162b6ec007c5c6/service-02-compressed.mp4',
      description: 'Join our vibrant community of electronic music producers and make new connections.',
      type: 'video',
      background: '#82ef53ff',
    },
    {
      title: 'Livestreams',
      image: 'https://images.ctfassets.net/euak42jj5j5q/4lokua14O7EPxGfjLXfuPR/837e46afb7a62a7681037e1c8bf03008/Wet-Danceflor.png',
      headline: 'Watch weekly livestreams from our coaches and learn to navigate your journey.',
      lists: [
        ['Track Feedback', 'Ask the Pros'],
        ['Social Media', 'Career Growth']
      ],
      type: 'list',
      background: '#ebd441ff',
    },
    {
      title: 'DJ Promo',
      image: 'https://images.ctfassets.net/euak42jj5j5q/6XscFVAj8Pl6SMoWTshuxj/5a821becba2829b49970144f9cb557fe/Spinning-Vinyl.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/7eMCyGP3ZD2cjGKS0IdKhW/a61aad2652ccd1b873f0914a2de8163a/service-03-compressed.mp4',
      description: 'Submit your music for a chance to be played by top DJs in the industry. /Premium Only',
      type: 'video',
      background: '#ffffffff',
    },
    {
      title: 'Rewards',
      image: 'https://images.ctfassets.net/euak42jj5j5q/15AuPJp1QP5iS2AGlfuM9v/b022bf186abfef3edc78e206a0ea2e93/Hat-Orange.png',
      headline: 'Tune in for weekly giveaways and get exclusive discounts on packs, plugins and more.',
      lists: [
        ['Private Lessons', 'Plugins', 'Services'],
        ['Sample Packs', 'Presets', 'Early Access']
      ],
      type: 'list',
      background: '#f66e33ff',
    }
  ];

  return (
    <section className="services-section">
      <div className="services-container">
        <div className="services-header">
          <div className="header-content">
            <div className="kick-bass-square"></div>
            <h2 className="section-title">
              Our Services
            </h2>
          </div>
        </div>

        <ul className="services-grid">
          {services.map((service, index) => (
            <div
              key={index}
              className="service-card group"
              style={{ '--hover-bg': service.background } as React.CSSProperties}
            >
              <div className="card-bg-image-container">
                <img
                  alt={service.title}
                  src={service.image}
                  className="card-bg-image"
                />
              </div>

              <div className="card-content">
                <div className="card-header">
                  <h3 className="card-title">
                    {service.title}
                  </h3>
                  <svg
                    stroke="currentColor"
                    fill="none"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="card-icon"
                  >
                    <path d="M17 7l-10 10"></path>
                    <path d="M8 7l9 0l0 9"></path>
                  </svg>
                </div>

                <div className="card-details">
                  <div className="card-info">
                    {service.type === 'video' ? (
                      <>
                        <video
                          src={service.video}
                          muted
                          autoPlay
                          loop
                          playsInline
                          className="card-video"
                        ></video>
                        <p className="card-description">
                          {service.description}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="headline-text">
                          {service.headline}
                        </p>
                        <div className="feature-list-container">
                          {service.lists?.map((list, i) => (
                            <ul key={i} className="feature-list">
                              {list.map((item, j) => (
                                <li key={j} className="feature-item">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                  <button className="card-button">
                    More details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default OurServices;
