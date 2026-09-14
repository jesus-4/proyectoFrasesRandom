// ===================================
// CONFIGURATION
// ===================================
const SECRET_PASSWORD = 'casi angeles';

// ===================================
// DOM ELEMENTS
// ===================================
const phrasesContainer = document.getElementById('phrasesContainer');
const newPhraseInput = document.getElementById('newPhrase');
const phraseAuthorInput = document.getElementById('phraseAuthor');
const addPhraseBtn = document.getElementById('addPhraseBtn');
const secretPasswordInput = document.getElementById('secretPassword');
const unlockBtn = document.getElementById('unlockBtn');
const lockBtn = document.getElementById('lockBtn');
const passwordGate = document.getElementById('passwordGate');
const secretContent = document.getElementById('secretContent');
const errorMessage = document.getElementById('errorMessage');
const secretPhrasesContainer = document.getElementById('secretPhrases');

// ===================================
// INITIAL PHRASES
// ===================================
const initialPhrases = [
    {
        text: 'A veces es mejor dejar que el tiempo lo haga, si lo apuras sale crudo.',
        author: ''
    }
];

const secretPhrases = [
    'No todo lo que brilla es oro, pero a veces el oro no brilla.',
    'El secreto de la felicidad no es hacer siempre lo que se quiere, sino querer siempre lo que se hace.',
    'Las mejores cosas de la vida no son cosas.'
];

// ===================================
// STATE
// ===================================
let phrases = JSON.parse(localStorage.getItem('phrases')) || [];
let isUnlocked = false;

// ===================================
// FUNCTIONS
// ===================================

// Render all phrases
function renderPhrases() {
    phrasesContainer.innerHTML = '';

    if (phrases.length === 0) {
        phrasesContainer.innerHTML = `
            <div class="phrase-card">
                <p class="phrase-text">No hay frases aún. ¡Sé el primero en agregar una!</p>
            </div>
        `;
        return;
    }

    phrases.forEach((phrase, index) => {
        const card = document.createElement('div');
        card.className = 'phrase-card';
        card.style.animationDelay = `${index * 0.1}s`;
        card.innerHTML = `
            <p class="phrase-text">${escapeHtml(phrase.text)}</p>
            ${phrase.author ? `<p class="phrase-author">${escapeHtml(phrase.author)}</p>` : ''}
        `;
        phrasesContainer.appendChild(card);
    });
}

// Add new phrase
function addPhrase() {
    const text = newPhraseInput.value.trim();
    const author = phraseAuthorInput.value.trim();

    if (!text) {
        newPhraseInput.focus();
        return;
    }

    const newPhrase = { text, author };
    phrases.push(newPhrase);

    // Save to localStorage
    localStorage.setItem('phrases', JSON.stringify(phrases));

    // Clear inputs
    newPhraseInput.value = '';
    phraseAuthorInput.value = '';

    // Re-render
    renderPhrases();

    // Scroll to new phrase
    phrasesContainer.lastElementChild.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Unlock secret section
function unlockSecret() {
    const password = secretPasswordInput.value.trim();

    if (password === SECRET_PASSWORD) {
        isUnlocked = true;
        passwordGate.style.display = 'none';
        secretContent.classList.remove('hidden');
        renderSecretPhrases();
    } else {
        errorMessage.classList.add('show');
        secretPasswordInput.value = '';
        secretPasswordInput.focus();

        // Remove error message after 3 seconds
        setTimeout(() => {
            errorMessage.classList.remove('show');
        }, 3000);
    }
}

// Lock secret section
function lockSecret() {
    isUnlocked = false;
    passwordGate.style.display = 'block';
    secretContent.classList.add('hidden');
    secretPasswordInput.value = '';
}

// Render secret phrases
function renderSecretPhrases() {
    secretPhrasesContainer.innerHTML = '';
    secretPhrases.forEach(phrase => {
        const item = document.createElement('div');
        item.className = 'secret-phrase-item';
        item.textContent = phrase;
        secretPhrasesContainer.appendChild(item);
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===================================
// EVENT LISTENERS
// ===================================

// Add phrase button
addPhraseBtn.addEventListener('click', addPhrase);

// Enter key to add phrase
newPhraseInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
        addPhrase();
    }
});

// Unlock button
unlockBtn.addEventListener('click', unlockSecret);

// Enter key to unlock
secretPasswordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        unlockSecret();
    }
});

// Lock button
lockBtn.addEventListener('click', lockSecret);

// ===================================
// INITIALIZATION
// ===================================

// Add initial phrases if first time
if (phrases.length === 0) {
    phrases = [...initialPhrases];
    localStorage.setItem('phrases', JSON.stringify(phrases));
}

// Render phrases on load
renderPhrases();
