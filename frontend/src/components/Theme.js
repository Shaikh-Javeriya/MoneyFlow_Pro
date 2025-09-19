import React, { useState } from 'react';
import { Palette, Sun, Moon, Type, Paintbrush, Save, DollarSign } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themePresets } from '../data/mockData';

const Theme = () => {
  const { isDark, setIsDark, fontSize, setFontSize, currency, setCurrency, colors, setColors, applyPreset } = useTheme();
  const [customColors, setCustomColors] = useState(colors);

  const handleColorChange = (colorType, value) => {
    setCustomColors({
      ...customColors,
      [colorType]: value
    });
  };

  const saveColors = () => {
    setColors(customColors);
  };

  const resetToDefaults = () => {
    const defaultColors = {
      primary: '#2563eb',
      accent: '#0891b2',
      success: '#059669'
    };
    setCustomColors(defaultColors);
    setColors(defaultColors);
    setIsDark(false);
    setFontSize('medium');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Theme Customization</h1>
        <div className="flex space-x-2 mt-4 sm:mt-0">
          <button
            onClick={saveColors}
            className="flex items-center space-x-2 bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
          <button
            onClick={resetToDefaults}
            className="flex items-center space-x-2 bg-[var(--bg-tertiary)] text-[var(--text-primary)] px-4 py-2 rounded-lg hover:bg-[var(--border-color)] transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Theme Mode & Typography */}
        <div className="space-y-6">
          {/* Dark/Light Mode */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              {isDark ? <Moon className="text-[var(--color-primary)]" size={24} /> : <Sun className="text-[var(--color-primary)]" size={24} />}
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Appearance Mode</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setIsDark(false)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  !isDark 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10' 
                    : 'border-[var(--border-color)] hover:border-[var(--color-primary)]'
                }`}
              >
                <Sun className="mx-auto mb-2 text-[var(--color-primary)]" size={24} />
                <p className="text-sm font-medium text-[var(--text-primary)]">Light Mode</p>
              </button>
              
              <button
                onClick={() => setIsDark(true)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isDark 
                    ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10' 
                    : 'border-[var(--border-color)] hover:border-[var(--color-primary)]'
                }`}
              >
                <Moon className="mx-auto mb-2 text-[var(--color-primary)]" size={24} />
                <p className="text-sm font-medium text-[var(--text-primary)]">Dark Mode</p>
              </button>
            </div>
          </div>

          {/* Font Size */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Type className="text-[var(--color-primary)]" size={24} />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Font Size</h2>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => setFontSize(size)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    fontSize === size 
                      ? 'border-[var(--color-primary)] bg-[var(--color-primary)] bg-opacity-10' 
                      : 'border-[var(--border-color)] hover:border-[var(--color-primary)]'
                  }`}
                >
                  <p className={`font-medium text-[var(--text-primary)] capitalize ${
                    size === 'small' ? 'text-sm' : size === 'large' ? 'text-lg' : 'text-base'
                  }`}>
                    {size}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Currency Settings */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <DollarSign className="text-[var(--color-primary)]" size={24} />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Currency</h2>
            </div>
            
            <div className="space-y-3">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              >
                <option value="USD">🇺🇸 US Dollar (USD)</option>
                <option value="EUR">🇪🇺 Euro (EUR)</option>
                <option value="GBP">🇬🇧 British Pound (GBP)</option>
                <option value="CAD">🇨🇦 Canadian Dollar (CAD)</option>
                <option value="AUD">🇦🇺 Australian Dollar (AUD)</option>
                <option value="JPY">🇯🇵 Japanese Yen (JPY)</option>
                <option value="CHF">🇨🇭 Swiss Franc (CHF)</option>
                <option value="CNY">🇨🇳 Chinese Yuan (CNY)</option>
                <option value="INR">🇮🇳 Indian Rupee (INR)</option>
                <option value="BRL">🇧🇷 Brazilian Real (BRL)</option>
              </select>
              
              <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg">
                <p className="text-sm text-[var(--text-secondary)] mb-1">Preview:</p>
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {(() => {
                    const currencySymbols = {
                      USD: '$1,234.56',
                      EUR: '€1,234.56',
                      GBP: '£1,234.56',
                      CAD: 'C$1,234.56',
                      AUD: 'A$1,234.56',
                      JPY: '¥123,456',
                      CHF: 'CHF1,234.56',
                      CNY: '¥1,234.56',
                      INR: '₹1,234.56',
                      BRL: 'R$1,234.56'
                    };
                    return currencySymbols[currency] || '$1,234.56';
                  })()}
                </p>
              </div>
            </div>
          </div>

          {/* Theme Presets */}
          <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
            <div className="flex items-center space-x-3 mb-4">
              <Paintbrush className="text-[var(--color-primary)]" size={24} />
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">Theme Presets</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(themePresets).map(([name, preset]) => (
                <button
                  key={name}
                  onClick={() => applyPreset(name)}
                  className="w-full p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--color-primary)] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.success }} />
                      </div>
                      <span className="font-medium text-[var(--text-primary)]">{name}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Custom Colors */}
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="text-[var(--color-primary)]" size={24} />
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Custom Colors</h2>
          </div>
          
          <div className="space-y-6">
            {/* Primary Color */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-[var(--border-color)] cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.primary}
                  onChange={(e) => handleColorChange('primary', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: customColors.primary }}>
                <p className="text-white text-sm font-medium">Primary color preview</p>
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Accent Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-[var(--border-color)] cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.accent}
                  onChange={(e) => handleColorChange('accent', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: customColors.accent }}>
                <p className="text-white text-sm font-medium">Accent color preview</p>
              </div>
            </div>

            {/* Success Color */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
                Success Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={customColors.success}
                  onChange={(e) => handleColorChange('success', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-[var(--border-color)] cursor-pointer"
                />
                <input
                  type="text"
                  value={customColors.success}
                  onChange={(e) => handleColorChange('success', e.target.value)}
                  className="flex-1 px-3 py-2 border border-[var(--border-color)] rounded-lg bg-[var(--bg-tertiary)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent font-mono text-sm"
                />
              </div>
              <div className="mt-2 p-3 rounded-lg" style={{ backgroundColor: customColors.success }}>
                <p className="text-white text-sm font-medium">Success color preview</p>
              </div>
            </div>
          </div>

          {/* Color Suggestions */}
          <div className="mt-6 pt-6 border-t border-[var(--border-color)]">
            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Color Suggestions</h3>
            <div className="grid grid-cols-6 gap-2">
              {[
                '#2563eb', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
                '#ec4899', '#f43f5e', '#ef4444', '#f97316', '#f59e0b', '#eab308',
                '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9'
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setCustomColors({
                    primary: color,
                    accent: color,
                    success: '#10b981'
                  })}
                  className="w-8 h-8 rounded-lg border border-[var(--border-color)] hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)] shadow-sm">
        <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Live Preview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg border border-[var(--border-color)]">
            <button
              className="w-full py-2 px-4 rounded-lg text-white font-medium"
              style={{ backgroundColor: customColors.primary }}
            >
              Primary Button
            </button>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border-color)]">
            <button
              className="w-full py-2 px-4 rounded-lg text-white font-medium"
              style={{ backgroundColor: customColors.accent }}
            >
              Accent Button
            </button>
          </div>
          <div className="p-4 rounded-lg border border-[var(--border-color)]">
            <button
              className="w-full py-2 px-4 rounded-lg text-white font-medium"
              style={{ backgroundColor: customColors.success }}
            >
              Success Button
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Theme;