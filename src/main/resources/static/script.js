const API = "/api/students";
const form = document.getElementById("studentForm");
const table = document.getElementById("studentTable");
const emptyState = document.getElementById("emptyState");
const message = document.getElementById("message");

document.addEventListener("DOMContentLoaded", loadStudents);
form.addEventListener("submit", saveStudent);
document.getElementById("resetBtn").addEventListener("click", resetForm);

async function loadStudents() {
    try {
        const response = await fetch(API);
        if (!response.ok) throw new Error("Could not load students");
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        showMessage("Backend is not reachable. Start the Spring Boot application.", true);
    }
}

function renderStudents(students) {
    table.innerHTML = "";
    emptyState.style.display = students.length ? "none" : "block";
    document.getElementById("countText").textContent =
        `${students.length} record${students.length === 1 ? "" : "s"}`;

    students.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${s.id}</td>
            <td><strong>${escapeHtml(s.name)}</strong></td>
            <td>${escapeHtml(s.email)}</td>
            <td>${escapeHtml(s.course)}</td>
            <td>${s.age}</td>
            <td>
                <button class="edit" onclick="editStudent(${s.id})">Edit</button>
                <button class="delete" onclick="deleteStudent(${s.id})">Delete</button>
            </td>`;
        table.appendChild(row);
    });
}

async function saveStudent(event) {
    event.preventDefault();

    const id = document.getElementById("studentId").value;
    const student = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        course: document.getElementById("course").value.trim(),
        age: Number(document.getElementById("age").value)
    };

    const url = id ? `${API}/${id}` : API;
    const method = id ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(student)
        });
        if (!response.ok) throw new Error(await response.text());
        showMessage(id ? "Student updated successfully." : "Student added successfully.");
        resetForm();
        await loadStudents();
    } catch (error) {
        showMessage("Operation failed. Check the values and backend.", true);
    }
}

async function editStudent(id) {
    const response = await fetch(`${API}/${id}`);
    const s = await response.json();

    document.getElementById("studentId").value = s.id;
    document.getElementById("name").value = s.name;
    document.getElementById("email").value = s.email;
    document.getElementById("course").value = s.course;
    document.getElementById("age").value = s.age;
    document.getElementById("formTitle").textContent = "Update Student";
    document.getElementById("saveBtn").textContent = "Update Student";
    window.scrollTo({top: 0, behavior: "smooth"});
}

async function deleteStudent(id) {
    if (!confirm("Delete this student?")) return;

    const response = await fetch(`${API}/${id}`, {method: "DELETE"});
    if (response.ok) {
        showMessage("Student deleted successfully.");
        loadStudents();
    } else {
        showMessage("Delete failed.", true);
    }
}

function resetForm() {
    form.reset();
    document.getElementById("studentId").value = "";
    document.getElementById("formTitle").textContent = "Add Student";
    document.getElementById("saveBtn").textContent = "Add Student";
}

function showMessage(text, error = false) {
    message.textContent = text;
    message.style.color = error ? "#d9485f" : "#3157d5";
    setTimeout(() => message.textContent = "", 3500);
}

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({
        "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
    }[ch]));
}
