// ==========================================
// SUPABASE CONFIGURATION
// ==========================================

const SUPABASE_URL = 'https://misbpisiyxsyxkwhttxh.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_MthEVIBk0iRKcuHvVy5Mlg_o0GMMFsB';
const ADMIN_PASSWORD = 'WEGC0928cbbee';

let supabase;

// Initialize Supabase
if (typeof window.supabase !== 'undefined') {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
    console.error('Supabase library not loaded');
}

// ==========================================
// STATE MANAGEMENT
// ==========================================

let currentPage = 'homePage';
let currentSlide = 0;
let slideInterval;
let isAdmin = false;
let certificates = [];

// ==========================================
// PAGE NAVIGATION
// ==========================================

function navigateToPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        currentPage = pageId;

        // Update navbar links
        updateNavLinks();

        // Load data if admin page
        if (pageId === 'adminDashboardPage') {
            loadDashboard();
        }
    }
}

function updateNavLinks() {
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-admin)');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
}

// ==========================================
// HERO SLIDER
// ==========================================

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.getElementById('sliderIndicators');

    // Create indicators
    slides.forEach((_, index) => {
        const indicator = document.createElement('button');
        indicator.addEventListener('click', () => goToSlide(index));
        indicators.appendChild(indicator);
    });

    // Set first slide and indicator as active
    updateSlider();

    // Auto-play
    startSlideshow();
}

function updateSlider() {
    const slides = document.querySelectorAll('.slide');
    const indicators = document.querySelectorAll('.slider-indicators button');

    slides.forEach((slide, index) => {
        slide.classList.remove('active');
        if (index === currentSlide) {
            slide.classList.add('active');
        }
    });

    indicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentSlide) {
            indicator.classList.add('active');
        }
    });
}

function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide + 1) % slides.length;
    updateSlider();
}

function prevSlide() {
    const slides = document.querySelectorAll('.slide');
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    updateSlider();
}

function goToSlide(index) {
    currentSlide = index;
    updateSlider();
    resetSlideshow();
}

function startSlideshow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function resetSlideshow() {
    clearInterval(slideInterval);
    startSlideshow();
}

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.target);
                animateValue(entry.target, 0, target, 2000);
                observer.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => observer.observe(stat));
}

function animateValue(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= end) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// ==========================================
// CERTIFICATE VERIFICATION
// ==========================================

async function verifyCertificate(certNumber) {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized');
        }

        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .eq('certificate_number', certNumber.toUpperCase())
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                return null; // Certificate not found
            }
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error verifying certificate:', error);
        throw error;
    }
}

function showVerificationModal(certificate) {
    const modal = document.getElementById('verifyModal');
    const modalHeader = document.getElementById('modalHeader');
    const modalIcon = document.getElementById('modalIcon');
    const modalIconWrapper = document.getElementById('modalIconWrapper');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (certificate) {
        // Success
        modalIconWrapper.classList.add('success');
        modalIconWrapper.classList.remove('error');
        modalIcon.className = 'fas fa-check-circle';
        modalTitle.textContent = 'Certificate Verified Successfully';

        modalBody.innerHTML = `
            <div class="cert-detail">
                <strong>Certificate Number:</strong>
                <span>${certificate.certificate_number}</span>
            </div>
            <div class="cert-detail">
                <strong>Student Name:</strong>
                <span>${certificate.student_name}</span>
            </div>
            <div class="cert-detail">
                <strong>Course:</strong>
                <span>${certificate.course_name}</span>
            </div>
            <div class="cert-detail">
                <strong>Duration:</strong>
                <span>${certificate.duration}</span>
            </div>
            <div class="cert-detail">
                <strong>Institution:</strong>
                <span>${certificate.institution_name}</span>
            </div>
            <div class="cert-detail">
                <strong>Issue Date:</strong>
                <span>${formatDate(certificate.issue_date)}</span>
            </div>
        `;
    } else {
        // Error
        modalIconWrapper.classList.add('error');
        modalIconWrapper.classList.remove('success');
        modalIcon.className = 'fas fa-times-circle';
        modalTitle.textContent = 'Certificate Not Found';

        modalBody.innerHTML = `
            <p style="text-align: center; color: var(--color-gray); padding: var(--space-4);">
                The certificate number you entered could not be found in our database. 
                Please check the number and try again.
            </p>
        `;
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('verifyModal');
    modal.classList.remove('active');
}

// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

function checkAuth() {
    isAdmin = sessionStorage.getItem('wegc_admin') === 'true';
    return isAdmin;
}

function login(password) {
    if (password === ADMIN_PASSWORD) {
        sessionStorage.setItem('wegc_admin', 'true');
        isAdmin = true;
        return true;
    }
    return false;
}

function logout() {
    sessionStorage.removeItem('wegc_admin');
    isAdmin = false;
    navigateToPage('homePage');
}

// ==========================================
// DASHBOARD FUNCTIONS
// ==========================================

async function loadDashboard() {
    await loadCertificates();
    updateStats();
}

async function loadCertificates() {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized');
        }

        const { data, error } = await supabase
            .from('certificates')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        certificates = data || [];
        renderTable(certificates);
    } catch (error) {
        console.error('Error loading certificates:', error);
        showAlert('formAlert', 'Failed to load certificates. Please check your Supabase configuration.', 'error');
    }
}

