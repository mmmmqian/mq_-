
import { Cluster, Project, HeterogeneousResource, ResourcePool, Task, MetricPoint, InferenceService, ProjectMember, Tenant } from './types';
import { 
  Server, Database, BrainCircuit, Activity, 
  LayoutDashboard, Layers, Box, Cpu, FileText, 
  Settings, ShieldCheck, BarChart3, Users,
  Zap, Network, HardDrive, Share2, Terminal, List, PlayCircle, TrendingUp,
  Globe, Layout, Code, GitBranch, Rocket, FileCode, MonitorPlay,
  MonitorCheck, ActivitySquare, ShieldAlert, BarChart, ExternalLink,
  Bot, Library, Sparkles, MessageSquare, BookOpen, SearchCode, FolderKanban,
  UserCircle, Shield, Bell, CreditCard, Sliders
} from 'lucide-react';

// 模拟时间序列数据生成器
export const generateMetrics = (points: number, baseValue: number, variance: number): MetricPoint[] => {
  const data: MetricPoint[] = [];
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60000); 
    data.push({
      time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      value: Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance))
    });
  }
  return data;
};

// --- 租户 Mock 数据 ---
export const MOCK_TENANTS: Tenant[] = [
  { 
    id: 'tenant-core-ai', 
    name: '核心算法研发部', 
    status: 'active',
    projectCount: 12,
    projectLimit: 20,
    userCount: 45,
    createdAt: '2024-01-10',
    description: '负责集团底层基础大模型研发与多模态预训练任务。',
    quota: { 
      cpu: 1000, cpuUsed: 420, 
      gpu: 80, gpuUsed: 65, 
      memory: 10240, memoryUsed: 6144, 
      storage: 51200, storageUsed: 12400,
      npu: 16, npuUsed: 0
    }
  },
  { 
    id: 'tenant-vision', 
    name: '视觉智能事业部', 
    status: 'active',
    projectCount: 8,
    projectLimit: 15,
    userCount: 28,
    createdAt: '2024-02-15',
    description: '工业缺陷检测、城市治理及边缘视觉推理业务。',
    quota: { 
      cpu: 500, cpuUsed: 380, 
      gpu: 40, gpuUsed: 35, 
      memory: 4096, memoryUsed: 3200, 
      storage: 20480, storageUsed: 18900,
      npu: 0, npuUsed: 0
    }
  },
  { 
    id: 'tenant-nlp', 
    name: '自然语言处理中心', 
    status: 'disabled',
    projectCount: 5,
    projectLimit: 10,
    userCount: 15,
    createdAt: '2023-11-20',
    description: '针对金融、法律行业的长文本理解与自动摘要业务。',
    quota: { 
      cpu: 400, cpuUsed: 0, 
      gpu: 20, gpuUsed: 0, 
      memory: 2048, memoryUsed: 0, 
      storage: 10240, storageUsed: 10,
      npu: 0, npuUsed: 0
    }
  }
];

// --- 项目 Mock 数据 ---
export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'PROJ-CORE-AI-01', 
    name: '通用语言模型预训练', 
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部',
    owner: 'zhangsan', 
    status: 'active', 
    memberCount: 12,
    createdAt: '2024-01-10',
    quota: { cpu: 200, cpuUsed: 150, gpu: 16, gpuUsed: 4, storage: 2048, storageUsed: 1200, memory: 512, memoryUsed: 256 },
    description: '面向多任务场景的高性能 LLM 基础模型研发'
  },
  { 
    id: 'PROJ-VISION-X-99', 
    name: '工业视觉缺陷检测', 
    tenantId: 'tenant-vision',
    tenantName: '视觉智能事业部',
    owner: 'lisi', 
    status: 'active', 
    memberCount: 8,
    createdAt: '2024-02-15',
    quota: { cpu: 100, cpuUsed: 42, gpu: 8, gpuUsed: 7, storage: 1024, storageUsed: 890, memory: 256, memoryUsed: 128 },
    description: '基于深度学习的晶圆表面缺陷识别系统'
  }
];

// --- 项目成员 Mock 数据 ---
export const MOCK_PROJECT_MEMBERS: Record<string, ProjectMember[]> = {
  'PROJ-CORE-AI-01': [
    { userId: 'U-001', userName: 'zhangsan', realName: '张三', role: 'admin', joinedAt: '2024-01-10' },
    { userId: 'U-002', userName: 'tech_expert', realName: '王五', role: 'scientist', joinedAt: '2024-01-12' },
    { userId: 'U-003', userName: 'dev_01', realName: '李思思', role: 'developer', joinedAt: '2024-01-15' }
  ]
};

