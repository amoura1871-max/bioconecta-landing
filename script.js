// ==========================================
// SMOOTH SCROLL
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// ANIMAÇÃO DE ENTRADA (Intersection Observer)
// ==========================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Aplica animação em cards e seções
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll(
        '.feature-card, .problem-card, .testimonial-card, .pricing-card, .faq-item'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ==========================================
// HEADER SCROLL (adiciona sombra ao rolar)
// ==========================================
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.08)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ==========================================
// FAQ TOGGLE (expandir/recolher)
// ==========================================
document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    // Começa com respostas visíveis (se quiser expandir/recolher, ajuste aqui)
    answer.style.maxHeight = 'none';
    answer.style.overflow = 'visible';
    
    question.addEventListener('click', () => {
        const isOpen = answer.style.maxHeight !== '0px';
        
        if (isOpen) {
            answer.style.maxHeight = '0px';
            answer.style.overflow = 'hidden';
            answer.style.opacity = '0';
        } else {
            answer.style.maxHeight = answer.scrollHeight + 'px';
            answer.style.overflow = 'visible';
            answer.style.opacity = '1';
        }
    });
});

// ==========================================
// CONTADOR DE CLIENTES (animação de números)
// ==========================================
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16); // 60fps
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString('pt-BR');
    }, 16);
}

// Anima números quando entram na viewport
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            const target = parseInt(entry.target.dataset.target);
            animateCounter(entry.target, target);
            entry.target.dataset.animated = 'true';
        }
    });
}, { threshold: 0.5 });

// Se quiser adicionar contadores animados, use:
// <span class="counter" data-target="2847">0</span>
document.querySelectorAll('.counter').forEach(counter => {
    statsObserver.observe(counter);
});

// ==========================================
// CAPTURA DE EMAIL (lead magnet - placeholder)
// ==========================================
function setupLeadCapture() {
    const forms = document.querySelectorAll('.lead-form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = form.querySelector('input[type="email"]').value;
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.textContent;
            
            // Feedback visual
            btn.textContent = 'Enviando...';
            btn.disabled = true;
            
            // Aqui você conectaria com Supabase/API
            // Por enquanto, só simula
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Sucesso
            btn.textContent = '✅ Enviado!';
            btn.style.background = 'var(--success)';
            
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
                btn.style.background = '';
                form.reset();
            }, 2000);
            
            console.log('Email capturado:', email);
            // TODO: Enviar para Supabase
        });
    });
}

setupLeadCapture();

// ==========================================
// VALIDAÇÃO DE EMAIL
// ==========================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', () => {
        if (input.value && !validateEmail(input.value)) {
            input.style.borderColor = 'var(--warning)';
            // Adicionar mensagem de erro se quiser
        } else {
            input.style.borderColor = '';
        }
    });
});

// ==========================================
// PRELOADER (opcional)
// ==========================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ==========================================
// RASTREAMENTO DE CLIQUES (analytics básico)
// ==========================================
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const btnText = e.target.textContent.trim();
        console.log(`Clique no botão: ${btnText}`);
        
        // TODO: Enviar para Google Analytics
        // gtag('event', 'button_click', { button_name: btnText });
    });
});

// ==========================================
// TOAST NOTIFICATION (sistema de notificação)
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: ${type === 'success' ? 'var(--success)' : 'var(--warning)'};
        color: white;
        padding: 16px 24px;
        border-radius: var(--radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Adiciona animações CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Exemplo de uso:
// showToast('Email cadastrado com sucesso!', 'success');

console.log('🔗 BioConecta - Landing Page carregada!');