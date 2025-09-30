import { AppShell } from '@/components/AppShell';
import { X402TestCard } from '@/components/X402TestCard';
import { Bell, DollarSign, Shield, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-6 py-8 pb-24">
        <h1 className="text-3xl font-bold text-fg mb-8">Settings</h1>

        {/* Profile Section */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-fg">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Display Name
              </label>
              <input
                type="text"
                defaultValue="Agent Builder"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Wallet Address
              </label>
              <input
                type="text"
                defaultValue="0x1234...5678"
                className="input-field"
                disabled
              />
            </div>
          </div>
        </div>

        {/* Spending Caps */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <DollarSign className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-fg">Spending Caps</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Daily Cap
              </label>
              <input
                type="number"
                defaultValue="10.00"
                step="0.01"
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Monthly Cap
              </label>
              <input
                type="number"
                defaultValue="100.00"
                step="0.01"
                className="input-field"
              />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-fg">Notifications</h2>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-fg">Agent request completed</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-fg">Template earned revenue</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-fg">Spending cap alerts</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-fg">Frame interactions</span>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </label>
          </div>
        </div>

        {/* Security */}
        <div className="glass-card rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-accent" />
            <h2 className="text-lg font-semibold text-fg">Security</h2>
          </div>
          <div className="space-y-4">
            <button className="btn-secondary w-full">
              View Transaction History
            </button>
            <button className="btn-secondary w-full">
              Export Data
            </button>
            <button className="text-error hover:underline text-sm">
              Disconnect Wallet
            </button>
          </div>
        </div>

        {/* X402 Test Section */}
        <div className="mt-8">
          <X402TestCard />
        </div>

        {/* Save Button */}
        <div className="mt-8">
          <button className="btn-primary w-full">
            Save Changes
          </button>
        </div>
      </div>
    </AppShell>
  );
}
