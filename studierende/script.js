// Globale States
let currentCatalog = "";
let currentCourse = "";
let bewerbungenList = []; 

// DOM-Elemente
const viewMain = document.getElementById('view-main');
const viewCatalog = document.getElementById('view-catalog');
const courseDetailView = document.getElementById('course-detail-view');
const detailCourseName = document.getElementById('detail-course-name');
const detailCourseShortDesc = document.getElementById('detail-course-short-desc');
const detailTagsContainer = document.getElementById('detail-tags-container');
const motivationText = document.getElementById('motivation-text');
const emptyAppsText = document.getElementById('empty-apps-text');
const appsDragList = document.getElementById('apps-drag-list');
const myAppsAccordion = document.getElementById('my-applications-accordion');

const filterToggleBtn = document.getElementById('filter-toggle-btn');
const filterDropdownMenu = document.getElementById('filter-dropdown-menu');

const tabBtnBeschreibung = document.getElementById('tab-btn-beschreibung');
const tabBtnBewerben = document.getElementById('tab-btn-bewerben');
const tabContentBeschreibung = document.getElementById('tab-content-beschreibung');
const tabContentBewerben = document.getElementById('tab-content-bewerben');

// Steuerung der Katalog-Accordions auf Seite 2
function toggleAccordion(element) {
    const parent = element.parentElement;
    parent.classList.toggle('open');
    // Falls geschlossen, auch die darin liegende Detailansicht schließen
    if (!parent.classList.contains('open') && parent.contains(courseDetailView)) {
        closeCourseDetails();
    }
}

// Aus-/Einklappen von "Meine Bewerbungen"
document.getElementById('my-apps-header').addEventListener('click', function() {
    myAppsAccordion.classList.toggle('open');
});

// "Zu den Kursen"-Buttons auf der Startseite binden
document.querySelectorAll('.catalog-card .btn-red').forEach(button => {
    button.addEventListener('click', function() {
        const catalogName = this.getAttribute('data-catalog');
        openCatalogPage(catalogName);
    });
});

// Wechselt zur Katalogansicht und klappt den richtigen Katalog auf
function openCatalogPage(targetCatalog) {
    viewMain.classList.add('hidden');
    viewCatalog.classList.remove('hidden');
    closeCourseDetails();

    // Alle Kataloge standardmäßig einklappen
    document.querySelectorAll('#view-catalog .accordion-item').forEach(item => {
        item.classList.remove('open');
    });

    // ID ermitteln und das entsprechende Accordion öffnen
    const formattedId = "accordion-" + targetCatalog.replace(/[\s\/]/g, '-');
    const targetAccordion = document.getElementById(formattedId);
    
    if (targetAccordion) {
        targetAccordion.classList.add('open');
        currentCatalog = targetCatalog;
    }
}

// Zurück zur Hauptübersicht
document.getElementById('btn-back-to-main').addEventListener('click', () => {
    viewCatalog.classList.add('hidden');
    viewMain.classList.remove('hidden');
    filterDropdownMenu.classList.add('hidden');
    closeCourseDetails();
});

// Filter-Dropdown Interaktion
filterToggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    filterDropdownMenu.classList.toggle('hidden');
});

document.addEventListener('click', () => filterDropdownMenu.classList.add('hidden'));
filterDropdownMenu.addEventListener('click', (e) => e.stopPropagation());

// Überwachung der Checkboxen
document.querySelectorAll('#filter-dropdown-menu input').forEach(checkbox => {
    checkbox.addEventListener('change', applyTagFilter);
});

// Dynamischer Filter für alle Kurskarten im System
function applyTagFilter() {
    const activeTags = Array.from(document.querySelectorAll('#filter-dropdown-menu input:checked')).map(cb => cb.value);
    
    document.querySelectorAll('.course-card').forEach(card => {
        const cardTagsString = card.getAttribute('data-tags') || "";
        const cardTags = cardTagsString.split(',');
        const isVisible = cardTags.some(tag => activeTags.includes(tag));

        if (isVisible) {
            card.classList.remove('hidden');
        } else {
            card.classList.add('hidden');
        }
    });
}

