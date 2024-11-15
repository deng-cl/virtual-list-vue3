export function throttle(func, limit, trailing) {
    let inThrottle;
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (trailing === undefined) trailing = true;
        if (!inThrottle) {
            func.apply(context, args);
            lastRan = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if (trailing && (Date.now() - lastRan >= limit)) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
                inThrottle = false;
            }, limit - (Date.now() - lastRan));
        }
    }
}