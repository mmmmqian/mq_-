
import { Cluster, Project, HeterogeneousResource, ResourcePool, Task, MetricPoint, InferenceService, ProjectMember, Tenant, User, PlatformRole, Role } from './types';
import { 
  Server, Database, BrainCircuit, Activity, 
  LayoutDashboard, Layers, Box, Cpu, FileText, 
  Settings, ShieldCheck, BarChart3, Users,
  Zap, Network, HardDrive, Share2, Terminal, List, PlayCircle, TrendingUp,
  Globe, Layout, Code, GitBranch, Rocket, FileCode, MonitorPlay,
  MonitorCheck, ActivitySquare, ShieldAlert, BarChart, ExternalLink,
  Bot, Library, Sparkles, MessageSquare, BookOpen, SearchCode, FolderKanban,
  UserCircle, Shield, Bell, CreditCard, Sliders, History, Mail, Phone,
  Package, Key, Eye, Command, Binary, Microscope, Workflow
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

// --- 角色 Mock 数据 (PRD 3.3) ---
export const MOCK_ROLES: Role[] = [
  {
    id: 'role-platform-admin',
    name: '平台管理员',
    code: 'platform_admin',
    type: 'platform',
    isBuiltIn: true,
    description: '负责所属租户内的用户、角色、项目及资源配额的日常管理。',
    userCount: 5,
    permissions: [
      { id: 'p-tenants', label: '租户管理', children: [{ id: 'p-tenants-view', label: '租户详情查询' }] },
      { id: 'p-users', label: '用户管理', children: [{ id: 'p-users-crud', label: '用户生命周期管控' }] },
      { id: 'p-roles', label: '角色管理', children: [{ id: 'p-roles-view', label: '权限矩阵查询' }] },
      { id: 'p-projects', label: '项目管理', children: [{ id: 'p-projects-crud', label: '项目空间初始化' }] }
    ]
  },
  {
    id: 'role-ops-engineer',
    name: '运维工程师',
    code: 'operations_engineer',
    type: 'platform',
    isBuiltIn: true,
    description: '负责底层基础设施（集群、节点、网络、存储）的监控、运维及告警处理。',
    userCount: 8,
    permissions: [
      { id: 'p-infra', label: '集群与节点', children: [{ id: 'p-nodes', label: '节点状态监控' }, { id: 'p-clusters', label: '集群接入' }] },
      { id: 'p-resource', label: '异构资源', children: [{ id: 'p-gpu', label: 'GPU卡级诊断' }] },
      { id: 'p-pool', label: '资源池化', children: [{ id: 'p-pool-mgmt', label: '逻辑池划分' }] },
      { id: 'p-monitor', label: '监控中心', children: [{ id: 'p-telemetry', label: '实时遥测看板' }] }
    ]
  },
  {
    id: 'role-algorithm-engineer',
    name: '算法工程师',
    code: 'algorithm_engineer',
    type: 'project',
    isBuiltIn: true,
    description: '专注于模型研发，拥有数据预处理、模型训练及服务部署的全流程权限。',
    userCount: 156,
    permissions: [
      { id: 'p-data', label: '数据管理', children: [{ id: 'p-dataset', label: '数据集版本控制' }] },
      { id: 'p-training', label: '模型训练', children: [{ id: 'p-job', label: '训练任务调度' }, { id: 'p-ide', label: 'IDE交互式开发' }] },
      { id: 'p-inference', label: '推理服务', children: [{ id: 'p-service', label: '在线终端部署' }] }
    ]
  },
  {
    id: 'role-data-scientist',
    name: '数据科学家',
    code: 'data_scientist',
    type: 'project',
    isBuiltIn: true,
    description: '负责数据探索与知识工程，专注于数据集质量与知识库建设。',
    userCount: 42,
    permissions: [
      { id: 'p-data', label: '数据管理', children: [{ id: 'p-discovery', label: '特征工程探索' }] },
      { id: 'p-training', label: '模型训练', children: [{ id: 'p-eval', label: '模型评估报告' }] },
      { id: 'p-kb', label: '知识库', children: [{ id: 'p-rag', label: 'RAG知识索引管理' }] }
    ]
  }
];

// --- 租户 Mock 数据 ---
export const MOCK_TENANTS: Tenant[] = [
  { 
    id: 'tenant-core-ai', 
    name: '核心算法研发部', 
    admin: 'admin_wang',
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
  }
];

// --- 用户 Mock 数据 ---
export const MOCK_USERS: User[] = [
  {
    id: 'u-001',
    userName: 'super_admin',
    realName: '系统管理员',
    email: 'admin@ai-nex.cloud',
    phone: '138****0001',
    tenantId: 'platform',
    tenantName: '全平台',
    role: 'super_admin',
    status: 'active',
    createdAt: '2023-01-01',
    lastLoginAt: '2025-11-12 09:30',
    remark: '系统初始化内置账号'
  },
  {
    id: 'u-002',
    userName: 'zhangsan',
    realName: '张三',
    email: 'zhangsan@corp.com',
    phone: '139****1234',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部',
    role: 'platform_admin',
    status: 'active',
    createdAt: '2024-01-15',
    lastLoginAt: '2025-11-11 18:22',
    remark: '研发部租户管理员'
  },
  {
    id: 'u-003',
    userName: 'lisi_ops',
    realName: '李四',
    email: 'lisi@corp.com',
    phone: '137****5678',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部',
    role: 'operations_engineer',
    status: 'active',
    createdAt: '2024-03-20',
    lastLoginAt: '2025-11-10 10:15'
  },
  {
    id: 'u-004',
    userName: 'wangwu_v',
    realName: '王五',
    email: 'wangwu@corp.com',
    phone: '135****9988',
    tenantId: 'tenant-core-ai',
    tenantName: '核心算法研发部',
    role: 'platform_visitor',
    status: 'disabled',
    createdAt: '2024-05-12',
    lastLoginAt: '2025-08-15 14:00'
  }
];

export const ROLE_CONFIG: Record<PlatformRole, { label: string, color: string, variant: any }> = {
  super_admin: { label: '超级管理员', color: 'text-red-600 bg-red-50 border-red-100', variant: 'error' },
  platform_admin: { label: '平台管理员', color: 'text-primary-600 bg-primary-50 border-primary-100', variant: 'primary' },
  operations_engineer: { label: '运维工程师', color: 'text-indigo-600 bg-indigo-50 border-indigo-100', variant: 'info' },
  platform_visitor: { label: '平台访客', color: 'text-slate-500 bg-slate-50 border-slate-200', variant: 'neutral' }
};

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
  }
];

