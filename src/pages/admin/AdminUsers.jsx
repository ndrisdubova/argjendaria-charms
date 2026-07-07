import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useCustomers } from '../../hooks/useCustomers'

function AdminUsers() {
  const customers = useCustomers()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q)
    )
  }, [customers, query])

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <h1>Users</h1>
        <p>Everyone who has signed up for an account.</p>
      </div>

      <div className="admin-search">
        <Search size={17} strokeWidth={1.75} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          aria-label="Search users"
        />
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Password</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.password}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={4} className="admin-table-empty">
                  {customers.length === 0 ? 'No users have signed up yet.' : 'No users match your search.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminUsers
