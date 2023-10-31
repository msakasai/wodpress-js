(function (location, document) {
    'use strict';

    const NON_BLANK_TARGET_URLS = [
        'https://www.d-make.co.jp/blog',
        'https://d-make.co.jp/blog',
        '/blog'
    ];

    const ADD_UTM_PARAM_URLS = [
        'https://www.d-make.co.jp',
        'https://d-make.co.jp',
        'https://chat.remocla.online',
        'https://www.skill-sheet.com',
        'https://topvoice.biz'
    ];

    function hasQueryString(hrefString) {
        const url = new URL(hrefString);
        return url.searchParams.toString() !== '';
    }

    function hasUtmParams(hrefString) {
        const url = new URL(hrefString);
        return url.searchParams.get('utm_source') !== null;
    }

    function getUtmContent() {
        const pathSegments = location.pathname.split('/');
        return pathSegments.length > 5 ? pathSegments.slice(0, 5).join('/') : location.pathname;
    }

    function getUtmParams(hasQueryStringFlag) {
        const utmParams = {
            utm_source: 'd-make.co.jp_blog',
            utm_medium: 'blog',
            utm_campaign: 'dmake_blog',
            utm_content: getUtmContent()
        }
        const utmQueryStrings = new URLSearchParams(utmParams).toString();
        return `${hasQueryStringFlag ? '&' : '?'}${utmQueryStrings}`;
    }

    function processAnchors() {
        document.querySelectorAll('a').forEach(function(anchorElement) {
            const hrefString = anchorElement.href;

            if (!hrefString || NON_BLANK_TARGET_URLS.some(url => hrefString.startsWith(url))) {
                return;
            }

            anchorElement.setAttribute('target', '_blank');
            anchorElement.setAttribute('rel', 'noreferrer noopener');
            
            if (ADD_UTM_PARAM_URLS.some(url => hrefString.startsWith(url)) && (!hasQueryString(hrefString) || !hasUtmParams(hrefString))) {
                anchorElement.setAttribute('href', `${hrefString}${getUtmParams(hasQueryString(hrefString))}`);
            }
        });
    }

    try {
        processAnchors();
    } catch (e) {
        console.error('custom_enqueue.js error', e);
    }
})(location, document);