// --- 项目成员 Mock 数据 ---
export const MOCK_PROJECT_MEMBERS: Record<string, ProjectMember[]> = {
  'PROJ-CORE-AI-01': [
    { userId: 'u-1', userName: 'zhangsan', realName: '张三', role: 'admin', joinedAt: '2024-01-10' }
  ]
};

// --- 算力资源套件配置 ---
export const RESOURCE_BUNDLES = {
  basic: { id: 'basic', name: '基础型 (Entry)', gpu: '1x 16GB (T4)', gpuCount: 1, cpu: 4, memory: 16, storage: 100, desc: '代码调试' },
  standard: { id: 'standard', name: '标准型 (Pro)', gpu: '1x 24GB (A10)', gpuCount: 1, cpu: 8, memory: 32, storage: 500, desc: '主流模型' },
  highPerf: { id: 'highPerf', name: '高性能 (Ultra)', gpu: '1x 80GB (A100)', gpuCount: 1, cpu: 32, memory: 128, storage: 1024, desc: '大参数模型' }
};

export const IDE_RESOURCE_BUNDLES = RESOURCE_BUNDLES;
export const INFERENCE_RESOURCE_BUNDLES = {
  basic: { ...RESOURCE_BUNDLES.basic, gpuLabel: RESOURCE_BUNDLES.basic.gpu, gpuValue: RESOURCE_BUNDLES.basic.gpuCount },
  standard: { ...RESOURCE_BUNDLES.standard, gpuLabel: RESOURCE_BUNDLES.standard.gpu, gpuValue: RESOURCE_BUNDLES.standard.gpuCount },
  highPerf: { ...RESOURCE_BUNDLES.highPerf, gpuLabel: RESOURCE_BUNDLES.highPerf.gpu, gpuValue: RESOURCE_BUNDLES.highPerf.gpuCount }
};

