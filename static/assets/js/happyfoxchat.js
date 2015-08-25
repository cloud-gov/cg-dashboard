<!-- HappyFox Live Chat Script -->
  window.HFCHAT_CONFIG = {
    EMBED_TOKEN: "995a2db0-46bf-11e5-986c-5b521052aa24",
    ACCESS_TOKEN: "a5ba09020f0d40ae9eb91e299800cd47",
    HOST_URL: "https://www.happyfoxchat.com",
    ASSETS_URL: "https://d1l7z5ofrj6ab8.cloudfront.net/visitor"
};

(function() {
    var scriptTag = document.createElement('script');
    scriptTag.type = 'text/javascript';
    scriptTag.async = true;
    scriptTag.src = window.HFCHAT_CONFIG.ASSETS_URL + '/js/widget-loader.js';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(scriptTag, s);
})();
<!--End of HappyFox Live Chat Script-->
