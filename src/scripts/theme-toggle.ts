/**
 * Circular reveal theme toggle animation
 * 
 * This script provides a smooth circular reveal animation when toggling themes.
 * It supports two approaches:
 * 1. View Transitions API (preferred) - if browser supports it
 * 2. Clip-path overlay (fallback) - for browsers without View Transitions API
 */

const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";
const ANIMATION_DURATION = 600; // milliseconds
const EASING = "ease-in-out";

/**
 * Calculate the distance from a point to the farthest corner of the viewport
 * This is used to determine the final radius for the circular reveal animation.
 * 
 * Math explanation:
 * - We need to find the maximum distance from the button center to any viewport corner
 * - Viewport corners are at: (0,0), (width,0), (0,height), (width,height)
 * - Distance formula: sqrt((x2-x1)² + (y2-y1)²)
 * - We calculate distance to all 4 corners and take the maximum
 */
function getFarthestCornerDistance(
    centerX: number,
    centerY: number,
    viewportWidth: number,
    viewportHeight: number
): number {
    const corners = [
        [0, 0], // top-left
        [viewportWidth, 0], // top-right
        [0, viewportHeight], // bottom-left
        [viewportWidth, viewportHeight], // bottom-right
    ];

    let maxDistance = 0;
    for (const [cornerX, cornerY] of corners) {
        const dx = cornerX - centerX;
        const dy = cornerY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        maxDistance = Math.max(maxDistance, distance);
    }

    return maxDistance;
}

/**
 * Get the background color for a specific theme
 * Temporarily applies the theme to read the CSS variable value
 */
function getThemeBackgroundColor(theme: string): string {
    const root = document.documentElement;
    const currentTheme = root.getAttribute("data-theme");

    // Temporarily set theme to read the color
    root.setAttribute("data-theme", theme);

    // Force a reflow to ensure styles are computed
    void root.offsetHeight;

    // Read the CSS custom property
    const computedStyle = window.getComputedStyle(root);
    const bgColor = computedStyle.getPropertyValue("--background").trim() ||
        (theme === DARK ? "#212737" : "#fae0a1");

    // Restore original theme
    if (currentTheme) {
        root.setAttribute("data-theme", currentTheme);
    } else {
        root.removeAttribute("data-theme");
    }

    // Force another reflow
    void root.offsetHeight;

    return bgColor;
}

/**
 * Check if clip-path is supported
 */
function isClipPathSupported(): boolean {
    return CSS.supports("clip-path", "circle(50%)");
}

/**
 * Check if View Transitions API is supported
 */
function isViewTransitionSupported(): boolean {
    return typeof document.startViewTransition === "function";
}

/**
 * Apply theme change immediately (before animation)
 * Uses existing theme API if available to avoid duplicating logic
 */
function applyTheme(theme: string): void {
    // Update theme value in the global API
    if (window.theme) {
        window.theme.setTheme(theme);
        // Use existing reflectPreference if available, otherwise apply manually
        if (window.theme.reflectPreference) {
            window.theme.reflectPreference();
        } else {
            document.documentElement.setAttribute("data-theme", theme);
            document.querySelector("#theme-btn")?.setAttribute("aria-label", theme);
        }
    } else {
        // Fallback if theme API not available
        document.documentElement.setAttribute("data-theme", theme);
        document.querySelector("#theme-btn")?.setAttribute("aria-label", theme);
    }

    // Persist to localStorage
    localStorage.setItem(THEME, theme);

    // Update theme-color meta tag
    const body = document.body;
    if (body) {
        requestAnimationFrame(() => {
            const computedStyles = window.getComputedStyle(body);
            const bgColor = computedStyles.backgroundColor;
            document
                .querySelector("meta[name='theme-color']")
                ?.setAttribute("content", bgColor);
        });
    }
}

/**
 * Circular reveal animation using clip-path overlay
 * This is the fallback method when View Transitions API is not available
 */
