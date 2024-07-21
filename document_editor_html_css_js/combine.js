var is_safari = navigator.userAgent.indexOf("Safari") > -1 && navigator.userAgent.indexOf("Chrome") == -1;
var avepdfEmbeddedConfig = {}

if (is_safari) {
    if (!document.cookie.match(/^(.*;)?\s*tiredPartyCookiesLoaded\s*=\s*[^;]+(.*)?$/)) {
        var date = new Date();
        date.setTime(date.getTime() + 86400000);

        document.cookie = 'tiredPartyCookiesLoaded=true; expires=' + date.toGMTString(); + '; path=/';
        window.location.replace("https://avepdf.com/en/cookie-loader-for-safari-iframe?callbackUrl=" + window.location.href);
    }
}

loadAvePDFWidget = function (userAccountKey, language, widgetRoute, elementId, baseUrl) {
    var widget = document.getElementById(elementId);

    if (widget) {
        var url = baseUrl || "https://avepdf.com";
        var iframe = '<iframe frameborder="0" width="100%" height="100%" src="' + url + '/' + language + '/' + widgetRoute +
            '?embedded=true&key=' + userAccountKey + '&embeddedElementId=' + elementId + '"></iframe>';
        widget.innerHTML += iframe;
        widget.style.width = '100%';
        avepdfEmbeddedConfig = {
            userAccountKey,
            language,
            widgetRoute,
            url
        }
    }
}

window.addEventListener('message', function (e) {
    if (e.origin !== avepdfEmbeddedConfig.url)
        return;
    if (e.data) {
        try {
            var data = JSON.parse(e.data);
            if (data.elementId) {
                var widget = document.getElementById(data.elementId);

                if (widget) {
                    switch (data.type) {
                        case "heightChanged":
                            if (widget.style.height != data.payload) {
                                widget.style.height = data.payload;
                            }
                            break;
                        case "getOrigin":
                            e.source.postMessage({
                                type: 'getOriginReponse',
                                payload: {
                                    origin: window.location.origin,
                                    pathname: window.location.pathname,
                                    config: avepdfEmbeddedConfig
                                }
                            });
                            break;
                        default:
                            break;
                    }
                }
            }
        } catch {  }
    }
}, false)