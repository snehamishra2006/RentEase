import React, { useEffect, useState } from 'react';
import axiosClient from '../../api/axiosClient';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { Users, CheckCircle2, Search, UserCheck, UserX } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [notice, setNotice] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get('/admin/users');
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleActive = async (userId, currentActive) => {
    try {
      await axiosClient.put(`/admin/users/${userId}/status`, { isActive: !currentActive });
      setNotice(`User account status updated to ${!currentActive ? 'Active' : 'Suspended'}.`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Status update failed');
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">User Accounts Directory</h1>
          <p className="text-xs text-[#605A52]">Audit user accounts, roles, and status across the platform</p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-[#E2DACD] flex flex-col sm:flex-row gap-3 items-center justify-between shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#605A52]" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-xs text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-xs text-[#1C1917] capitalize focus:outline-none focus:border-[#1B3B2B]"
        >
          <option value="all">All Roles</option>
          <option value="tenant">Tenants Only</option>
          <option value="owner">Owners Only</option>
          <option value="admin">Admins Only</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <Loader text="Loading directory of registered users..." />
      ) : (
        <div className="bg-white rounded-xl border border-[#E2DACD] overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4F0E8] border-b border-[#E2DACD] text-[#605A52] uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3.5 px-4">User</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Account Status</th>
                  <th className="py-3.5 px-4">Registered Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2DACD] text-[#1C1917]">
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || 'https://ik.imagekit.io/f8khymiop/9dd2906190f0c1813429fe0c8695ed04.png?updatedAt=1786639995780'}
                          alt={u.name}
                          className="w-8 h-8 rounded-md object-cover border border-[#E2DACD]"
                        />
                        <div>
                          <span className="font-bold text-[#1C1917] block">{u.name}</span>
                          <span className="text-[11px] text-[#605A52]">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={u.role} text={u.role} />
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge status={u.isActive ? 'approved' : 'rejected'} text={u.isActive ? 'ACTIVE' : 'SUSPENDED'} />
                    </td>
                    <td className="py-3.5 px-4 text-[#605A52]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleActive(u._id, u.isActive)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors flex items-center gap-1 ml-auto ${
                            u.isActive
                              ? 'bg-rose-50 hover:bg-rose-100 text-[#991B1B] border-rose-200'
                              : 'bg-emerald-50 hover:bg-emerald-100 text-[#1B3B2B] border-emerald-200'
                          }`}
                        >
                          {u.isActive ? (
                            <>
                              <UserX className="w-3.5 h-3.5" /> Suspend
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3.5 h-3.5" /> Activate
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
