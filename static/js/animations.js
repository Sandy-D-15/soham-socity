/**
 * Housing Society Portal - Unified Motion & Animation Engine
 * File: static/js/animations.js
 * Pure vanilla JavaScript, 0 dependencies, < 6KB footprint.
 */

(function () {
    'use strict';

    // 1. Mark JavaScript as enabled on <html> for progressive enhancement
    document.documentElement.classList.add('js');

    // 2. Check accessibility preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 3. Indian Currency and Number Formatter
    function formatIndianNumber(value, decimals) {
        return value.toLocaleString('en-IN', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    // 4. EaseOutExpo easing function
    function easeOutExpo(x) {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    // 5. Number Count-Up Engine
    function initCountUp() {
        const countElements = document.querySelectorAll('[data-count]');
        if (!countElements.length) return;

        if (prefersReducedMotion) return; // Skip animation if user prefers reduced motion

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCount(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        countElements.forEach(el => observer.observe(el));
    }

    function animateCount(el) {
        const originalText = el.textContent.trim();
        // Extract currency / sign prefix, numeric value, and optional suffix
        // Matches e.g. "₹1,25,000.00", "₹1,25,000", "95.5%", "15 / 50 Flats", "-₹2,500"
        const match = originalText.match(/^([^\d\-]*\-?[^\d]*)?([\d,]+(\.\d+)?)(.*)$/);
        if (!match) return;

        const prefix = match[1] || '';
        const numStr = match[2].replace(/,/g, '');
        const targetNum = parseFloat(numStr);
        const suffix = match[4] || '';
        const hasDecimals = match[2].includes('.');
        const decimals = hasDecimals ? match[2].split('.')[1].length : 0;

        if (isNaN(targetNum)) return;

        const duration = 1200; // ~1.2s
        const startTime = performance.now();

        function update(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutExpo(progress);
            const currentVal = targetNum * easedProgress;

            el.textContent = prefix + formatIndianNumber(currentVal, decimals) + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = originalText; // Ensure exact final text
            }
        }

        requestAnimationFrame(update);
    }

    // 6. Stagger Delay Variables (--i, --row-i)
    function initStagger() {
        // Stagger for cards and stat grids
        const cardGroups = document.querySelectorAll('.stats-grid, [data-stagger], .content-body');
        cardGroups.forEach(group => {
            const cards = group.querySelectorAll(':scope > .glass-card, :scope > .stat-card, :scope > .stat-card-link');
            cards.forEach((card, index) => {
                card.style.setProperty('--i', index);
            });
        });

        // Stagger for table rows
        const tables = document.querySelectorAll('.data-table tbody');
        tables.forEach(tbody => {
            const rows = tbody.querySelectorAll('tr');
            rows.forEach((row, index) => {
                row.style.setProperty('--row-i', Math.min(index, 20)); // Cap to avoid long delays
            });
        });
    }

    // 7. Scroll Reveal Observer
    function initScrollReveal() {
        const revealElements = document.querySelectorAll('[data-reveal]');
        if (!revealElements.length) return;

        if (prefersReducedMotion) {
            revealElements.forEach(el => el.classList.add('is-visible'));
            return;
        }

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => observer.observe(el));
    }

    // 8. Progress Bars Grow on Reveal
    function initProgressVisuals() {
        const progressFills = document.querySelectorAll('[data-progress]');
        if (!progressFills.length) return;

        progressFills.forEach(bar => {
            const targetPct = bar.getAttribute('data-progress');
            bar.style.transform = 'scaleX(0)';
            bar.style.transformOrigin = 'left';
        });

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    bar.style.transform = 'scaleX(1)';
                    obs.unobserve(bar);
                }
            });
        }, { threshold: 0.15 });

        progressFills.forEach(bar => observer.observe(bar));
    }

    // 9. Desktop-Only 3D Tilt (Max 6 degrees)
    function initCardTilt() {
        if (prefersReducedMotion) return;
        if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
        if (window.innerWidth <= 750) return;

        const tiltCards = document.querySelectorAll('.glass-card:not([data-no-tilt]), .stat-card:not([data-no-tilt]), .stat-card-link:not([data-no-tilt])');

        tiltCards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                const tiltX = (y * -6).toFixed(2);
                const tiltY = (x * 6).toFixed(2);

                card.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }

    // 10. Material Ripple Effect for .btn
    function initRipple() {
        if (prefersReducedMotion) return;

        document.addEventListener('click', e => {
            const btn = e.target.closest('.btn:not(.no-ripple)');
            if (!btn) return;

            const rect = btn.getBoundingClientRect();
            const circle = document.createElement('span');
            const diameter = Math.max(rect.width, rect.height);
            const radius = diameter / 2;

            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const existingRipple = btn.querySelector('.ripple');
            if (existingRipple) existingRipple.remove();

            btn.appendChild(circle);

            setTimeout(() => {
                circle.remove();
            }, 600);
        });
    }

    // 11. Toast Notifications System
    function initToasts() {
        const flashContainer = document.querySelector('.flash-container');
        if (!flashContainer) return;

        // Enhance flash container into floating toast container
        flashContainer.classList.add('toast-container');
        const alerts = flashContainer.querySelectorAll('.flash-alert');

        alerts.forEach((alert, index) => {
            alert.classList.add('toast-item');
            alert.style.animationDelay = `${index * 80}ms`;

            // Add progress bar
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            alert.appendChild(progress);

            // Close on click / swipe
            function closeToast() {
                alert.classList.add('toast-leave');
                setTimeout(() => alert.remove(), 280);
            }

            alert.addEventListener('click', closeToast);

            // Auto dismiss after 5s
            setTimeout(() => {
                if (alert.parentElement) closeToast();
            }, 5000);
        });
    }

    // 12. Theme Toggle Smooth Crossfade (No Flash)
    function initThemeCrossfade() {
        const toggleBtns = document.querySelectorAll('.theme-toggle-btn, .theme-toggle-floating');
        toggleBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                document.documentElement.classList.add('theme-transitioning');
                setTimeout(() => {
                    document.documentElement.classList.remove('theme-transitioning');
                }, 320);
            });
        });
    }

    // 13. Sticky Table Header Scroll Shadow
    function initTableScroll() {
        const tableContainers = document.querySelectorAll('.table-container');
        tableContainers.forEach(container => {
            container.addEventListener('scroll', () => {
                if (container.scrollTop > 4) {
                    container.classList.add('has-scroll');
                } else {
                    container.classList.remove('has-scroll');
                }
            }, { passive: true });
        });
    }

    // 14. Form Validation Shake & Submit Spinner
    function initFormMotion() {
        document.querySelectorAll('form').forEach(form => {
            // Shake invalid inputs on submit attempt
            form.addEventListener('invalid', e => {
                const target = e.target;
                target.classList.add('form-shake');
                setTimeout(() => target.classList.remove('form-shake'), 450);
            }, true);

            // Enhanced Submit State
            form.addEventListener('submit', function (e) {
                const submitBtn = form.querySelector('button[type="submit"]:not(.no-spin)');
                if (submitBtn && !submitBtn.disabled) {
                    const originalHTML = submitBtn.innerHTML;
                    submitBtn.dataset.originalHtml = originalHTML;

                    // Insert spinner
                    const spinner = document.createElement('span');
                    spinner.className = 'btn-spinner';
                    submitBtn.prepend(spinner);

                    // Defer disabling to allow standard submit
                    setTimeout(() => {
                        submitBtn.disabled = true;
                    }, 20);

                    // Safety re-enable after 6s in case form doesn't navigate
                    setTimeout(() => {
                        submitBtn.disabled = false;
                        if (submitBtn.dataset.originalHtml) {
                            submitBtn.innerHTML = submitBtn.dataset.originalHtml;
                        }
                    }, 6000);
                }
            });
        });
    }

    // 15. Mobile Drawer Smooth Backdrop
    function initMobileDrawer() {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('appSidebar');
        if (!toggleBtn || !sidebar) return;

        let backdrop = document.querySelector('.sidebar-backdrop');
        if (!backdrop) {
            backdrop = document.createElement('div');
            backdrop.className = 'sidebar-backdrop';
            document.body.appendChild(backdrop);
        }

        function toggleDrawer(open) {
            if (open) {
                sidebar.classList.add('mobile-open');
                backdrop.classList.add('active');
            } else {
                sidebar.classList.remove('mobile-open');
                backdrop.classList.remove('active');
            }
        }

        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = sidebar.classList.contains('mobile-open');
            toggleDrawer(!isOpen);
        });

        backdrop.addEventListener('click', () => toggleDrawer(false));
    }

    // Initialize all modules when DOM is ready
    function initAll() {
        initStagger();
        initScrollReveal();
        initCountUp();
        initProgressVisuals();
        initCardTilt();
        initRipple();
        initToasts();
        initThemeCrossfade();
        initTableScroll();
        initFormMotion();
        initMobileDrawer();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
