const fs = require('fs');
const code = fs.readFileSync('src/app/page.tsx', 'utf8');

// The goal is to re-order the sections inside the <main> block.
// The main block starts around `<main>` and ends at `</main>`.
const mainStart = code.indexOf('<main>');
const mainEnd = code.indexOf('</main>', mainStart);

if (mainStart === -1 || mainEnd === -1) {
    console.error("Could not find main tags");
    process.exit(1);
}

const beforeMain = code.slice(0, mainStart + 6);
const afterMain = code.slice(mainEnd);
let mainContent = code.slice(mainStart + 6, mainEnd);

// Instead of regex, we'll manually extract chunks based on their well-known HTML structure.
const extractChunk = (startMarker, endMarker) => {
    const start = mainContent.indexOf(startMarker);
    if (start === -1) return '';
    const end = mainContent.indexOf(endMarker, start) + endMarker.length;
    const chunk = mainContent.slice(start, end);
    mainContent = mainContent.slice(0, start) + mainContent.slice(end);
    return chunk;
};

// 1. Hero
const hero = extractChunk('        {/* ACT I:', '        </section>');
// 2. Philosophy / About
const about = extractChunk('        {/* ACT II: Narrative Perspective', '        </section>');
// 3. Kinetic Band
const kinetic = extractChunk('        {/* Kinetic Mechanical Tape', '        </div>\n        </div>');
// 4. Instruments
const instruments = extractChunk('        {/* ACT II.5:', '        </section>');
// 5. Work
const work = extractChunk('        {/* ACT III:', '        </section>');
// 6. Manifesto
const manifesto = extractChunk('        {/* ACT IV:', '        </section>');
// 7. Capabilities
const capabilities = extractChunk('        {/* ACT V:', '        </section>');
// 8. Contact
const contact = extractChunk('        {/* ACT VI:', '        </section>');

// Transform Data
// Rename Nav Items
let newCode = beforeMain + '\n' +
    hero + '\n' +
    work + '\n' +
    capabilities + '\n' +
    kinetic + '\n' +
    manifesto + '\n' +
    instruments + '\n' +
    about + '\n' +
    contact + '\n' +
    afterMain;

// Perform text replacements for the prompt requirements
newCode = newCode.replace(
    'const navItems = ["About", "Instruments", "Work", "Manifesto", "Capabilities", "Contact"];',
    'const navItems = ["Work", "Capabilities", "Principles", "Instruments", "Contact"];'
);

// Manifesto -> Principles
newCode = newCode.replace('id="manifesto"', 'id="principles"');
newCode = newCode.replace('href="#manifesto"', 'href="#principles"');
newCode = newCode.replace('ANTI-AI ARCHITECTURAL AXIOMS', 'ENGINEERING AXIOMS');
newCode = newCode.replace('01 / ZERO GENERIC PURPLE GRADIENTS', '01 / PURPOSE-DRIVEN ARCHITECTURE');
newCode = newCode.replace('04 / REAL HUMAN CRAFT', '04 / HUMAN-CENTERED INTERFACES');
newCode = newCode.replace('{"Manifesto"}', '{"Principles"}'); // just in case

// Fix pdf data
newCode = newCode.replace('150% increase in client inquiries', 'modern brand presence and optimized SEO CMS');

fs.writeFileSync('src/app/page.tsx', newCode);
console.log("Reordered and saved");
