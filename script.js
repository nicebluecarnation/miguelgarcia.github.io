console.log("Hello chat");

// ==CHANGE THEME==
const themeBtn = document.querySelector("#theme-btn");
const html = document.documentElement;

let currentTheme = html.dataset.theme || "light";

if (currentTheme === "dark") {
    themeBtn.textContent = "Light mode";
} else {
    themeBtn.textContent = "Dark mode";
}

function toggleTheme() {
    if (currentTheme === "light") {
        currentTheme = "dark";
        themeBtn.textContent = "Light mode";
    } else {
        currentTheme = "light";
        themeBtn.textContent = "Dark mode";
    }

    html.dataset.theme = currentTheme;

    console.log(`Theme is now ${currentTheme}`);
}

// shorter version: themeBtn.textContent = theme === "dark" ? "Light mode" : "Dark mode";

themeBtn.addEventListener("click", toggleTheme);

// ==SKILLS FILTER==
const filterButtons = document.querySelectorAll(".filter-btn");
// grabs every element with the class .filter-btn
const skillItems = document.querySelectorAll(".skill");
// grabs every element with the class .skill

function shouldShow(skillType, filter) {
    return filter === "all" || skillType === filter;
}

function applyFilter(filter) {

    // show or hide each skill card
    skillItems.forEach((skill) => {
        const visible = shouldShow(skill.dataset.type, filter);
        console.log(skill.classList); // para makita ko sa console wahahaha
        skill.classList.toggle("is-hidden", !visible);
    });

    // update active button state
    filterButtons.forEach((button) => {
        const isActive = button.dataset.filter === filter;
        button.setAttribute("aria-pressed", isActive);
    });
}

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        applyFilter(button.dataset.filter);
    });
});

// ==timer for toast==
const toast = document.querySelector("#toast");
let toastTimer;

function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 1800);
}

// ==promise just incase for error==
async function copyText(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (error) {
        console.log("Copy failed:", error);
        return false;
    }
}

// ==COPY BUTTONS==
const copyButtons = document.querySelectorAll(".copy-btn");

copyButtons.forEach((button) => {
    button.addEventListener("click", async () => {
        const ok = await copyText(button.dataset.copy);
        showToast(ok ? "Copied to clipboard" : "Sensya na boss, copy failed. Select mo nalang yung text and copy it manually.");
    });
});

// ==ACTIVE NAV LINK==
const navLinks = document.querySelectorAll("nav a");
const sections = document.querySelectorAll("main section");
const activeLine = 0.25;   // a section counts once its top passes 25% down the screen

let lockedId = null;
let lockTimer;

function setActiveLink(id) {
    navLinks.forEach((link) => {
        link.setAttribute("aria-current", link.hash === `#${id}`);
    });
}

function updateActiveLink() {
    const atTop = window.scrollY < 50;
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;

    let currentId = sections[0].id;

    if (atBottom) {
        currentId = sections[sections.length - 1].id;
    } else if (!atTop) {
        sections.forEach((section) => {
            if (section.getBoundingClientRect().top <= window.innerHeight * activeLine) {
                currentId = section.id;
            }
        });
    }

    setActiveLink(currentId);
}

function lockActiveLink(id) {
    lockedId = id;
    clearTimeout(lockTimer);
    lockTimer = setTimeout(() => {
        lockedId = null;
    }, 200);
}

function handleScroll() {
    if (lockedId !== null) {
        lockActiveLink(lockedId);   // still gliding from a click: keep the lock alive
    } else {
        updateActiveLink();
    }
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        const id = link.hash.slice(1);
        setActiveLink(id);
        lockActiveLink(id);
    });
});

// if the visitor takes over with the wheel or a finger, release the lock
["wheel", "touchstart"].forEach((type) => {
    window.addEventListener(type, () => {
        lockedId = null;
    }, { passive: true });
});

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("resize", handleScroll);
updateActiveLink();

// ==BACK TO TOP==
const topBtn = document.querySelector("#top-btn");

window.addEventListener("scroll", () => {
    topBtn.classList.toggle("show", window.scrollY > 500);
}, { passive: true });

topBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0 });
});