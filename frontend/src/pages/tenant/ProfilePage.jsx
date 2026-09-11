import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateProfile } from '../../redux/slices/authSlice';
import Badge from '../../components/common/Badge';
import { User as UserIcon, Mail, Phone, Save, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [notice, setNotice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(updateProfile({ name, phone, avatar }));
    if (!res.error) {
      setNotice('Profile record updated successfully!');
    } else {
      alert(res.payload || 'Profile update failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-[#E2DACD]">
        <div className="w-10 h-10 rounded-lg bg-[#1B3B2B] flex items-center justify-center text-white">
          <UserIcon className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#1C1917]">Account Profile Settings</h1>
          <p className="text-xs text-[#605A52]">Update your identity records and contact preferences</p>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-lg bg-[#1B3B2B]/10 border border-[#1B3B2B] text-[#1B3B2B] text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" /> {notice}
        </div>
      )}

      <div className="bg-white p-6 sm:p-8 rounded-xl border border-[#E2DACD] shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          <div className="flex items-center gap-4 pb-6 border-b border-[#E2DACD]">
            <img
              src={avatar || 'https://ik.imagekit.io/f8khymiop/9dd2906190f0c1813429fe0c8695ed04.png?updatedAt=1786639995780'}
              alt={name}
              className="w-16 h-16 rounded-lg object-cover border border-[#E2DACD]"
            />
            <div>
              <h3 className="text-lg font-serif font-bold text-[#1C1917]">{user?.name}</h3>
              <p className="text-xs text-[#605A52] mb-1.5">{user?.email}</p>
              <Badge status={user?.role} text={user?.role} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#1C1917] font-bold mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>

            <div>
              <label className="block text-[#1C1917] font-bold mb-1">Contact Phone Number</label>
              <input
                type="text"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#1C1917] font-bold mb-1">Avatar Image Photo URL</label>
            <input
              type="text"
              placeholder="https://images.unsplash.com/..."
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#FAF7F2] border border-[#E2DACD] rounded-lg text-[#1C1917] focus:outline-none focus:border-[#1B3B2B]"
            />
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E2DACD]">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-lg bg-[#1B3B2B] hover:bg-[#152e22] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {loading ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
