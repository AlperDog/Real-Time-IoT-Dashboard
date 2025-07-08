import React, { useEffect, useState } from 'react';
import { getUserProfile, changePassword } from '../services/api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [changing, setChanging] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getUserProfile();
        setProfile(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const passwordSchema = yup.object().shape({
    currentPassword: yup.string().required('Current password is required'),
    newPassword: yup.string().required('New password is required').min(6, 'New password must be at least 6 characters'),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: yupResolver(passwordSchema),
  });

  const handleChangePassword = async (data: any) => {
    setChanging(true);
    setError(null);
    setSuccess(null);
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setSuccess('Password changed successfully!');
      toast.success('Password changed successfully!');
      reset();
    } catch (err: any) {
      setError(err.message);
      toast.error(err.message);
    } finally {
      setChanging(false);
    }
  };

  return (
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage your profile and account settings</p>
      </div>
      <div className="card p-6">
        {loading ? (
          <div className="text-gray-400">Loading profile...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : profile ? (
          <div className="space-y-2">
            <div><b>Name:</b> {profile.name}</div>
            <div><b>Email:</b> {profile.email}</div>
            <div><b>Role:</b> {profile.role}</div>
            <div><b>Last Login:</b> {profile.lastLogin ? new Date(profile.lastLogin).toLocaleString() : '-'}</div>
          </div>
        ) : null}
      </div>
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">Change Password</h2>
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            {...register('currentPassword')}
            className="input w-full"
          />
          {errors.currentPassword && <span className="text-red-500 text-xs">{errors.currentPassword.message as string}</span>}
          <input
            type="password"
            placeholder="New Password"
            {...register('newPassword')}
            className="input w-full"
          />
          {errors.newPassword && <span className="text-red-500 text-xs">{errors.newPassword.message as string}</span>}
          <button className="btn-primary" type="submit" disabled={changing}>
            {changing ? 'Changing...' : 'Change Password'}
          </button>
        </form>
        {success && <div className="text-green-600 mt-2">{success}</div>}
        {error && <div className="text-red-500 mt-2">{error}</div>}
      </div>
    </main>
  );
};

export default Settings; 