// --- IDE 资源套件配置 ---
export const IDE_RESOURCE_BUNDLES = {
  basic: {
    id: 'basic',
    name: '基础型 (Entry)',
    gpu: '1x 16GB (T4)',
    gpuCount: 1,
    cpu: 4,
    memory: 16,
    storage: 100,
    desc: '适用于代码调试与轻量级数据分析'
  },
  standard: {
    id: 'standard',
    name: '标准型 (Pro)',
    gpu: '1x 24GB (A10)',
    gpuCount: 1,
    cpu: 8,
    memory: 32,
    storage: 500,
    desc: '主流深度学习模型训练与开发首选'
  },
  highPerf: {
    id: 'highPerf',
    name: '高性能 (Ultra)',
    gpu: '1x 80GB (A100)',
    gpuCount: 1,
    cpu: 32,
    memory: 128,
    storage: 1024,
    desc: '针对大模型微调与复杂计算优化'
  }
};

// --- IDE 实例 Mock 数据 ---
export const MOCK_IDE_INSTANCES = [
  {
    id: 'IDE-992-X',
    name: 'bert-optimization-lab',
    type: 'JupyterLab',
    status: 'running',
    image: 'pytorch-2.2.0-cuda12.1',
    mountedModel: 'BERT中文预训练模型',
    mountedModelId: 'M-BERT-ZH',
    mountedVersion: 'v2.1.0',
    bundle: 'standard',
    resources: { gpu: '1x A10', cpu: '8c', mem: '32G', storage: '500GB' },
    metrics: { cpu: 28, mem: 45, gpu: 12 },
    uptime: '4h 15m',
    owner: 'zhangsan',
    createdAt: '2024-05-24 10:30:00'
  }
];

// --- 用户指定的六种模型资产 ---
export const MOCK_USER_MODELS = [
  {
    id: 'M-BERT-ZH',
    name: 'bert-base-chinese',
    displayName: 'BERT中文预训练模型',
    framework: 'PyTorch / Transformers',
    latestVersion: 'v2.1.0',
    status: 'stable',
    owner: 'nlp-core-team',
    size: '412 MB',
    createdAt: '2024-01-10',
    description: '标准 BERT Base 架构，基于通用中文语料库（维基、新闻）进行预训练。',
    storageType: 'S3',
    pythonVersion: '3.9',
    versions: [{ version: 'v2.1.0', date: '2024-03-20', size: '412MB', status: 'stable' }]
  },
  {
    id: 'M-GPT35',
    name: 'gpt-3.5-turbo-proxy',
    displayName: 'GPT-3.5 Turbo',
    framework: 'OpenAI API Wrapper',
    latestVersion: '2024-05-preview',
    status: 'stable',
    owner: 'llm-service',
    size: 'N/A (API-Based)',
    createdAt: '2023-11-15',
    description: '系统托管 of GPT-3.5 Turbo API 接入环境，支持流式输出与上下文管理。',
    storageType: 'Proxy',
    pythonVersion: '3.10',
    versions: [{ version: '2024-05-preview', date: '2024-05-01', size: '0', status: 'stable' }]
  },
  {
    id: 'M-YOLOV8',
    name: 'yolov8-detection',
    displayName: 'YOLOv8目标检测',
    framework: 'Ultralytics',
    latestVersion: 'v8.2.1',
    status: 'stable',
    owner: 'vision-algo',
    size: '52 MB',
    createdAt: '2024-04-12',
    description: '最新的 YOLO 目标检测模型，兼顾推理速度与检测精度，适用于边缘计算。',
    storageType: 'Ceph',
    pythonVersion: '3.9',
    versions: [{ version: 'v8.2.1', date: '2024-05-15', size: '52MB', status: 'stable' }]
  },
  {
    id: 'M-RESNET50',
    name: 'resnet50-classification',
    displayName: 'ResNet50图像分类',
    framework: 'PyTorch / torchvision',
    latestVersion: 'v1.0.2',
    status: 'stable',
    owner: 'vision-algo',
    size: '98 MB',
    createdAt: '2024-02-05',
    description: '经典的深层残差网络，预置 ImageNet 权重，用于通用图像特征提取。',
    storageType: 'S3',
    pythonVersion: '3.8',
    versions: [{ version: 'v1.0.2', date: '2024-02-10', size: '98MB', status: 'stable' }]
  },
  {
    id: 'M-T5-BASE',
    name: 't5-base-generation',
    displayName: 'T5文本生成',
    framework: 'HuggingFace Transformers',
    latestVersion: 'v1.1.0',
    status: 'stable',
    owner: 'nlp-core-team',
    size: '892 MB',
    createdAt: '2024-03-15',
    description: 'Text-to-Text Transfer Transformer，支持翻译、摘要、问答等多项任务。',
    storageType: 'S3',
    pythonVersion: '3.9',
    versions: [{ version: 'v1.1.0', date: '2024-04-01', size: '892MB', status: 'stable' }]
  },
  {
    id: 'M-SD-V15',
    name: 'stable-diffusion-v1.5',
    displayName: 'Stable Diffusion',
    framework: 'Diffusers / PIL',
    latestVersion: 'v1.5-final',
    status: 'stable',
    owner: 'gen-ai-lab',
    size: '4.2 GB',
    createdAt: '2024-01-20',
    description: 'Latent Diffusion 模型，用于根据文本提示词生成高质量图像。',
    storageType: 'S3 / Local',
    pythonVersion: '3.10',
    versions: [{ version: 'v1.5-final', date: '2024-01-25', size: '4.2GB', status: 'stable' }]
  }
];

