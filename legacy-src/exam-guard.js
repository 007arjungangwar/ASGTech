// Shared fullscreen and focus-loss guard for ASG Tech exams.
(function () {
    function requestFullscreen(target = document.documentElement) {
        if (document.fullscreenElement) return Promise.resolve(true);
        if (!target || typeof target.requestFullscreen !== "function") {
            return Promise.resolve(false);
        }

        return target.requestFullscreen()
            .then(() => true)
            .catch(() => false);
    }

    function exitFullscreen() {
        if (!document.fullscreenElement || typeof document.exitFullscreen !== "function") {
            return Promise.resolve(false);
        }

        return document.exitFullscreen()
            .then(() => true)
            .catch(() => false);
    }

    function createGuard(options = {}) {
        let active = false;
        let submitted = false;
        let ignoreUntil = 0;

        const getReason = (reason) => String(reason || "focus-lost");

        function trigger(reason, respectIgnore = false) {
            if (!active || submitted || (respectIgnore && Date.now() < ignoreUntil)) return;
            submitted = true;
            active = false;
            removeListeners();
            if (typeof options.onViolation === "function") {
                options.onViolation(getReason(reason));
            }
        }

        function handleVisibilityChange() {
            if (document.visibilityState === "hidden") {
                trigger("tab-or-window-changed");
            }
        }

        function handleBlur() {
            window.setTimeout(() => {
                if (!document.hasFocus() || document.visibilityState === "hidden") {
                    trigger("window-focus-lost", true);
                }
            }, 180);
        }

        function handleFullscreenChange() {
            if (!document.fullscreenElement) {
                trigger("fullscreen-exited");
            }
        }

        function addListeners() {
            document.addEventListener("visibilitychange", handleVisibilityChange);
            document.addEventListener("fullscreenchange", handleFullscreenChange);
            window.addEventListener("blur", handleBlur);
            window.addEventListener("pagehide", () => trigger("page-left"), { once: true });
        }

        function removeListeners() {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            window.removeEventListener("blur", handleBlur);
        }

        async function start() {
            submitted = false;
            ignoreUntil = Date.now() + 2200;
            const fullscreenStarted = await requestFullscreen();
            if (options.requireFullscreen && !fullscreenStarted) {
                return false;
            }
            active = true;
            addListeners();
            return true;
        }

        function stop() {
            active = false;
            submitted = true;
            removeListeners();
        }

        return {
            start,
            stop,
            isActive: () => active && !submitted,
            submit: (reason) => trigger(reason || "manual-submit")
        };
    }

    window.ASGExamGuard = {
        requestFullscreen,
        exitFullscreen,
        create: createGuard
    };
}());
