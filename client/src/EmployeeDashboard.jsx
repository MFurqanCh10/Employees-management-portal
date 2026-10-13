
import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/employees";

const EMPTY_FORM = {
  name: "",
  email: "",
  department: "",
  designation: "",
  salary: ""
};

function EmployeeDashboard() {
    const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // GET: Load employees from our Express API.
  const fetchEmployees = useCallback(async () => {
    try {
     const response = await fetch(API_URL, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

if (response.status === 401) {
  handleUnauthorized();
  return;
}

const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to load employees");
      }

      setEmployees(result.data || []);
      setError("");
    } catch (requestError) {
      setError(requestError.message || "Unable to connect to the backend");
    } finally {
      setLoading(false);
    }
  }, [token, handleUnauthorized]);

  // Run once when the component first loads.
  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  // Search employees without making another API request.
  const filteredEmployees = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return employees.filter((employee) =>
      [
        employee.name,
        employee.email,
        employee.department,
        employee.designation
      ].some((value) => value.toLowerCase().includes(query))
    );
  }, [employees, searchTerm]);

  const departmentCount = useMemo(
    () => new Set(employees.map((employee) => employee.department)).size,
    [employees]
  );

  const totalPayroll = useMemo(
    () =>
      employees.reduce(
        (total, employee) => total + Number(employee.salary || 0),
        0
      ),
    [employees]
  );

  // Update a form field whenever the user types.
  const handleChange = (event) => {
    const { name, value } = event.target;



    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  };

  // POST new employee or PUT changes to an existing employee.
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setSaving(true);

    try {
      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing ? `${API_URL}/${editingId}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            ...formData,
            salary: Number(formData.salary)
          })
        }
      );
      if (response.status === 401) {
  handleUnauthorized();
  return;
}

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to save employee");
      }

      setFormData(EMPTY_FORM);
      setEditingId(null);

      await fetchEmployees();

      setNotice(
        isEditing
          ? "Employee updated successfully."
          : "Employee added successfully."
      );
    } catch (requestError) {
      setError(requestError.message || "Unable to save employee");
    } finally {
      setSaving(false);
    }
  };

  // Put an employee's existing details into the form.
  const handleEdit = (employee) => {
    setFormData({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      designation: employee.designation,
      salary: String(employee.salary)
    });

    setEditingId(employee._id);
    setError("");
    setNotice("");
  };

  const handleCancelEdit = () => {
    setFormData(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setNotice("");
  };

  // DELETE an employee from MongoDB.
  const handleDelete = async (employee) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${employee.name}?`
    );

    if (!confirmed) return;

    setError("");
    setNotice("");

    try {
     const response = await fetch(`${API_URL}/${employee._id}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${token}`
  }
});

if (response.status === 401) {
  handleUnauthorized();
  return;
}

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Unable to delete employee");
      }

      if (editingId === employee._id) {
        handleCancelEdit();
      }

      await fetchEmployees();
      setNotice("Employee deleted successfully.");
    } catch (requestError) {
      setError(requestError.message || "Unable to delete employee");
    }
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <div className="brand-logo">EM</div>
            <div>
              <strong>PeopleDesk</strong>
              <span>Employee Management</span>
            </div>
          </div>
<div className="topbar-actions">
  <div className="connection-status">
    <span className="status-dot" />
    MERN workspace
  </div>

  <button
    type="button"
    className="logout-button"
    onClick={handleLogout}
  >
    Log out
  </button>
