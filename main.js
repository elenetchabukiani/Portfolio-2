/**
 * ელენე ჭაბუკიანის პორტფოლიო - ძირითადი JavaScript სკრიპტი
 * უზრუნველყოფს მობილურ ნავიგაციას (ბურგერ მენიუ), ხელმისაწვდომობას და Toast შეტყობინებებს.
 */

document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
});

/**
 * მობილური ბურგერ ნავიგაციის ინიციალიზაცია
 */
function initMobileNavigation() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const iconOpen = document.getElementById('menu-icon-open');
    const iconClose = document.getElementById('menu-icon-close');
    const header = document.querySelector('header');

    if (!menuBtn || !mobileMenu) return;

    // მენიუს გახსნის/დახურვის ფუნქცია
    function setMenuState(open) {
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'მენიუს დახურვა' : 'მენიუს გახსნა');

        if (open) {
            mobileMenu.classList.remove('hidden');
            if (iconOpen) iconOpen.classList.add('hidden');
            if (iconClose) iconClose.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
            if (iconOpen) iconOpen.classList.remove('hidden');
            if (iconClose) iconClose.classList.add('hidden');
        }
    }

    // ბურგერ ღილაკზე დაჭერა
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        setMenuState(!isOpen);
    });

    // მენიუს შიგნით ნებისმიერ ბმულზე დაჭერისას მენიუს დახურვა
    const menuLinks = mobileMenu.querySelectorAll('a');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            setMenuState(false);
        });
    });

    // გარეთ დაკლიკებისას დახურვა
    document.addEventListener('click', (e) => {
        const isClickInside = header && header.contains(e.target);
        const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
        if (!isClickInside && isOpen) {
            setMenuState(false);
        }
    });

    // Escape ღილაკზე დაჭერისას დახურვა
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const isOpen = menuBtn.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                setMenuState(false);
                menuBtn.focus();
            }
        }
    });

    // ეკრანის ზომის შეცვლისას (დიდ რეზოლუციაზე გადასვლა) მენიუს ავტომატური დახურვა
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            setMenuState(false);
        }
    });
}

/**
 * გლობალური Toast შეტყობინებების ჩვენება
 * @param {string} message - შეტყობინების ტექსტი
 * @param {'success'|'error'|'info'} type - შეტყობინების ტიპი
 */
function showToast(message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full px-4 pointer-events-none';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-2xl border backdrop-blur-xl transition-all duration-300 transform translate-y-4 opacity-0 text-sm';

    let iconSvg = '';
    if (type === 'success') {
        toast.classList.add('bg-navy-900/95', 'border-emerald-500/40', 'text-slate-100');
        iconSvg = `<svg class="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"></path></svg>`;
    } else if (type === 'error') {
        toast.classList.add('bg-navy-900/95', 'border-rose-500/40', 'text-slate-100');
        iconSvg = `<svg class="w-5 h-5 text-rose-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>`;
    } else {
        toast.classList.add('bg-navy-900/95', 'border-cyan-500/40', 'text-slate-100');
        iconSvg = `<svg class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`;
    }

    toast.innerHTML = `
        ${iconSvg}
        <div class="flex-1 font-medium leading-relaxed">${message}</div>
        <button type="button" class="text-slate-400 hover:text-white transition-colors p-1" aria-label="დახურვა">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.addEventListener('click', () => {
        removeToast(toast);
    });

    container.appendChild(toast);

    // ანიმაციის გაშვება
    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-4', 'opacity-0');
        toast.classList.add('translate-y-0', 'opacity-100');
    });

    // ავტომატური გაქრობა 4 წამში
    setTimeout(() => {
        removeToast(toast);
    }, 4000);

    function removeToast(el) {
        el.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => {
            if (el.parentNode) el.parentNode.removeChild(el);
        }, 300);
    }
}