export const MOCK_PRETRAINED_MODELS = [
  { id: 'HUB-LLAMA-3', name: 'Meta Llama 3', provider: 'Meta AI', type: 'Large Language Model', params: '70B', performance: 98, downloads: '1.2M', tags: ['Instruction', 'Multi-lingual'], latestVersion: 'v3.1.0', path: '/public/weights/llama3-70b-instruct', license: 'Llama 3 Community', framework: 'PyTorch / Transformers' }
];

export const SIDEBAR_ITEMS: Record<string, any[]> = {
  compute: [
    { 
      title: '集群与资源', 
      items: [
        { id: 'clusters', label: '集群与节点', icon: Server }, 
        { id: 'pools', label: '资源池化', icon: Layers }, 
        { id: 'hetero', label: '异构资源', icon: Cpu }
      ] 
    },
    { 
      title: '租户与权限', 
      items: [
        { id: 'tenants', label: '租户管理', icon: Users },
        { id: 'projects', label: '项目管理', icon: FolderKanban },
        { id: 'users', label: '用户管理', icon: UserCircle },
        { id: 'roles', label: '角色管理', icon: ShieldCheck }
      ] 
    },
    { 
      title: '任务调度', 
      items: [
        { id: 'tasks', label: '任务调度', icon: List }
      ] 
    },
    { 
      title: '监控中心', 
      items: [
        { id: 'monitoring', label: '资源监控', icon: Activity },
        { id: 'logs', label: '日志中心', icon: FileText },
        { id: 'alerts', label: '告警中心', icon: Bell }
      ] 
    },
    { 
      title: '成本与配置', 
      items: [
        { id: 'costs', label: '成本中心', icon: CreditCard },
        { id: 'sys-settings', label: '系统配置', icon: Sliders }
      ] 
    }
  ],
  data: [
    { title: '数据管理', items: [{ id: 'dataset-mgmt', label: '数据集管理', icon: Database }, { id: 'data-processing', label: '数据预处理', icon: FileCode }] }
  ],
  training: [
    { title: '模型货架', items: [{ id: 'model-mgmt', label: '模型管理', icon: Box }, { id: 'model-hub', label: '模型广场', icon: Globe }] },
    { title: '开发环境', items: [{ id: 'ide-env', label: 'IDE环境', icon: Terminal }] }
  ],
  inference: [
    { title: '服务治理', items: [{ id: 'online-service', label: '在线服务', icon: MonitorCheck }] },
    { title: '监控治理', items: [{ id: 'service-monitor', label: '服务监控', icon: ActivitySquare }] }
  ],
  agents: [
    { title: '应用编排', items: [{ id: 'agent-factory', label: '智能体工厂', icon: Sparkles }, { id: 'agent-chat', label: '对话测试', icon: MessageSquare }] }
  ],
  knowledge: [
    { title: '知识底座', items: [{ id: 'kb-mgmt', label: '库管理', icon: Library }, { id: 'embedding-mgmt', label: '向量检索', icon: SearchCode }] }
  ]
};

export const MODULE_MENU = [
  { id: 'compute', label: '算力纳管', icon: Server, type: 'platform' },
  { id: 'data', label: '数据管理', icon: Database, type: 'project' },
  { id: 'training', label: '模型训练', icon: BrainCircuit, type: 'project' },
  { id: 'inference', label: '推理服务', icon: Rocket, type: 'project' },
  { id: 'agents', label: '智能体', icon: Bot, type: 'project' },
  { id: 'knowledge', label: '知识库', icon: Library, type: 'project' },
];

export const MOCK_INFERENCE_SERVICES: InferenceService[] = [
  {
    id: 'SVC-9921-A',
    name: 'llama3-70b-prod',
    modelName: 'Meta-Llama-3-70B',
    modelVersion: 'v3.1.0',
    status: 'running',
    replicas: { ready: 4, total: 4 },
    endpoint: 'https://llama3.api.ai-nex.io/v1',
    protocol: 'HTTP',
    cpu: '16c',
    memory: '64G',
    gpu: '4x A100 (80G)',
    owner: 'zhangsan',
    createdAt: '2024-05-20 10:00',
    uptime: '4d 22h'
  }
];

