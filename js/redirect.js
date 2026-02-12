/**
 * CANONICAL REDIRECT
 * Enforces dictuzz.me as the primary domain.
 * Redirects from:
 * - www.dictuzz.me -> dictuzz.me
 * - dictuzz.github.io -> dictuzz.me
 */

(function () {
    // Current hostname
    const host = window.location.hostname;

    // Desired hostname
    const canonical = "dictuzz.me";

    // Allow localhost for development
    if (host === "localhost" || host === "127.0.0.1") {
        return;
    }

    // Check if we are on the wrong domain
    if (host !== canonical) {
        // Build the new URL
        const newUrl = "https://" + canonical + window.location.pathname + window.location.search + window.location.hash;

        // redirect
        window.location.replace(newUrl);
    }
})();
