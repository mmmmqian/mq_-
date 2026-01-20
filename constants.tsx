
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
    { userId: 'u-1', userName: 'zhangsan', realName: '张三', role: 'admin', joinedAt: '2024-01-10' },
    { userId: 'u-2', userName: 'lisi', realName: '李四', role: 'algorithm', joinedAt: '2024-01-12' },
    { userId: 'u-3', userName: 'wangwu', realName: '王五', role: 'developer', joinedAt: '2024-02-01' }
  ],
  'PROJ-VISION-X-99': [
    { userId: 'u-4', userName: 'zhaoliu', realName: '赵六', role: 'admin', joinedAt: '2024-02-15' },
    { userId: 'u-5', userName: 'sunqi', realName: '孙七', role: 'scientist', joinedAt: '2024-03-01' }
  ]
};

// --- 算力资源套件配置 ---
export const RESOURCE_BUNDLES = {
  basic: {
    id: 'basic',
    name: '基础型 (Entry)',
    gpu: '1x 16GB (T4)',
    gpuCount: 1,
    cpu: 4,
    memory: 16,
    storage: 100,
    desc: '适用于代码调试与轻量级 NLP 模型推理'
  },
  standard: {
    id: 'standard',
    name: '标准型 (Pro)',
    gpu: '1x 24GB (A10)',
    gpuCount: 1,
    cpu: 8,
    memory: 32,
    storage: 500,
    desc: '主流深度学习模型在线服务的黄金配置'
  },
  highPerf: {
    id: 'highPerf',
    name: '高性能 (Ultra)',
    gpu: '1x 80GB (A100)',
    gpuCount: 1,
    cpu: 32,
    memory: 128,
    storage: 1024,
    desc: '针对大参数量模型与复杂计算链路优化'
  }
};

export const IDE_RESOURCE_BUNDLES = RESOURCE_BUNDLES;