export const MOCK_SERVICE_MONITORING = {
  qps: generateMetrics(24, 450, 100),
  latency: generateMetrics(24, 120, 40),
  successRate: generateMetrics(24, 99.8, 0.5),
  tokenUsage: generateMetrics(24, 75, 15),
  cpuUtil: generateMetrics(24, 65, 15)
};

export const MOCK_CLUSTERS: any[] = [
  {
    id: 'CL-001',
    name: 'szx-prod-01',
    displayName: '深圳生产核心集群-01',
    region: '华南-深圳',
    status: 'healthy',
    nodeCount: 10,
    readyNodes: 10,
    runningPods: 1420,
    k8sVersion: 'v1.28.4',
    environment: 'production',
    registeredAt: '2023-10-15 10:00:00',
    lastSync: '2024-05-24 10:15:00',
    certExpiry: '2025-10-15',
    apiUrl: 'https://k8s.szx.ai-nex.io:6443',
    containerRuntime: 'containerd://1.7.0',
    networkPlugin: 'Calico / Cilium',
    resources: {
      cpu: { used: 420, total: 640 },
      memory: { used: 1200, total: 2048 },
      gpu: { used: 45, total: 80 },
      storage: { used: 5000, total: 10240 }
    },
    masterComponents: {
      apiServer: 'healthy',
      scheduler: 'healthy',
      controllerManager: 'healthy',
      etcd: 'healthy'
    },
    tags: ['Critical', 'High-Density']
  },
  {
    id: 'CL-002',
    name: 'bj-training-01',
    displayName: '北京研发训练集群-01',
    region: '华北-北京',
    status: 'healthy',
    nodeCount: 24,
    readyNodes: 23,
    runningPods: 3200,
    k8sVersion: 'v1.27.2',
    environment: 'testing',
    registeredAt: '2023-11-20 09:30:00',
    lastSync: '2024-05-24 10:18:00',
    certExpiry: '2024-11-20',
    apiUrl: 'https://k8s.bj.ai-nex.io:6443',
    resources: {
      cpu: { used: 800, total: 1536 },
      memory: { used: 3100, total: 4096 },
      gpu: { used: 160, total: 192 },
      storage: { used: 42000, total: 102400 }
    },
    tags: ['Training', 'GPU-Cluster']
  },
  {
    id: 'CL-003',
    name: 'sh-inference-02',
    displayName: '上海推理业务集群-02',
    region: '华东-上海',
    status: 'degraded',
    nodeCount: 16,
    readyNodes: 14,
    runningPods: 2150,
    k8sVersion: 'v1.28.1',
    environment: 'production',
    registeredAt: '2024-01-05 14:00:00',
    lastSync: '2024-05-24 10:14:00',
    certExpiry: '2025-01-05',
    apiUrl: 'https://k8s.sh.ai-nex.io:6443',
    resources: {
      cpu: { used: 512, total: 1024 },
      memory: { used: 1800, total: 2048 },
      gpu: { used: 64, total: 128 },
      storage: { used: 12000, total: 51200 }
    },
    tags: ['Inference', 'Low-Latency']
  },
  {
    id: 'CL-004',
    name: 'hk-edge-01',
    displayName: '香港边缘节点集群-01',
    region: '华南-香港',
    status: 'healthy',
    nodeCount: 5,
    readyNodes: 5,
    runningPods: 420,
    k8sVersion: 'v1.26.8',
    environment: 'edge',
    registeredAt: '2024-02-12 11:20:00',
    lastSync: '2024-05-24 10:10:00',
    certExpiry: '2025-02-12',
    apiUrl: 'https://k8s.hk.ai-nex.io:6443',
    resources: {
      cpu: { used: 80, total: 160 },
      memory: { used: 120, total: 256 },
      gpu: { used: 10, total: 20 },
      storage: { used: 2000, total: 5000 }
    },
    tags: ['Edge-AI', 'International']
  },
  {
    id: 'CL-005',
    name: 'szx-dev-01',
    displayName: '深圳开发测试集群-01',
    region: '华南-深圳',
    status: 'healthy',
    nodeCount: 8,
    readyNodes: 8,
    runningPods: 650,
    k8sVersion: 'v1.28.4',
    environment: 'development',
    registeredAt: '2023-12-01 10:00:00',
    lastSync: '2024-05-24 10:16:00',
    certExpiry: '2024-12-01',
    apiUrl: 'https://k8s.szx-dev.ai-nex.io:6443',
    resources: {
      cpu: { used: 120, total: 256 },
      memory: { used: 300, total: 512 },
      gpu: { used: 8, total: 32 },
      storage: { used: 5000, total: 20480 }
    },
    tags: ['DevOps', 'CI-CD']
  },
  {
    id: 'CL-006',
    name: 'bj-prod-02',
    displayName: '北京生产容灾集群-02',
    region: '华北-北京',
    status: 'healthy',
    nodeCount: 12,
    readyNodes: 12,
    runningPods: 980,
    k8sVersion: 'v1.27.2',
    environment: 'production',
    registeredAt: '2024-03-15 16:45:00',
    lastSync: '2024-05-24 10:17:00',
    certExpiry: '2025-03-15',
    apiUrl: 'https://k8s.bj-prod.ai-nex.io:6443',
    resources: {
      cpu: { used: 320, total: 512 },
      memory: { used: 800, total: 1024 },
      gpu: { used: 24, total: 64 },
      storage: { used: 8000, total: 20480 }
    },
    tags: ['DR', 'Primary-Prod']
  },
  {
    id: 'CL-007',
    name: 'gz-standard-01',
    displayName: '广州标准通用集群-01',
    region: '华南-广州',
    status: 'healthy',
    nodeCount: 15,
    readyNodes: 15,
    runningPods: 1100,
    k8sVersion: 'v1.27.5',
    environment: 'production',
    registeredAt: '2024-03-20 08:00:00',
    lastSync: '2024-05-24 10:12:00',
    certExpiry: '2025-03-20',
    apiUrl: 'https://k8s.gz.ai-nex.io:6443',
    resources: {
      cpu: { used: 240, total: 480 },
      memory: { used: 600, total: 1024 },
      gpu: { used: 0, total: 0 },
      storage: { used: 5000, total: 10000 }
    },
    tags: ['General-Compute']
  },
  {
    id: 'CL-008',
    name: 'cd-gpu-cluster',
    displayName: '成都异构算力集群-01',
    region: '西南-成都',
    status: 'unhealthy',
    nodeCount: 10,
    readyNodes: 6,
    runningPods: 500,
    k8sVersion: 'v1.26.4',
    environment: 'production',
    registeredAt: '2024-04-10 12:00:00',
    lastSync: '2024-05-24 10:08:00',
    certExpiry: '2025-04-10',
    apiUrl: 'https://k8s.cd.ai-nex.io:6443',
    resources: {
      cpu: { used: 300, total: 640 },
      memory: { used: 1100, total: 2048 },
      gpu: { used: 40, total: 80 },
      storage: { used: 4000, total: 10240 }
    },
    tags: ['Heterogeneous', 'Southwest']
  },
  {
    id: 'CL-009',
    name: 'xa-npu-node',
    displayName: '西安国产芯片集群-01',
    region: '西北-西安',
    status: 'healthy',
    nodeCount: 6,
    readyNodes: 6,
    runningPods: 320,
    k8sVersion: 'v1.27.8',
    environment: 'testing',
    registeredAt: '2024-04-25 15:30:00',
    lastSync: '2024-05-24 10:19:00',
    certExpiry: '2025-04-25',
    apiUrl: 'https://k8s.xa.ai-nex.io:6443',
    resources: {
      cpu: { used: 120, total: 240 },
      memory: { used: 400, total: 512 },
      gpu: { used: 0, total: 0 },
      storage: { used: 2000, total: 4096 }
    },
    tags: ['NPU', 'Huawei-Ascend']
  },
  {
    id: 'CL-010',
    name: 'hz-backup-cluster',
    displayName: '杭州异地备份集群-01',
    region: '华东-杭州',
    status: 'healthy',
    nodeCount: 8,
    readyNodes: 8,
    runningPods: 210,
    k8sVersion: 'v1.28.2',
    environment: 'production',
    registeredAt: '2024-05-01 10:00:00',
    lastSync: '2024-05-24 10:11:00',
    certExpiry: '2025-05-01',
    apiUrl: 'https://k8s.hz.ai-nex.io:6443',
    resources: {
      cpu: { used: 40, total: 256 },
      memory: { used: 100, total: 512 },
      gpu: { used: 4, total: 32 },
      storage: { used: 1000, total: 10240 }
    },
    tags: ['Backup', 'Archive']
  }
];

