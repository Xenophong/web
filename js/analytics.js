/**
 * Analytics Tracking for GitHub Pages
 * Tracks page views and CV downloads
 */

(function() {
    'use strict';

    // Configuration
    const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX'; // Replace with your Google Analytics ID
    const ENABLE_GA = false; // Set to true after adding your GA ID
    
    // Check if GA is loaded (will be available after page load)
    function isGALoaded() {
        return typeof gtag !== 'undefined' && ENABLE_GA;
    }

    /**
     * Track CV Download
     */
    function trackCVDownload(location) {
        const eventData = {
            event: 'cv_download',
            location: location || 'unknown',
            timestamp: new Date().toISOString(),
            url: window.location.href
        };

        // Send to Google Analytics if enabled
        if (isGALoaded()) {
            gtag('event', 'cv_download', {
                'event_category': 'Downloads',
                'event_label': location,
                'value': 1
            });
        }

        // Log to console (for debugging - remove in production if desired)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log('CV Download tracked:', eventData);
        }

        // Optional: Send to custom endpoint (you'd need to set this up)
        // fetch('/api/track', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(eventData)
        // }).catch(err => console.error('Tracking error:', err));
    }

    /**
     * Track page view
     */
    function trackPageView() {
        if (isGALoaded()) {
            gtag('config', GA_MEASUREMENT_ID, {
                page_path: window.location.pathname + window.location.search,
                page_title: document.title
            });
        }
    }

    /**
     * Track email clicks
     */
    function trackEmailClick() {
        if (isGALoaded()) {
            gtag('event', 'email_click', {
                'event_category': 'Contact',
                'event_label': 'Email Link Clicked'
            });
        }
    }

    /**
     * Track social media clicks
     */
    function trackSocialClick(platform) {
        if (isGALoaded()) {
            gtag('event', 'social_click', {
                'event_category': 'Social',
                'event_label': platform
            });
        }
    }

    // Track page view on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', trackPageView);
    } else {
        trackPageView();
    }

    // Track CV download clicks
    document.addEventListener('click', function(e) {
        // Check if clicked element or parent is a CV download link
        const target = e.target.closest('a[href*="Xenophon_CV.pdf"], a[href*="CV.pdf"]');
        if (target) {
            // Determine location (which section the download came from)
            let location = 'unknown';
            const section = target.closest('section');
            if (section && section.id) {
                location = section.id;
            } else {
                // Check if it's in intro or about section
                const introSection = target.closest('#intro');
                const aboutSection = target.closest('#about');
                if (introSection) location = 'intro';
                else if (aboutSection) location = 'about';
            }
            trackCVDownload(location);
        }

        // Track email clicks
        if (e.target.closest('a[href^="mailto:"]')) {
            trackEmailClick();
        }

        // Track social media clicks
        const socialLink = e.target.closest('a[href*="github.com"], a[href*="linkedin.com"], a[href*="bsky.app"], a[href*="substack.com"]');
        if (socialLink) {
            const href = socialLink.getAttribute('href');
            let platform = 'unknown';
            if (href.includes('github.com')) platform = 'GitHub';
            else if (href.includes('linkedin.com')) platform = 'LinkedIn';
            else if (href.includes('bsky.app')) platform = 'Bluesky';
            else if (href.includes('substack.com')) platform = 'Substack';
            trackSocialClick(platform);
        }
    });

    // Expose tracking functions globally for manual tracking if needed
    window.trackCVDownload = trackCVDownload;
    window.trackPageView = trackPageView;

})();