// --- 模型广场（预训练模型库） ---
export const MOCK_PRETRAINED_MODELS = [
  { 
    id: 'HUB-LLAMA-3', 
    name: 'Meta Llama 3 70B Instruct', 
    displayName: 'Meta Llama 3 70B 指令增强版',
    provider: 'Meta AI (FAIR)', 
    providerUrl: 'https://ai.meta.com/llama/',
    taskType: '文本生成', 
    params: '70B', 
    framework: 'PyTorch', 
    frameworkVersion: 'PyTorch 2.2+',
    latestVersion: 'v3.1.0', 
    fileSize: '131.2 GB',
    accuracy: 'MMLU Score: 82.0',
    license: 'Llama 3 Community License',
    createdAt: '2024-04-18',
    updatedAt: '2024-05-24', 
    tags: ['SOTA', 'Transformer', 'LLM', 'Instruct-tuned', 'Multi-lingual'],
    description: 'Meta Llama 3 是由 Meta 发布的下一代最先进开源大语言模型。70B 指令版本在推理、代码生成、对话理解等方面具备顶尖性能，适用于生产级复杂 Agent 构建及企业级知识库增强。'
  },
  { 
    id: 'HUB-RESNET-50', 
    name: 'ResNet-50 v1.5 Pretrained', 
    displayName: 'ResNet-50 深度残差分类模型',
    provider: 'PyTorch Hub', 
    providerUrl: 'https://pytorch.org/hub/',
    taskType: '图像分类', 
    params: '25.6M', 
    framework: 'PyTorch', 
    frameworkVersion: 'PyTorch 1.13+',
    latestVersion: 'v1.5.0', 
    fileSize: '98 MB',
    accuracy: 'Top-1 Acc: 76.15%',
    license: 'BSD 3-Clause',
    createdAt: '2022-06-12',
    updatedAt: '2024-04-12', 
    tags: ['CV', 'CNN', 'ImageNet', 'Baseline'],
    description: 'ResNet-50 是计算机视觉领域里程碑式的模型，通过残差学习解决了深层神经网络中的梯度消失问题。本版本为标准 ImageNet-1K 预训练版本，广泛用于迁移学习的特征提取底座。'
  }
];

