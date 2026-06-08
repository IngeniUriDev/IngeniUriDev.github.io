document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME MANAGEMENT (Dark / Light Theme Toggle)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Retrieve theme from localStorage or fallback to system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', initialTheme);

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a micro-animation effect to the button when clicked
        themeToggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 150);
    });

    // ==========================================================================
    // PRINT / PDF EXPORT
    // ==========================================================================
    const printBtn = document.getElementById('print-btn');
    printBtn.addEventListener('click', () => {
        window.print();
    });
});
