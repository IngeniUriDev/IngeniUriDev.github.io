// =======================================
//  CRUD JS – IngeniUriDev
//  Cambia API_URL cuando tengas tu URL de Render
// =======================================

const API_URL = "https://cv-api-dpx3.onrender.com"; // URL del servicio en Render

// Mostrar URL en footer
document.getElementById("api-link").href = API_URL + "/docs";
document.getElementById("api-link").textContent = API_URL + "/docs";

// Referencias al DOM
const form        = document.getElementById("contact-form");
const formTitle   = document.getElementById("form-title");
const submitBtn   = document.getElementById("submit-btn");
const cancelBtn   = document.getElementById("cancel-btn");
const contactId   = document.getElementById("contact-id");
const grid        = document.getElementById("contacts-grid");
const countBadge  = document.getElementById("contact-count");
const statusMsg   = document.getElementById("status-msg");

// ── Mostrar mensaje de estado ──────────────────────────────────
function showStatus(msg, type = "success") {
  statusMsg.textContent = msg;
  statusMsg.className = `status-msg ${type}`;
  setTimeout(() => { statusMsg.className = "status-msg hidden"; }, 3500);
}

// ── Obtener iniciales para avatar ──────────────────────────────
function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
}

// ── Cargar contactos ───────────────────────────────────────────
async function loadContacts() {
  grid.innerHTML = `<div class="loading-state"><div class="spinner"></div><p>Cargando contactos...</p></div>`;
  try {
    const res  = await fetch(`${API_URL}/contacts`);
    if (!res.ok) throw new Error("Error al cargar");
    const data = await res.json();
    countBadge.textContent = data.length;

    if (data.length === 0) {
      grid.innerHTML = `<div class="empty-state"><div class="icon">📭</div><p>No hay contactos aún.<br>¡Agrega el primero!</p></div>`;
      return;
    }

    grid.innerHTML = data.map(c => `
      <div class="contact-card" id="card-${c.id}">
        <div class="contact-avatar">${getInitials(c.nombre)}</div>
        <div class="contact-info">
          <div class="contact-name">${c.nombre}</div>
          <div class="contact-email">${c.email}</div>
          <div class="contact-meta">${[c.telefono, c.empresa].filter(Boolean).join(" · ") || "Sin datos adicionales"}</div>
        </div>
        <div class="contact-actions">
          <button class="btn-edit" onclick="editContact(${c.id}, '${escStr(c.nombre)}', '${escStr(c.email)}', '${escStr(c.telefono||"")}', '${escStr(c.empresa||"")}')">✏️ Editar</button>
          <button class="btn-delete" onclick="deleteContact(${c.id})">🗑️ Borrar</button>
        </div>
      </div>
    `).join("");
  } catch (err) {
    grid.innerHTML = `<div class="empty-state"><div class="icon">⚠️</div><p>No se pudo conectar con la API.<br><small>${err.message}</small></p></div>`;
  }
}

// Helper: escapar comillas simples para atributos HTML inline
function escStr(s) { return String(s).replace(/'/g, "\\'"); }

// ── Crear / Actualizar contacto ────────────────────────────────
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    nombre:   document.getElementById("nombre").value.trim(),
    email:    document.getElementById("email").value.trim(),
    telefono: document.getElementById("telefono").value.trim() || null,
    empresa:  document.getElementById("empresa").value.trim() || null,
  };

  try {
    let res;
    if (contactId.value) {
      res = await fetch(`${API_URL}/contacts/${contactId.value}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showStatus("✅ Contacto actualizado correctamente");
    } else {
      res = await fetch(`${API_URL}/contacts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showStatus("✅ Contacto creado correctamente");
    }
    if (!res.ok) throw new Error("Error en la operación");
    resetForm();
    loadContacts();
  } catch (err) {
    showStatus("❌ " + err.message, "error");
  }
});

// ── Editar contacto ────────────────────────────────────────────
function editContact(id, nombre, email, telefono, empresa) {
  contactId.value = id;
  document.getElementById("nombre").value   = nombre;
  document.getElementById("email").value    = email;
  document.getElementById("telefono").value = telefono;
  document.getElementById("empresa").value  = empresa;
  formTitle.textContent  = "✏️ Editar Contacto";
  submitBtn.textContent  = "Actualizar";
  cancelBtn.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Borrar contacto ────────────────────────────────────────────
async function deleteContact(id) {
  if (!confirm("¿Seguro que quieres borrar este contacto?")) return;
  try {
    const res = await fetch(`${API_URL}/contacts/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("No se pudo borrar");
    showStatus("🗑️ Contacto eliminado");
    loadContacts();
  } catch (err) {
    showStatus("❌ " + err.message, "error");
  }
}

// ── Cancelar edición ───────────────────────────────────────────
cancelBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  contactId.value       = "";
  formTitle.textContent = "➕ Nuevo Contacto";
  submitBtn.textContent = "Guardar Contacto";
  cancelBtn.classList.add("hidden");
}

// ── Inicializar ────────────────────────────────────────────────
loadContacts();
