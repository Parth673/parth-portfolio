import React from 'react';

const OurServices = () => {
  const services = [
    {
      title: 'Finetuning Models',
      image: '/assets/media/services/ai_sticker.png',
      headline: 'Your Data, Our Expertise: Specialized Intelligence for Your Business',
      lists: [
        ['LLM:', 'OCR:', 'Embedding Models:'],
        ['Qwen3.5, Gemma3', 'DeepSeek OCR', 'embeddinggemma-300m']
      ],
      type: 'list',
      background: '#8a53efff',
    },
    {
      title: 'CAD',
      image: '/assets/media/services/cad_sticker.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/EWkoymANyYxKGT5uwDzeF/74be845e8f910ce42e0b923835b27f23/tutorial-04-compressed.mp4',
      description: 'Mechanical, Electrical, Product Design, 3D Modeling',
      type: 'video',
      background: '#5394efff',
    },
    {
      title: 'Software Dev',
      image: '/assets/media/services/code_sticker.png',
      headline: 'Enterprise-Grade Cybersecurity Solutions with AI integration',
      lists: [
        ['Autonomous:', 'Enterprise:', 'Embedded Firmware:'],
        ['AI Agents', 'Scalable', 'Efficient']
      ],
      type: 'list',
      background: '#91ff24ff',
    },
    {
      title: 'Animation',
      image: '/assets/media/services/camera_sticker.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/5obWg8fD7hMq7VavjpNRxv/82825794ed63f0e678162b6ec007c5c6/service-02-compressed.mp4',
      description: 'We specialize in 2D and 3D animation videos that captivate customers.',
      type: 'video',
      background: '#ff5900ff',
    },
    {
      title: 'VAPT (CyberSec)',
      image: '/assets/media/services/bug_sticker.png',
      headline: 'Don\'t Be the Next Breach Headline. Comprehensive VAPT Services',
      lists: [
        ['Application PenTest', 'Network Security'],
        ['API Security', 'Reporting']
      ],
      type: 'list',
      background: '#ff1e4bff',
    },
    {
      title: 'Tutor',
      image: '/assets/media/services/pencil_sticker.png',
      video: '//videos.ctfassets.net/euak42jj5j5q/7eMCyGP3ZD2cjGKS0IdKhW/a61aad2652ccd1b873f0914a2de8163a/service-03-compressed.mp4',
      description: 'Submit your music for a chance to be played by top DJs in the industry. /Premium Only',
      type: 'video',
      background: '#edcabaff',
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