// Kursdetails-Trigger binden
document.querySelectorAll('.btn-detail-trigger').forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.course-card');
        const accordionItem = this.closest('.accordion-item');
        const catalogId = accordionItem.id;
        
        // Katalog-Name auflösen
        if (catalogId.includes('Informatikprojekt')) currentCatalog = "Informatikprojekt A/C";
        else if (catalogId.includes('Wahlkatalog-A-C')) currentCatalog = "Wahlkatalog A/C";
        else if (catalogId.includes('Wahlkatalog-B-D')) currentCatalog = "Wahlkatalog B/D";
        else if (catalogId.includes('Medienprojekte')) currentCatalog = "Medienprojekte";

        showCourseDetails(this.getAttribute('data-course'), card, accordionItem);
    });
});

function showCourseDetails(courseName, cardElement, accordionElement) {
    currentCourse = courseName;
    
    // Setze Titel & Formulare zurück
    detailCourseName.innerText = courseName;
    motivationText.value = "";
    
    // Alle Kataloge in den Grundzustand versetzen (Detail-Klassen entfernen)
    document.querySelectorAll('#view-catalog .accordion-item').forEach(item => {
        item.classList.remove('detail-active');
    });

    document.querySelectorAll('#view-catalog .courses-row').forEach(row => {
        row.classList.remove('hidden-by-detail');
    });

    document.querySelectorAll('#view-catalog .course-card').forEach(card => {
        card.classList.remove('active-detail-card');
    });

    // Nur für das aktuelle Accordion die Detail-Ansicht aktivieren
    accordionElement.classList.add('detail-active');
    accordionElement.classList.add('open');
    
    // Die Zeile mit den Kurskarten (.courses-row) innerhalb dieses Katalogs ausblenden
    accordionElement.querySelector('.courses-row')?.classList.add('hidden-by-detail');
    cardElement.classList.add('active-detail-card');
    
    // Tags aus der Karte kopieren
    detailTagsContainer.innerHTML = "";
    const cardTags = cardElement.querySelectorAll('.tag');
    cardTags.forEach(t => {
        const span = document.createElement('span');
        span.className = "tag";
        span.innerText = t.innerText;
        detailTagsContainer.appendChild(span);
    });

    // Dynamische Textzuweisung je nach Kurs
    if (courseName.includes('Künstliche Intelligenz')) {
        detailCourseShortDesc.innerText = "Grundlagen des maschinellen Lernens, Optimierungsverfahren sowie neuronale Netze einfach und verständlich erklärt.";
    } else if (courseName.includes('Web-Apps')) {
        detailCourseShortDesc.innerText = "Entwicklung moderner Fullstack-Webanwendungen im praxisnahen Team mit Node.js und React.";
    } else if (courseName.includes('Virtual Reality')) {
        detailCourseShortDesc.innerText = "Konzeption und native Umsetzung einer immersiven 3D-Lernumgebung mit Unity.";
    } else {
        detailCourseShortDesc.innerText = "In der Vorlesung werden ausgewählte Themen zu interaktiven Systemen behandelt. In Gruppen entstehen kleine Android-Apps (Java/Kotlin).";
    }

    // Platziere das Detail-Element DIREKT in dem aktuellen Katalog unterhalb der Zeilen
    const holder = accordionElement.querySelector('.detail-holder');
    if (holder) {
        holder.appendChild(courseDetailView);
    }

    courseDetailView.classList.remove('hidden');
    switchTab('beschreibung');
    
    // Scroll sanft zum Detailbereich
    courseDetailView.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeCourseDetails() {
    courseDetailView.classList.add('hidden');
    // Setze es zurück an den Body-Anfang/Ende, um Strukturverlust zu vermeiden
    document.body.appendChild(courseDetailView);

    // Alle aktiven Detail-Klassen entfernen, sodass die Kurskarten wieder auftauchen
    document.querySelectorAll('#view-catalog .accordion-item').forEach(item => {
        item.classList.remove('detail-active');
    });

    document.querySelectorAll('#view-catalog .courses-row').forEach(row => {
        row.classList.remove('hidden-by-detail');
    });

    document.querySelectorAll('#view-catalog .course-card').forEach(card => {
        card.classList.remove('active-detail-card');
    });
}

document.getElementById('btn-close-details').addEventListener('click', closeCourseDetails);

// Tab-Umschaltung
function switchTab(tabName) {
    if (tabName === 'beschreibung') {
        tabBtnBeschreibung.classList.add('active');
        tabBtnBewerben.classList.remove('active');
        tabContentBeschreibung.classList.add('active');
        tabContentBewerben.classList.remove('active');
    } else {
        tabBtnBeschreibung.classList.remove('active');
        tabBtnBewerben.classList.add('active');
        tabContentBeschreibung.classList.remove('active');
        tabContentBewerben.classList.add('active');
    }
}
tabBtnBeschreibung.addEventListener('click', () => switchTab('beschreibung'));
tabBtnBewerben.addEventListener('click', () => switchTab('bewerben'));

document.getElementById('btn-save-motivation').addEventListener('click', () => alert("Motivationsschreiben gespeichert!"));

// Absenden & Bewerbungsportal füllen
document.getElementById('btn-submit-application').addEventListener('click', () => {
    if (bewerbungenList.some(app => app.course === currentCourse)) {
        alert("Sie haben sich für diesen Kurs bereits beworben!");
        return;
    }

    bewerbungenList.push({ catalog: currentCatalog, course: currentCourse });
    renderApplications();

    closeCourseDetails();
    viewCatalog.classList.add('hidden');
    viewMain.classList.remove('hidden');
    myAppsAccordion.classList.add('open');
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

function renderApplications() {
    if (bewerbungenList.length === 0) {
        emptyAppsText.classList.remove('hidden');
        appsDragList.classList.add('hidden');
        return;
    }

    emptyAppsText.classList.add('hidden');
    appsDragList.classList.remove('hidden');
    appsDragList.innerHTML = "";

    bewerbungenList.forEach((app, index) => {
        const li = document.createElement('li');
        li.className = "drag-item";
        li.draggable = true;
        li.dataset.index = index;

        li.innerHTML = `
            <div class="drag-item-left">
                <span class="drag-handle">☰</span>
                <div>
                    <strong style="font-size:11px; color:#666; display:block;">${app.catalog}</strong>
                    <span>${app.course}</span>
                </div>
            </div>
            <button class="delete-btn">✕</button>
        `;

        li.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            if (confirm("Sind Sie sicher, dass Sie diese Bewerbung löschen möchten?")) {
                bewerbungenList.splice(index, 1);
                renderApplications();
            }
        });

        li.addEventListener('dragstart', handleDragStart);
        li.addEventListener('dragover', handleDragOver);
        li.addEventListener('drop', handleDrop);
        li.addEventListener('dragend', handleDragEnd);

        appsDragList.appendChild(li);
    });
}

// Drag & Drop Logik
let dragSrcEl = null;
function handleDragStart(e) {
    dragSrcEl = this;
    e.dataTransfer.effectAllowed = 'move';
    this.style.opacity = '0.4';
}
function handleDragOver(e) {
    if (e.preventDefault) e.preventDefault();
    return false;
}
function handleDrop(e) {
    e.stopPropagation();
    if (dragSrcEl !== this) {
        let srcIndex = parseInt(dragSrcEl.dataset.index);
        let targetIndex = parseInt(this.dataset.index);

        const movedItem = bewerbungenList[srcIndex];
        bewerbungenList.splice(srcIndex, 1);
        bewerbungenList.splice(targetIndex, 0, movedItem);

        renderApplications();
    }
    return false;
}
function handleDragEnd() {
    this.style.opacity = '1';
}