// --- 模块菜单与侧边栏 ---
export const SIDEBAR_ITEMS: Record<string, any[]> = {
  compute: [
    { 
      title: '集群与资源', 
      items: [
        { id: 'clusters', label: '集群与节点', icon: Server }, 
        { id: 'pools', label: '资源池化', icon: Layers }
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
    }
  ],
  training: [
    { title: '模型货架', items: [{ id: 'model-mgmt', label: '模型管理', icon: Box }, { id: 'model-hub', label: '模型广场', icon: Globe }] },
    { title: '开发环境', items: [{ id: 'ide-env', label: 'IDE环境', icon: Terminal }] }
  ],
  inference: [
    { title: '服务治理', items: [{ id: 'online-service', label: '在线服务', icon: MonitorCheck }, { id: 'service-monitor', label: '服务监控', icon: ActivitySquare }] }
  ]
};

export const MODULE_MENU = [
  { id: 'compute', label: '算力纳管', icon: Server, type: 'platform' },
  { id: 'training', label: '模型训练', icon: BrainCircuit, type: 'project' },
  { id: 'inference', label: '推理服务', icon: Rocket, type: 'project' }
];

export const MOCK_USER_MODELS = [
  { id: 'M-BERT-ZH', name: 'bert-base-chinese', displayName: 'BERT中文模型', type: 'NLP', framework: 'PyTorch', latestVersion: 'v2.1.0', status: 'stable', owner: 'nlp-team', size: '412 MB', updatedAt: '2024-05-20' }
];

export const MOCK_INFERENCE_SERVICES: InferenceService[] = [
  { id: 'SVC-9921-A', name: 'llama3-70b-prod', modelName: 'Meta-Llama-3-70B', modelVersion: 'v3.1.0', status: 'running', replicas: { ready: 4, total: 4 }, endpoint: 'https://llama3.api.ai-nex.io/v1', protocol: 'HTTP', cpu: '16c', memory: '64G', gpu: '4x A100', owner: 'zhangsan', createdAt: '2024-05-20 10:00', uptime: '4d 22h', qps: 1420, latency: 124 }
];

// --- 5个模拟集群配置 ---
export const MOCK_CLUSTERS: any[] = [
  { id: 'CL-001', name: 'szx-prod-01', displayName: '华南-深圳生产集群-01', region: '华南-深圳', status: 'healthy', environment: 'production', nodeCount: 12, readyNodes: 12, runningPods: 1420, k8sVersion: 'v1.28.4', resources: { cpu: { used: 420, total: 640 }, memory: { used: 1200, total: 2048 }, gpu: { used: 45, total: 80 }, storage: { used: 4500, total: 10240 } } },
  { id: 'CL-002', name: 'pvg-prod-02', displayName: '华东-上海生产集群-02', region: '华东-上海', status: 'healthy', environment: 'production', nodeCount: 20, readyNodes: 19, runningPods: 2150, k8sVersion: 'v1.28.4', resources: { cpu: { used: 850, total: 1280 }, memory: { used: 2100, total: 4096 }, gpu: { used: 112, total: 160 }, storage: { used: 12000, total: 25600 } } },
  { id: 'CL-003', name: 'hkg-edge-01', displayName: '境外-香港边缘集群-01', region: '境外-香港', status: 'degraded', environment: 'edge', nodeCount: 4, readyNodes: 3, runningPods: 240, k8sVersion: 'v1.26.1', resources: { cpu: { used: 96, total: 128 }, memory: { used: 320, total: 512 }, gpu: { used: 12, total: 16 }, storage: { used: 800, total: 2048 } } },
  { id: 'CL-004', name: 'pek-train-05', displayName: '华北-北京预训练专用-05', region: '华北-北京', status: 'healthy', environment: 'production', nodeCount: 32, readyNodes: 32, runningPods: 850, k8sVersion: 'v1.29.0', resources: { cpu: { used: 1200, total: 2048 }, memory: { used: 4500, total: 8192 }, gpu: { used: 240, total: 256 }, storage: { used: 45000, total: 102400 } } },
  { id: 'CL-005', name: 'cd-dev-01', displayName: '西南-成都开发测试-01', region: '西南-成都', status: 'healthy', environment: 'development', nodeCount: 6, readyNodes: 6, runningPods: 120, k8sVersion: 'v1.27.3', resources: { cpu: { used: 48, total: 128 }, memory: { used: 128, total: 256 }, gpu: { used: 4, total: 8 }, storage: { used: 400, total: 4096 } } }
];

// --- 模拟节点详情生成器 ---
const generateNodeData = (clusterId: string, count: number, prefix: string) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `${clusterId}-node-${i + 1}`,
    name: `${prefix}-node-${i + 1}`,
    status: i === 0 && clusterId === 'CL-003' ? 'NotReady' : 'Ready',
    ip: `10.${128 + i}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    cpu: { used: Math.floor(Math.random() * 32), total: 64 },
    mem: { used: Math.floor(Math.random() * 128), total: 256 },
    gpu: { count: 8, utilization: Math.floor(Math.random() * 100) },
    storage: { used: 100, total: 1000 },
    tags: i % 2 === 0 ? ['high-perf', 'nvidia-a100'] : ['general-purpose']
  }));
};

export const MOCK_NODE_DETAILS: Record<string, any[]> = {
  'CL-001': generateNodeData('CL-001', 12, 'szx'),
  'CL-002': generateNodeData('CL-002', 20, 'pvg'),
  'CL-003': generateNodeData('CL-003', 4, 'hkg'),
  'CL-004': generateNodeData('CL-004', 32, 'pek'),
  'CL-005': generateNodeData('CL-005', 6, 'cd')
};

// --- 每个集群对应1-2个资源池 ---
export const MOCK_RESOURCE_POOLS: ResourcePool[] = [
  { id: 'POOL-LLM-01', name: 'llm-inference-pool', displayName: 'LLM 生产推理池', status: 'active', clusterId: 'CL-001', clusterName: '华南-深圳生产集群-01', nodeSelector: ['szx-node-1', 'szx-node-2'], quota: { cpu: 128, memory: 512, gpu: 16, storage: 2048, pods: 200 }, used: { cpu: 92, memory: 380, gpu: 12, storage: 1200, pods: 145 }, createdAt: '2023-11-10', updatedAt: '2024-05-20', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' },
  { id: 'POOL-LLM-02', name: 'llm-training-pool', displayName: 'LLM 预训练实验池', status: 'active', clusterId: 'CL-001', clusterName: '华南-深圳生产集群-01', nodeSelector: ['szx-node-3', 'szx-node-4'], quota: { cpu: 256, memory: 1024, gpu: 32, storage: 4096, pods: 100 }, used: { cpu: 180, memory: 720, gpu: 24, storage: 3100, pods: 42 }, createdAt: '2023-12-15', updatedAt: '2024-05-21', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' },
  
  { id: 'POOL-CV-01', name: 'cv-prod-pool', displayName: 'CV 视觉生产池', status: 'active', clusterId: 'CL-002', clusterName: '华东-上海生产集群-02', nodeSelector: ['pvg-node-1', 'pvg-node-2', 'pvg-node-3'], quota: { cpu: 384, memory: 1536, gpu: 48, storage: 10240, pods: 500 }, used: { cpu: 210, memory: 980, gpu: 36, storage: 6200, pods: 312 }, createdAt: '2024-01-05', updatedAt: '2024-05-20', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' },
  
  { id: 'POOL-EDGE-01', name: 'edge-rt-pool', displayName: '香港边缘实时推理池', status: 'active', clusterId: 'CL-003', clusterName: '境外-香港边缘集群-01', nodeSelector: ['hkg-node-1'], quota: { cpu: 64, memory: 256, gpu: 8, storage: 1024, pods: 100 }, used: { cpu: 52, memory: 210, gpu: 6, storage: 450, pods: 82 }, createdAt: '2024-02-18', updatedAt: '2024-05-15', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' },
  
  { id: 'POOL-HPC-01', name: 'hpc-cluster-pool', displayName: '超大规模集群计算池', status: 'active', clusterId: 'CL-004', clusterName: '华北-北京预训练专用-05', nodeSelector: ['pek-node-1', 'pek-node-2', 'pek-node-3', 'pek-node-4', 'pek-node-5'], quota: { cpu: 1024, memory: 4096, gpu: 128, storage: 51200, pods: 200 }, used: { cpu: 890, memory: 3500, gpu: 112, storage: 42000, pods: 64 }, createdAt: '2024-03-01', updatedAt: '2024-05-22', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' },
  
  { id: 'POOL-DEV-01', name: 'sandbox-pool', displayName: '西南研发沙盒池', status: 'active', clusterId: 'CL-005', clusterName: '西南-成都开发测试-01', nodeSelector: ['cd-node-1'], quota: { cpu: 64, memory: 128, gpu: 4, storage: 1024, pods: 50 }, used: { cpu: 12, memory: 45, gpu: 2, storage: 210, pods: 15 }, createdAt: '2024-04-10', updatedAt: '2024-05-23', tenantId: 'tenant-core-ai', tenantName: '核心算法研发部' }
];

export const MOCK_TASKS: Task[] = [
  { id: 'TASK-55291', name: 'llama3-finetune', type: 'training', typeName: '模型训练', status: 'running', statusName: '运行中', submitter: 'zhangsan', tenantName: '核心算法研发部', projectName: 'Llama3-Opt', resourcePoolName: '训练池-A100', priority: 'high', resources: { gpu: '8x A100', cpu: '64c', memory: '256G' }, duration: '14h 22m', progress: 42, submittedAt: '2024-05-23 20:00:00', image: 'pytorch:2.2.0', command: 'python train.py' }
];

export const MOCK_HETERO_RESOURCES: HeterogeneousResource[] = [];

export const MOCK_MONITORING_HISTORY = {
  cpu: generateMetrics(24, 45, 15),
  memory: generateMetrics(24, 62, 10),
  gpu: generateMetrics(24, 78, 20)
};