</div>
        </div>
      </header>

      <main className="page-container">
        <section className="page-heading">
          <div>
            <p className="eyebrow">OVERVIEW</p>
            <h1>Employee directory</h1>
            <p className="page-description">
              Manage your team, employee details, and records in one place.
            </p>
          </div>

          <span className="live-label">
            <span className="status-dot" />
            Connected to API
          </span>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon blue">👥</div>
            <p>Total employees</p>
            <h2>{employees.length}</h2>
            <span>Saved employee records</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon purple">▦</div>
            <p>Departments</p>
            <h2>{departmentCount}</h2>
            <span>Unique departments</span>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">Rs</div>
            <p>Total payroll</p>
            <h2>Rs. {totalPayroll.toLocaleString("en-PK")}</h2>
            <span>Combined recorded salaries</span>
          </article>
        </section>

        {error && (
          <div className="message error-message" role="alert">
            <strong>Error:</strong> {error}
          </div>
        )}

        {notice && (
          <div className="message success-message" role="status">
            {notice}
          </div>
        )}

        <section className="main-grid">
          <aside className="panel form-panel">
            <div className="panel-heading">
              <div>
                <p className="eyebrow">
                  {editingId ? "UPDATE RECORD" : "NEW RECORD"}
                </p>
                <h2>{editingId ? "Edit employee" : "Add employee"}</h2>
              </div>
              <span className="heading-symbol">
                {editingId ? "✎" : "+"}
              </span>
            </div>

            <p className="panel-description">
              {editingId
                ? "Update the employee information below."
                : "Enter the employee information to create a record."}
            </p>

            <form onSubmit={handleSubmit} className="employee-form">
              <div className="field">
                <label htmlFor="name">Full name</label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Ali Khan"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ali@example.com"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="department">Department</label>
                <input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  placeholder="e.g. Engineering"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="salary">Monthly salary (Rs.)</label>
                <input
                  id="salary"
                  name="salary"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  placeholder="e.g. 75000"
                  required
                />
              </div>

              <button className="primary-button" type="submit" disabled={saving}>
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save changes"
                    : "＋ Add employee"}
              </button>

              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel editing
                </button>
              )}
            </form>

            <p className="form-footnote">
              Employee records are stored in your local MongoDB database.
            </p>
          </aside>

          <section className="panel directory-panel">
            <div className="directory-heading">
              <div>
                <p className="eyebrow">YOUR TEAM</p>
                <h2>All employees</h2>
                <p className="panel-description">
                  View, search, and manage your employee records.
                </p>
              </div>
              <span className="record-count">
                {filteredEmployees.length} records
              </span>
            </div>

            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                aria-label="Search employees"
                placeholder="Search name, email, or department..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            {loading ? (
              <div className="empty-state">
                <div className="empty-symbol">↻</div>
                <h3>Loading employees...</h3>
                <p>Fetching records from the backend.</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="empty-state">
                <div className="empty-symbol">⌕</div>
                <h3>
                  {searchTerm ? "No matching employees" : "No employees yet"}
                </h3>
                <p>
                  {searchTerm
                    ? "Try another search term."
                    : "Add your first employee using the form."}
                </p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>EMPLOYEE</th>
                      <th>DEPARTMENT</th>
                      <th>DESIGNATION</th>
                      <th>SALARY</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredEmployees.map((employee) => (
                      <tr key={employee._id}>
                        <td>
                          <div className="employee-cell">
                            <div className="avatar">
                              {employee.name
                                .split(" ")
                                .map((part) => part[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()}
                            </div>
                            <div className="employee-info">
                              <strong>{employee.name}</strong>
                              <span>{employee.email}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="department-badge">
                            {employee.department}
                          </span>
                        </td>

                        <td>{employee.designation}</td>

                        <td className="salary-cell">
                          Rs. {Number(employee.salary).toLocaleString("en-PK")}
                        </td>

                        <td>
                          <div className="action-buttons">
                            <button
                              type="button"
                              className="edit-button"
                              onClick={() => handleEdit(employee)}
                              aria-label={`Edit ${employee.name}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="delete-button"
                              onClick={() => handleDelete(employee)}
                              aria-label={`Delete ${employee.name}`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </section>

        <footer className="page-footer">
          Employee Management System <span>·</span> Built with the MERN stack
        </footer>
      </main>
    </div>
  );
}

export default EmployeeDashboard;