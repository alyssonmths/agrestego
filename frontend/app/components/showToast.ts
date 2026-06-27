export default function showToast(message: string, duration = 3000) {
    if (typeof document === 'undefined') return;

    const containerId = 'agrestego-toast-container';
    let container = document.getElementById(containerId);
    if (!container) {
        container = document.createElement('div');
        container.id = containerId;
        container.style.position = 'fixed';
        container.style.zIndex = '9999';
        container.style.right = '16px';
        container.style.top = '16px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '8px';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.background = '#16a34a';
    toast.style.color = 'white';
    toast.style.padding = '10px 14px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
    toast.style.fontSize = '14px';
    toast.style.maxWidth = '320px';
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 200ms ease, transform 200ms ease';
    toast.style.transform = 'translateY(-6px)';

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-6px)';
        setTimeout(() => {
            toast.remove();
            if (container && container.childElementCount === 0) container.remove();
        }, 200);
    }, duration);
}