function animateWithClipPath(
    button: HTMLElement,
    newTheme: string,
    onComplete: () => void
): void {
    // Get button position and size
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate final radius (distance to farthest corner)
    const finalRadius = getFarthestCornerDistance(
        centerX,
        centerY,
        viewportWidth,
        viewportHeight
    );

    // Get background color for new theme without applying it yet
    const bgColor = getThemeBackgroundColor(newTheme);

    // Create overlay element
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = bgColor;
    overlay.style.pointerEvents = "none";
    overlay.style.zIndex = "9999";
    overlay.style.clipPath = `circle(0px at ${centerX}px ${centerY}px)`;
    overlay.style.transition = `clip-path ${ANIMATION_DURATION}ms ${EASING}`;

    // Append to body
    document.body.appendChild(overlay);

    // Force a reflow to ensure initial state is applied
    void overlay.offsetHeight;

    // Apply theme and start animation in the next frame
    requestAnimationFrame(() => {
        // Apply theme change
        applyTheme(newTheme);

        // Start animation in the next frame to ensure theme is applied
        requestAnimationFrame(() => {
            overlay.style.clipPath = `circle(${finalRadius}px at ${centerX}px ${centerY}px)`;
        });
    });

    // Clean up after animation
    overlay.addEventListener(
        "transitionend",
        () => {
            overlay.remove();
            onComplete();
        },
        { once: true }
    );
}

/**
 * Circular reveal animation using View Transitions API
 * This is the preferred method when available
 */
function animateWithViewTransition(
    button: HTMLElement,
    newTheme: string,
    onComplete: () => void
): void {
    // Get button position and size
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate final radius (distance to farthest corner)
    const finalRadius = getFarthestCornerDistance(
        centerX,
        centerY,
        viewportWidth,
        viewportHeight
    );

    // Create a style element for the circular reveal animation
    const styleId = "theme-transition-style";
    let style = document.getElementById(styleId) as HTMLStyleElement;
    if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
    }

    // Set up CSS for circular reveal using View Transitions
    // The ::view-transition-new(root) represents the new theme state
    // We animate it with a circular clip-path that expands from the button center
    style.textContent = `
    ::view-transition-old(root) {
      z-index: 1;
    }
    
    ::view-transition-new(root) {
      z-index: 2;
      clip-path: circle(0px at ${centerX}px ${centerY}px);
      animation: circle-reveal ${ANIMATION_DURATION}ms ${EASING} forwards;
    }
    
    @keyframes circle-reveal {
      to {
        clip-path: circle(${finalRadius}px at ${centerX}px ${centerY}px);
      }
    }
  `;

    // Start view transition
    const transition = document.startViewTransition(() => {
        applyTheme(newTheme);
    });

    // Clean up after transition
    transition.finished.finally(() => {
        // Remove the style element after a short delay to ensure animation completes
        setTimeout(() => {
            const styleElement = document.getElementById(styleId);
            if (styleElement) {
                styleElement.remove();
            }
        }, ANIMATION_DURATION + 100);
        onComplete();
    });
}

/**
 * Toggle theme with circular reveal animation
 */
export function toggleThemeWithAnimation(): void {
    const button = document.querySelector("#theme-btn") as HTMLElement;
    if (!button) return;

    const currentTheme = window.theme?.getTheme() ||
        document.documentElement.getAttribute("data-theme") ||
        LIGHT;
    const newTheme = currentTheme === LIGHT ? DARK : LIGHT;

    // Prevent multiple simultaneous animations
    if (button.hasAttribute("data-animating")) {
        return;
    }
    button.setAttribute("data-animating", "true");

    const onComplete = () => {
        button.removeAttribute("data-animating");
    };

    // Use View Transitions API if available, otherwise fallback to clip-path
    if (isViewTransitionSupported()) {
        animateWithViewTransition(button, newTheme, onComplete);
    } else if (isClipPathSupported()) {
        animateWithClipPath(button, newTheme, onComplete);
    } else {
        // No animation support, just toggle theme
        applyTheme(newTheme);
        onComplete();
    }
}