export const MOCK_NODE_DETAILS: Record<string, any[]> = {
  'CL-001': Array.from({ length: 10 }).map((_, i) => ({
    id: `CL001-node-00${i + 1}`,
    name: `szx-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.128.0.${i + 1}`,
    cpu: { used: 40 + Math.floor(Math.random() * 20), total: 64 },
    mem: { used: 120 + Math.floor(Math.random() * 50), total: 256 },
    gpu: { count: 8, utilization: 70 + Math.floor(Math.random() * 25) },
    storage: { used: 400 + Math.floor(Math.random() * 200), total: 1024 },
    tags: ['gpu-high', 'ssd-local', 'prod-tier-1']
  })),
  'CL-002': Array.from({ length: 24 }).map((_, i) => ({
    id: `CL002-node-00${i + 1}`,
    name: `bj-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.129.1.${i + 1}`,
    cpu: { used: 30 + Math.floor(Math.random() * 25), total: 64 },
    mem: { used: 100 + Math.floor(Math.random() * 60), total: 170 },
    gpu: { count: 8, utilization: 80 + Math.floor(Math.random() * 15) },
    storage: { used: 800 + Math.floor(Math.random() * 300), total: 4000 },
    tags: ['training-node', 'a100-node']
  })),
  'CL-003': Array.from({ length: 16 }).map((_, i) => ({
    id: `CL003-node-00${i + 1}`,
    name: `sh-node-00${i + 1}`,
    status: i < 14 ? 'Ready' : 'NotReady',
    ip: `10.130.2.${i + 1}`,
    cpu: { used: 20 + Math.floor(Math.random() * 40), total: 64 },
    mem: { used: 90 + Math.floor(Math.random() * 30), total: 128 },
    gpu: { count: 8, utilization: 40 + Math.floor(Math.random() * 40) },
    storage: { used: 500 + Math.floor(Math.random() * 500), total: 3200 },
    tags: ['inference-node', 't4-node']
  })),
  'CL-004': Array.from({ length: 5 }).map((_, i) => ({
    id: `CL004-node-00${i + 1}`,
    name: `hk-node-00${i + 1}`,
    status: 'Ready',
    ip: `192.168.10.${i + 1}`,
    cpu: { used: 10 + Math.floor(Math.random() * 10), total: 32 },
    mem: { used: 20 + Math.floor(Math.random() * 20), total: 51 },
    gpu: { count: 4, utilization: 20 + Math.floor(Math.random() * 20) },
    storage: { used: 300 + Math.floor(Math.random() * 100), total: 1000 },
    tags: ['edge-node', 'hk-region']
  })),
  'CL-005': Array.from({ length: 8 }).map((_, i) => ({
    id: `CL005-node-00${i + 1}`,
    name: `szx-dev-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.128.5.${i + 1}`,
    cpu: { used: 15 + Math.floor(Math.random() * 15), total: 32 },
    mem: { used: 30 + Math.floor(Math.random() * 30), total: 64 },
    gpu: { count: 4, utilization: 10 + Math.floor(Math.random() * 10) },
    storage: { used: 400 + Math.floor(Math.random() * 200), total: 2560 },
    tags: ['dev-node', 'low-priority']
  })),
  'CL-006': Array.from({ length: 12 }).map((_, i) => ({
    id: `CL006-node-00${i + 1}`,
    name: `bj-prod-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.129.8.${i + 1}`,
    cpu: { used: 25 + Math.floor(Math.random() * 20), total: 42 },
    mem: { used: 60 + Math.floor(Math.random() * 20), total: 85 },
    gpu: { count: 4, utilization: 30 + Math.floor(Math.random() * 30) },
    storage: { used: 600 + Math.floor(Math.random() * 100), total: 1700 },
    tags: ['dr-node', 'standard-prod']
  })),
  'CL-007': Array.from({ length: 15 }).map((_, i) => ({
    id: `CL007-node-00${i + 1}`,
    name: `gz-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.131.0.${i + 1}`,
    cpu: { used: 15 + Math.floor(Math.random() * 15), total: 32 },
    mem: { used: 40 + Math.floor(Math.random() * 20), total: 68 },
    gpu: null,
    storage: { used: 300 + Math.floor(Math.random() * 100), total: 660 },
    tags: ['general-node', 'cpu-only']
  })),
  'CL-008': Array.from({ length: 10 }).map((_, i) => ({
    id: `CL008-node-00${i + 1}`,
    name: `cd-node-00${i + 1}`,
    status: i < 6 ? 'Ready' : 'NotReady',
    ip: `10.140.0.${i + 1}`,
    cpu: { used: 30 + Math.floor(Math.random() * 30), total: 64 },
    mem: { used: 100 + Math.floor(Math.random() * 100), total: 204 },
    gpu: { count: 8, utilization: 50 + Math.floor(Math.random() * 40) },
    storage: { used: 400 + Math.floor(Math.random() * 100), total: 1024 },
    tags: ['southwest-node', 'gpu-cluster']
  })),
  'CL-009': Array.from({ length: 6 }).map((_, i) => ({
    id: `CL009-node-00${i + 1}`,
    name: `xa-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.150.0.${i + 1}`,
    cpu: { used: 20 + Math.floor(Math.random() * 20), total: 40 },
    mem: { used: 60 + Math.floor(Math.random() * 20), total: 85 },
    gpu: null,
    storage: { used: 300 + Math.floor(Math.random() * 100), total: 680 },
    tags: ['npu-node', 'huawei-node']
  })),
  'CL-010': Array.from({ length: 8 }).map((_, i) => ({
    id: `CL010-node-00${i + 1}`,
    name: `hz-node-00${i + 1}`,
    status: 'Ready',
    ip: `10.132.0.${i + 1}`,
    cpu: { used: 5 + Math.floor(Math.random() * 5), total: 32 },
    mem: { used: 12 + Math.floor(Math.random() * 10), total: 64 },
    gpu: { count: 4, utilization: 12 + Math.floor(Math.random() * 10) },
    storage: { used: 120 + Math.floor(Math.random() * 100), total: 1280 },
    tags: ['backup-node', 'cold-standby']
  }))
};

