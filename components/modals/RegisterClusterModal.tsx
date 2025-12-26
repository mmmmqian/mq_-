
import React, { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle, Server, Shield, Network } from 'lucide-react';
import { Drawer } from '../ui/Drawer';

interface RegisterClusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RegisterClusterModal: React.FC<RegisterClusterModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    environment: 'production',
    apiUrl: '',
    authType: 'serviceAccount',
    token: '',
    resourceQuota: 85
  });

  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = '集群名称不能为空';
    if (!formData.apiUrl.trim()) {
      newErrors.apiUrl = 'API Server URL 不能为空';
    } else if (!formData.apiUrl.startsWith('https://')) {
      newErrors.apiUrl = '必须使用 HTTPS 协议';
    }
    if (!formData.token.trim()) newErrors.token = 'ServiceAccount Token 不能为空';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTestConnection = async () => {
    if (!validate()) return;

    setConnectionStatus('testing');
    
    // Simulate API call
    setTimeout(() => {
      // Mock success for demo purposes
      if (Math.random() > 0.1) {
        setConnectionStatus('success');
      } else {
        setConnectionStatus('error');
      }
    }, 1500);
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    // In a real app, this would submit to backend
    console.log('Submitting cluster:', formData);
    onClose();
  };

  const footerContent = (
    <>
      <button 
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors"
      >
        取消
      </button>
      <button 
        type="button"
        onClick={handleSubmit}
        disabled={connectionStatus === 'testing'}
        className="px-5 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium text-sm shadow-lg shadow-primary-500/25 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
      >
        确认注册
      </button>
    </>
  );

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={
        <>
          <Server size={20} className="text-primary-600" />
          注册集群
        </>
      }
      description="接入新的 Kubernetes 集群以进行统一纳管"
      width="max-w-2xl"
      footer={footerContent}
    >
      <form className="space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span>
            基础信息
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">集群名称 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="例如: production-cluster-01"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'}`}
              />
              {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">环境类型 <span className="text-red-500">*</span></label>
              <select 
                name="environment"
                value={formData.environment}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              >
                <option value="production">生产环境 (Production)</option>
                <option value="testing">测试环境 (Testing)</option>
                <option value="development">开发环境 (Development)</option>
                <option value="edge">边缘环境 (Edge)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* Section 2: Connection */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Network size={14} className="text-primary-500" />
            连接配置
          </h3>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">API Server URL <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                name="apiUrl"
                value={formData.apiUrl}
                onChange={handleChange}
                placeholder="https://k8s-api.example.com:6443"
                className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${errors.apiUrl ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'}`}
              />
              {errors.apiUrl && <p className="text-[11px] text-red-500 font-medium">{errors.apiUrl}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">认证方式 <span className="text-red-500">*</span></label>
                <select 
                  name="authType"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  <option value="serviceAccount">ServiceAccount Token</option>
                </select>
              </div>
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">ServiceAccount Token <span className="text-red-500">*</span></label>
                <textarea 
                  name="token"
                  value={formData.token}
                  onChange={handleChange}
                  rows={1}
                  placeholder="eyJhbGciOiJSUzI1NiIsImtpZCI6..."
                  className={`w-full px-3 py-2 bg-slate-50 border rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all min-h-[42px] ${errors.token ? 'border-red-300 focus:border-red-500' : 'border-slate-200 focus:border-primary-500'}`}
                ></textarea>
                {errors.token && <p className="text-[11px] text-red-500 font-medium">{errors.token}</p>}
              </div>
            </div>

            {/* Test Connection Area */}
            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={connectionStatus === 'testing'}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {connectionStatus === 'testing' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Network size={16} />
                )}
                测试连接
              </button>

              {connectionStatus === 'success' && (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 animate-in fade-in slide-in-from-left-2">
                  <CheckCircle2 size={16} />
                  <span>连接成功</span>
                </div>
              )}

              {connectionStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm font-medium bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 animate-in fade-in slide-in-from-left-2">
                  <AlertCircle size={16} />
                  <span>连接失败: 无法访问 API Server</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100"></div>

        {/* Section 3: Resource Config */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Shield size={14} className="text-primary-500" />
            资源管控
          </h3>
          
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
            <div className="flex justify-between items-center mb-4">
              <label className="text-sm font-semibold text-slate-700">资源分配上限</label>
              <span className="text-lg font-bold text-primary-600 font-mono">{formData.resourceQuota}%</span>
            </div>
            
            <input 
              type="range" 
              min="50" 
              max="100" 
              step="5"
              name="resourceQuota"
              value={formData.resourceQuota}
              onChange={(e) => setFormData(prev => ({ ...prev, resourceQuota: parseInt(e.target.value) }))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
            />
            
            <div className="flex justify-between text-xs text-slate-400 mt-2 font-mono">
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>

            <div className="mt-4 flex items-start gap-2 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200">
              <AlertCircle size={14} className="text-primary-500 shrink-0 mt-0.5" />
              <p>设置平台可调度的最大资源百分比。建议保留至少 15% 的资源给 Kubernetes 系统组件 (Kubelet, CNI 等)，避免系统不稳定。</p>
            </div>
          </div>
        </div>
      </form>
    </Drawer>
  );
};

export default RegisterClusterModal;