export const INFERENCE_RESOURCE_BUNDLES = {
  basic: {
    ...RESOURCE_BUNDLES.basic,
    gpuLabel: RESOURCE_BUNDLES.basic.gpu,
    gpuValue: RESOURCE_BUNDLES.basic.gpuCount
  },
  standard: {
    ...RESOURCE_BUNDLES.standard,
    gpuLabel: RESOURCE_BUNDLES.standard.gpu,
    gpuValue: RESOURCE_BUNDLES.standard.gpuCount
  },
  highPerf: {
    ...RESOURCE_BUNDLES.highPerf,
    gpuLabel: RESOURCE_BUNDLES.highPerf.gpu,
    gpuValue: RESOURCE_BUNDLES.highPerf.gpuCount
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

// --- 模型资产 Mock 数据 ---
export const MOCK_USER_MODELS = [
  {
    id: 'M-BERT-ZH',
    name: 'bert-base-chinese',
    displayName: 'BERT中文预训练模型',
    type: '自然语言处理',
    framework: 'PyTorch / Transformers',
    latestVersion: 'v2.1.0',
    status: 'stable',
    owner: 'nlp-core-team',
    size: '412 MB',
    createdAt: '2024-01-10',
    updatedAt: '2024-05-20 14:15',
    description: '标准 BERT Base 架构，基于通用中文语料库进行预训练，广泛用于分类、NER 等任务。',
    storageType: 'S3',
    pythonVersion: '3.9',
    versions: [
      { 
        version: 'v2.1.0', 
        date: '2024-05-20', 
        size: '412MB', 
        status: 'stable', 
        source: 'training', 
        downloads: '1.2k', 
        params: '110M', 
        metrics: 'F1: 94.2%', 
        path: 's3://models/bert-zh/v2.1.0/pytorch_model.bin',
        mountPath: '/mnt/models/bert-zh/v2.1.0',
        mountPathSource: 'default'
      }
    ]
  },
  {
    id: 'M-YOLOV8',
    name: 'yolov8-detection',
    displayName: 'YOLOv8目标检测',
    type: '计算机视觉',
    framework: 'Ultralytics',
    latestVersion: 'v8.2.1',
    status: 'stable',
    owner: 'vision-algo',
    size: '52 MB',
    createdAt: '2024-04-12',
    updatedAt: '2024-05-15 16:45',
    description: '最新的 YOLO 目标检测模型，兼顾推理速度与检测精度。',
    storageType: 'OSS',
    pythonVersion: '3.9',
    versions: [
      { 
        version: 'v8.2.1', 
        date: '2024-05-15', 
        size: '52MB', 
        status: 'stable', 
        source: 'training',
        downloads: '850', 
        params: '3.2M', 
        metrics: 'mAP@50: 91.0', 
        path: 'oss://models/yolov8/v8.2.1/yolov8n.pt',
        mountPath: '/mnt/models/yolov8/v8.2.1',
        mountPathSource: 'default'
      }
    ]
  }
];

export const MOCK_PRETRAINED_MODELS = [
  { 
    id: 'HUB-LLAMA-3', 
    name: 'Meta Llama 3 70B', 
    provider: 'Meta AI', 
    taskType: '文本生成', 
    params: '70B', 
    framework: 'PyTorch', 
    latestVersion: 'v3.1.0', 
    updatedAt: '2024-05-24', 
    tags: ['Instruction', 'Multi-lingual'],
    description: '下一代最先进的开源大语言模型，具有强大的推理和代码生成能力。'
  },
  { 
    id: 'HUB-RESNET-50', 
    name: 'ResNet-50 v1.5', 
    provider: 'PyTorch Hub', 
    taskType: '图像分类', 
    params: '25.6M', 
    framework: 'PyTorch', 
    latestVersion: 'v1.5.0', 
    updatedAt: '2024-04-12', 
    tags: ['CV', 'Baseline'],
    description: '经典的深层残差网络，广泛用于图像特征提取与物体识别任务。'
  },
  { 
    id: 'HUB-YOLOV10', 
    name: 'YOLOv10 Real-time', 
    provider: 'Open Source', 
    taskType: '目标检测', 
    params: '2.3M', 
    framework: 'PyTorch', 
    latestVersion: 'v10.0.2', 
    updatedAt: '2024-05-21', 
    tags: ['Real-time', 'CV'],
    description: '无需 NMS 的实时端到端目标检测模型，刷新性能边界。'
  },
  { 
    id: 'HUB-BERT-SENT', 
    name: 'BERT-Sentiment-Analyzer', 
    provider: 'Hugging Face', 
    taskType: '情感分析', 
    params: '110M', 
    framework: 'TensorFlow', 
    latestVersion: 'v2.1.0', 
    updatedAt: '2024-03-28', 
    tags: ['NLP', 'Analysis'],
    description: '针对社交媒体评论优化的情感极性分类器。'
  },
  { 
    id: 'HUB-TS-PROPHET', 
    name: 'Neural Prophet TimeSeries', 
    provider: 'Meta Research', 
    taskType: '时间序列', 
    params: '1.2M', 
    framework: 'PyTorch', 
    latestVersion: 'v1.0.4', 
    updatedAt: '2024-05-02', 
    tags: ['Forecasting', 'Statistics'],
    description: '融合深度学习与传统统计规律的大规模时间序列预测框架。'
  },
  { 
    id: 'HUB-PPO-AGENT', 
    name: 'Deep-RL-PPO-Agent', 
    provider: 'OpenAI Baselines', 
    taskType: '强化学习', 
    params: '850K', 
    framework: 'TensorFlow', 
    latestVersion: 'v0.8.2', 
    updatedAt: '2023-12-15', 
    tags: ['RL', 'Decision-making'],
    description: '近端策略优化 (PPO) 实现，适用于离散和连续控制任务。'
  }
];

export const SIDEBAR_ITEMS: Record<string, any[]> = {
  compute: [
    { title: '集群与资源', items: [{ id: 'clusters', label: '集群与节点', icon: Server }, { id: 'pools', label: '资源池化', icon: Layers }, { id: 'hetero', label: '异构资源', icon: Cpu }] },
    { title: '租户与权限', items: [{ id: 'tenants', label: '租户管理', icon: Users }, { id: 'projects', label: '项目管理', icon: FolderKanban }, { id: 'users', label: '用户管理', icon: UserCircle }, { id: 'roles', label: '角色管理', icon: ShieldCheck }] },
    { title: '任务调度', items: [{ id: 'tasks', label: '任务调度', icon: List }] },
    { title: '监控中心', items: [{ id: 'monitoring', label: '资源监控', icon: Activity }, { id: 'logs', label: '日志中心', icon: FileText }, { id: 'alerts', label: '告警中心', icon: Bell }] },
    { title: '成本与配置', items: [{ id: 'costs', label: '成本中心', icon: CreditCard }, { id: 'sys-settings', label: '系统配置', icon: Sliders }] }
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
    { title: '知识库', items: [{ id: 'kb-mgmt', label: '库管理', icon: Library }, { id: 'embedding-mgmt', label: '向量检索', icon: SearchCode }] }
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
    basePath: '/v1',
    healthPath: '/healthz',
    protocol: 'HTTP',
    cpu: '16c',
    memory: '64G',
    gpu: '4x A100 (80G)',
    owner: 'zhangsan',
    createdAt: '2024-05-20 10:00',
    uptime: '4d 22h',
    qps: 1420,
    latency: 124,
    nodeName: 'szx-node-001',
    image: 'ai-nex.repo.io/inference/vllm:0.4.2-llama3'
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
    apiUrl: 'https://k8s.szx.api.ai-nex.io:6443',
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