function renderTable(data) {
    const tableWrapper = document.getElementById('tableWrapper');

    if (!data || data.length === 0) {
        tableWrapper.innerHTML = '<p class="table-loading">No certificates found.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Certificate #</th>
                <th>Student Name</th>
                <th>Course</th>
                <th>Duration</th>
                <th>Institution</th>
                <th>Issue Date</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${data.map(cert => `
                <tr>
                    <td>${cert.certificate_number}</td>
                    <td>${cert.student_name}</td>
                    <td>${cert.course_name}</td>
                    <td>${cert.duration}</td>
                    <td>${cert.institution_name}</td>
                    <td>${formatDate(cert.issue_date)}</td>
                    <td>
                        <div class="table-actions">
                            <button class="action-btn edit" onclick="editCertificate('${cert.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete" onclick="deleteCertificate('${cert.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;

    tableWrapper.innerHTML = '';
    tableWrapper.appendChild(table);
}

function updateStats() {
    const totalCerts = certificates.length;
    const uniqueStudents = new Set(certificates.map(c => c.student_name)).size;
    const uniqueInstitutions = new Set(certificates.map(c => c.institution_name)).size;

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const thisMonth = certificates.filter(c => {
        const issueDate = new Date(c.issue_date);
        return issueDate.getMonth() === currentMonth && issueDate.getFullYear() === currentYear;
    }).length;

    document.getElementById('statTotalCerts').textContent = totalCerts;
    document.getElementById('statTotalStudents').textContent = uniqueStudents;
    document.getElementById('statInstitutions').textContent = uniqueInstitutions;
    document.getElementById('statThisMonth').textContent = thisMonth;
}

async function saveCertificate(certData) {
    try {
        if (!supabase) {
            throw new Error('Supabase not initialized');
        }

        const editMode = document.getElementById('editMode').value === 'true';
        const editId = document.getElementById('editId').value;

        if (editMode && editId) {
            // Update existing certificate
            const { error } = await supabase
                .from('certificates')
                .update(certData)
                .eq('id', editId);

            if (error) throw error;

            showAlert('formAlert', 'Certificate updated successfully!', 'success');
        } else {
            // Insert new certificate
            const { error } = await supabase
                .from('certificates')
                .insert([certData]);

            if (error) throw error;

            showAlert('formAlert', 'Certificate added successfully!', 'success');
        }

        // Reset form and reload
        resetForm();
        await loadCertificates();
        updateStats();
    } catch (error) {
        console.error('Error saving certificate:', error);
        if (error.code === '23505') {
            showAlert('formAlert', 'This certificate number already exists.', 'error');
        } else {
            showAlert('formAlert', 'Failed to save certificate. Please try again.', 'error');
        }
    }
}

async function deleteCertificate(id) {
    if (!confirm('Are you sure you want to delete this certificate?')) {
        return;
    }

    try {
        if (!supabase) {
            throw new Error('Supabase not initialized');
        }

        const { error } = await supabase
            .from('certificates')
            .delete()
            .eq('id', id);

        if (error) throw error;

        showAlert('formAlert', 'Certificate deleted successfully!', 'success');
        await loadCertificates();
        updateStats();
    } catch (error) {
        console.error('Error deleting certificate:', error);
        showAlert('formAlert', 'Failed to delete certificate. Please try again.', 'error');
    }
}

function editCertificate(id) {
    const cert = certificates.find(c => c.id === id);
    if (!cert) return;

    // Populate form
    document.getElementById('certNumber').value = cert.certificate_number;
    document.getElementById('studentName').value = cert.student_name;
    document.getElementById('courseName').value = cert.course_name;
    document.getElementById('duration').value = cert.duration;
    document.getElementById('institutionName').value = cert.institution_name;
    document.getElementById('issueDate').value = cert.issue_date;

    // Set edit mode
    document.getElementById('editMode').value = 'true';
    document.getElementById('editId').value = id;

    // Update form title
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-edit"></i> Edit Certificate';
    document.getElementById('btnSubmitForm').innerHTML = '<i class="fas fa-save"></i> <span>Update Certificate</span>';

    // Scroll to form
    document.querySelector('.dashboard-card').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('certForm').reset();
    document.getElementById('editMode').value = 'false';
    document.getElementById('editId').value = '';
    document.getElementById('formTitle').innerHTML = '<i class="fas fa-plus-circle"></i> Add New Certificate';
    document.getElementById('btnSubmitForm').innerHTML = '<i class="fas fa-save"></i> <span>Save Certificate</span>';
}

function searchCertificates(query) {
    if (!query) {
        renderTable(certificates);
        return;
    }

    const filtered = certificates.filter(cert => {
        const searchStr = query.toLowerCase();
        return (
            cert.certificate_number.toLowerCase().includes(searchStr) ||
            cert.student_name.toLowerCase().includes(searchStr) ||
            cert.course_name.toLowerCase().includes(searchStr) ||
            cert.institution_name.toLowerCase().includes(searchStr)
        );
    });

    renderTable(filtered);
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function showAlert(elementId, message, type) {
    const alertElement = document.getElementById(elementId);
    alertElement.className = `alert ${type} show`;
    alertElement.textContent = message;

    setTimeout(() => {
        alertElement.classList.remove('show');
    }, 5000);
}

// ==========================================
// EVENT LISTENERS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize slider
    initSlider();

    // Initialize stats animation
    animateStats();

    // Navbar toggle (mobile)
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Navigation links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);

            // Close mobile menu
            navMenu.classList.remove('active');

            // Scroll to section
            if (currentPage === 'homePage') {
                const section = document.getElementById(targetId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                navigateToPage('homePage');
                setTimeout(() => {
                    const section = document.getElementById(targetId);
                    if (section) {
                        section.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            }
        });
    });

    // Admin access via URL hash (#admin or #adminLogin)
    function handleAdminAccess() {
        const hash = window.location.hash;
        if (hash === '#admin' || hash === '#adminLogin') {
            if (checkAuth()) {
                navigateToPage('adminDashboardPage');
            } else {
                navigateToPage('adminLoginPage');
            }
        }
    }

    // Check for admin access on page load
    handleAdminAccess();

    // Listen for hash changes
    window.addEventListener('hashchange', handleAdminAccess);

    // Hero slider controls
    const prevSlideBtn = document.getElementById('prevSlide');
    const nextSlideBtn = document.getElementById('nextSlide');

    if (prevSlideBtn) {
        prevSlideBtn.addEventListener('click', () => {
            prevSlide();
            resetSlideshow();
        });
    }

    if (nextSlideBtn) {
        nextSlideBtn.addEventListener('click', () => {
            nextSlide();
            resetSlideshow();
        });
    }

    // Verify form
    const verifyForm = document.getElementById('verifyForm');
    if (verifyForm) {
        verifyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const certInput = document.getElementById('certInput');
            const certNumber = certInput.value.trim();

            if (!certNumber) return;

            try {
                const certificate = await verifyCertificate(certNumber);
                showVerificationModal(certificate);
                certInput.value = '';
            } catch (error) {
                showVerificationModal(null);
            }
        });
    }

    // Modal close
    const modalClose = document.getElementById('modalClose');
    const modalOverlay = document.getElementById('modalOverlay');

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }

    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;

            if (login(password)) {
                navigateToPage('adminDashboardPage');
                document.getElementById('adminPassword').value = '';
            } else {
                showAlert('loginAlert', 'Invalid password. Please try again.', 'error');
            }
        });
    }

    // Logout button
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', logout);
    }

    // Certificate form
    const certForm = document.getElementById('certForm');
    if (certForm) {
        certForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const certData = {
                certificate_number: document.getElementById('certNumber').value.toUpperCase(),
                student_name: document.getElementById('studentName').value,
                course_name: document.getElementById('courseName').value,
                duration: document.getElementById('duration').value,
                institution_name: document.getElementById('institutionName').value,
                issue_date: document.getElementById('issueDate').value
            };

            await saveCertificate(certData);
        });
    }

    // Clear form button
    const btnClearForm = document.getElementById('btnClearForm');
    if (btnClearForm) {
        btnClearForm.addEventListener('click', resetForm);
    }

    // Search input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchCertificates(e.target.value);
        });
    }

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Check if admin is already logged in
    if (checkAuth()) {
        console.log('Admin already logged in');
    }
});

// Make functions globally available
window.editCertificate = editCertificate;
window.deleteCertificate = deleteCertificate;