export const MOCK_HETERO_RESOURCES: HeterogeneousResource[] = [
  {
    id: 'GPU-992-X',
    name: 'NVIDIA-A100-01',
    model: 'NVIDIA A100-80GB',
    vendor: 'NVIDIA',
    type: 'GPU',
    nodeId: 'szx-node-001',
    nodeIp: '10.128.0.1',
    clusterName: '深圳生产核心集群-01',
    status: 'online',
    healthStatus: 'healthy',
    driverVersion: '535.129.03',
    firmwareVersion: '94.00.38.00.08',
    memoryTotal: 80,
    memoryUsed: 62.5,
    utilization: 88,
    temperature: 62,
    power: 245,
    tags: ['Training', 'High-VRAM'],
    lastCheck: '2024-05-24 10:15:00'
  }
];

export const MOCK_RESOURCE_POOLS: ResourcePool[] = [
  {
    id: 'POOL-LLM-01',
    name: 'llm-inference-pool',
    displayName: '大语言模型推理池',
    description: '专用于生产环境 Llama/Qwen 等模型推理',
    status: 'active',
    clusterId: 'CL-001',
    clusterName: '深圳生产核心集群-01',
    nodeSelector: ['szx-node-001', 'szx-node-002', 'szx-node-003'],
    quota: { cpu: 192, memory: 768, gpu: 24, storage: 2048, pods: 300 },
    used: { cpu: 142, memory: 512, gpu: 18, storage: 1200, pods: 212 },
    createdAt: '2023-11-10',
    updatedAt: '2024-05-20',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部'
  },
  {
    id: 'POOL-TRAIN-02',
    name: 'heavy-training-pool',
    displayName: '大规模预训练算力池',
    description: '高密度 A100 节点阵列，支持多机多卡分布式训练',
    status: 'active',
    clusterId: 'CL-002',
    clusterName: '北京研发训练集群-01',
    nodeSelector: ['bj-node-001', 'bj-node-002', 'bj-node-003', 'bj-node-004'],
    quota: { cpu: 512, memory: 2048, gpu: 64, storage: 10240, pods: 100 },
    used: { cpu: 480, memory: 1800, gpu: 56, storage: 8500, pods: 42 },
    createdAt: '2023-12-05',
    updatedAt: '2024-05-22',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部'
  },
  {
    id: 'POOL-VIS-03',
    name: 'vision-inference-pool',
    displayName: '视觉智能推理专用池',
    description: '适用于 YOLO/ResNet 等视觉模型的高并发推理任务',
    status: 'active',
    clusterId: 'CL-003',
    clusterName: '上海推理业务集群-02',
    nodeSelector: ['sh-node-001', 'sh-node-002'],
    quota: { cpu: 128, memory: 512, gpu: 16, storage: 4096, pods: 500 },
    used: { cpu: 42, memory: 120, gpu: 4, storage: 1200, pods: 115 },
    createdAt: '2024-01-15',
    updatedAt: '2024-05-18',
    tenantId: 'tenant-vision',
    tenantName: '视觉智能事业部'
  },
  {
    id: 'POOL-EDGE-04',
    name: 'hk-edge-pool',
    displayName: '香港边缘计算池',
    description: '跨区域边缘节点，服务东南亚业务低延迟推理',
    status: 'active',
    clusterId: 'CL-004',
    clusterName: '香港边缘节点集群-01',
    nodeSelector: ['hk-node-001'],
    quota: { cpu: 32, memory: 128, gpu: 4, storage: 1024, pods: 100 },
    used: { cpu: 12, memory: 45, gpu: 2, storage: 400, pods: 24 },
    createdAt: '2024-02-20',
    updatedAt: '2024-05-15',
    tenantId: 'tenant-vision',
    tenantName: '视觉智能事业部'
  },
  {
    id: 'POOL-DEV-05',
    name: 'nlp-sandbox-pool',
    displayName: 'NLP 算法实验沙盒池',
    description: '低优先级资源池，用于 NLP 团队日常代码调试',
    status: 'active',
    clusterId: 'CL-005',
    clusterName: '深圳开发测试集群-01',
    nodeSelector: ['szx-dev-node-001'],
    quota: { cpu: 64, memory: 256, gpu: 8, storage: 2048, pods: 200 },
    used: { cpu: 15, memory: 60, gpu: 2, storage: 500, pods: 12 },
    createdAt: '2023-12-10',
    updatedAt: '2024-05-24',
    tenantId: 'tenant-nlp',
    tenantName: '自然语言处理中心'
  },
  {
    id: 'POOL-DR-06',
    name: 'prod-failover-pool',
    displayName: '生产容灾备份资源池',
    description: '高可靠性预留资源，仅在主集群故障时触发调度',
    status: 'disabled',
    clusterId: 'CL-006',
    clusterName: '北京生产容灾集群-02',
    nodeSelector: ['bj-prod-node-001', 'bj-prod-node-002'],
    quota: { cpu: 256, memory: 1024, gpu: 32, storage: 5120, pods: 400 },
    used: { cpu: 0, memory: 0, gpu: 0, storage: 0, pods: 0 },
    createdAt: '2024-03-01',
    updatedAt: '2024-05-01',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部'
  },
  {
    id: 'POOL-GEN-07',
    name: 'standard-compute-pool',
    displayName: '通用 CPU 计算池',
    description: '非加速计算任务，如数据清洗、特征工程',
    status: 'active',
    clusterId: 'CL-007',
    clusterName: '广州标准通用集群-01',
    nodeSelector: ['gz-node-001', 'gz-node-002'],
    quota: { cpu: 128, memory: 512, gpu: 0, storage: 2048, pods: 300 },
    used: { cpu: 85, memory: 340, gpu: 0, storage: 1100, pods: 92 },
    createdAt: '2024-03-25',
    updatedAt: '2024-05-20',
    tenantId: 'tenant-nlp',
    tenantName: '自然语言处理中心'
  },
  {
    id: 'POOL-SW-08',
    name: 'southwest-gpu-pool',
    displayName: '西南异构算力池',
    description: '利用西南地区绿色电力，执行大规模非实时训练任务',
    status: 'active',
    clusterId: 'CL-008',
    clusterName: '成都异构算力集群-01',
    nodeSelector: ['cd-node-001', 'cd-node-002'],
    quota: { cpu: 192, memory: 768, gpu: 24, storage: 4096, pods: 200 },
    used: { cpu: 140, memory: 520, gpu: 18, storage: 2100, pods: 45 },
    createdAt: '2024-04-12',
    updatedAt: '2024-05-23',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部'
  },
  {
    id: 'POOL-NPU-09',
    name: 'domestic-chip-pool',
    displayName: '国产 NPU 推理池',
    description: '基于华为昇腾芯片，适配国产大模型推理',
    status: 'active',
    clusterId: 'CL-009',
    clusterName: '西安国产芯片集群-01',
    nodeSelector: ['xa-node-001'],
    quota: { cpu: 64, memory: 256, gpu: 0, storage: 1024, pods: 150 },
    used: { cpu: 12, memory: 48, gpu: 0, storage: 200, pods: 8 },
    createdAt: '2024-04-28',
    updatedAt: '2024-05-24',
    tenantId: 'tenant-vision',
    tenantName: '视觉智能事业部'
  },
  {
    id: 'POOL-BK-10',
    name: 'archive-storage-pool',
    displayName: '杭州长期归档存储池',
    description: '低成本冷存储池，用于模型历史版本与训练数据集备份',
    status: 'active',
    clusterId: 'CL-010',
    clusterName: '杭州异地备份集群-01',
    nodeSelector: ['hz-node-001'],
    quota: { cpu: 32, memory: 64, gpu: 4, storage: 20480, pods: 50 },
    used: { cpu: 4, memory: 8, gpu: 0, storage: 12500, pods: 4 },
    createdAt: '2024-05-10',
    updatedAt: '2024-05-24',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 'TASK-55291',
    name: 'llama3-70b-finetune-v2',
    type: 'training',
    typeName: '模型训练',
    status: 'running',
    statusName: '运行中',
    submitter: 'zhangsan',
    tenantName: '核心算法研发部',
    projectName: 'Llama3-Optimization',
    resourcePoolName: '训练资源池-A100',
    priority: 'high',
    resources: { gpu: '8x A100', cpu: '64c', memory: '256G' },
    duration: '14h 22m',
    progress: 42,
    submittedAt: '2024-05-23 20:00:00',
    startedAt: '2024-05-23 20:15:00',
    image: 'pytorch-2.2.0-cuda12.1-cudnn8',
    command: 'python train.py --config config/llama3_finetune.yaml'
  }
];

export const MOCK_MONITORING_HISTORY = {
  cpu: generateMetrics(24, 45, 15),
  memory: generateMetrics(24, 62, 10),
  gpu: generateMetrics(24, 78, 20)
};
