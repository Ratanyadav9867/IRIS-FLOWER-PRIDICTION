import React, { useEffect, useRef } from 'react';

/**
 * Reusable BackgroundVideo Component for React / Next.js / Vite apps.
 *
 * @param {Object} props
 * @param {string} [props.src='/videos/background.mp4'] - MP4 video source URL.
 * @param {string} [props.webmSrc='/videos/background.webm'] - WebM video source URL (optional for faster loading).
 * @param {string} [props.poster='/images/background-poster.jpg'] - Static image fallback / pre-load poster.
 * @param {number} [props.overlayOpacity=0.4] - Opacity for the dark contrast overlay (0.0 to 1.0).
 * @param {string} [props.className=''] - Additional CSS classes.
 * @param {boolean} [props.mobilePosterOnly=false] - Whether to use static poster only on mobile viewports.
 * @param {React.ReactNode} [props.children] - Optional child content to render on top of the background.
 */
export default function BackgroundVideo({
  src = '/videos/background.mp4',
  webmSrc = '/videos/background.webm',
  poster = '/images/background-poster.jpg',
  overlayOpacity = 0.4,
  className = '',
  mobilePosterOnly = false,
  children,
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Respect reduced-motion preferences dynamically
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleMotionChange = (e) => {
      if (e.matches) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    };

    if (motionQuery.matches) {
      video.pause();
    } else {
      // Ensure autoplay succeeds on mobile browsers (must be muted)
      video.muted = true;
      video.play().catch((err) => {
        // Autoplay policy or power save mode prevented playback; poster will show
        console.info('Background video autoplay deferred:', err?.message || err);
      });
    }

    if (motionQuery.addEventListener) {
      motionQuery.addEventListener('change', handleMotionChange);
      return () => motionQuery.removeEventListener('change', handleMotionChange);
    }
  }, []);

  return (
    <div
      className={`bg-video-container ${className}`.trim()}
      data-component="background-video"
      style={{
        '--bg-video-overlay-opacity': overlayOpacity,
        backgroundImage: poster ? `url(${poster})` : undefined,
      }}
      aria-hidden="true"
      role="presentation"
    >
      <video
        ref={videoRef}
        className="bg-video-element"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        poster={poster}
      >
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        {src && <source src={src} type="video/mp4" />}
        {poster && <img src={poster} alt="" className="bg-video-fallback-img" loading="lazy" />}
      </video>

      {/* Dark overlay for text/UI contrast */}
      <div
        className="bg-video-overlay"
        style={{
          backgroundColor: `rgba(10, 14, 23, ${overlayOpacity})`,
        }}
      />

      {children && <div className="bg-video-content">{children}</div>}
    </div>
  );
}
