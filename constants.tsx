
import { Cluster, Project, HeterogeneousResource, ResourcePool, Task, MetricPoint } from './types';
import { 
  Server, Database, BrainCircuit, Activity, 
  LayoutDashboard, Layers, Box, Cpu, FileText, 
  Settings, ShieldCheck, BarChart3, Users,
  Zap, Network, HardDrive, Share2, Terminal, List, PlayCircle, TrendingUp
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

export const MOCK_MONITORING_HISTORY = {
  cpu: generateMetrics(24, 42, 12),
  memory: generateMetrics(24, 68, 8),
  gpu: generateMetrics(24, 85, 15),
  storage: generateMetrics(24, 55, 2),
};

export const MOCK_CLUSTERS: any[] = [
  {
    id: 'cluster-prod',
    name: 'prod-core-v3',
    displayName: '生产集群 (Production)',
    environment: 'production',
    status: 'healthy',
    k8sVersion: 'v1.29.1',
    nodeCount: 32,
    readyNodes: 31,
    region: '华北-北京',
    runningPods: 2450,
    pendingPods: 8,
    masterComponents: {
      apiServer: 'healthy',
      scheduler: 'healthy',
      controllerManager: 'healthy',
      etcd: 'healthy'
    },
    resources: {
      cpu: { total: 4096, used: 2840, unit: 'Cores' },
      memory: { total: 16384, used: 11200, unit: 'GB' },
      gpu: { total: 256, used: 210, unit: 'Cards' },
      storage: { total: 500, used: 312, unit: 'TB' }
    },
    tags: ['Mission-Critical', 'HA'],
    registeredAt: '2023-11-12',
    lastSync: '2024-05-24 10:00:00'
  }
];

export const MOCK_RESOURCE_POOLS: ResourcePool[] = [
  {
    id: 'pool-gpu',
    name: 'gpu-resource-pool',
    displayName: 'GPU 算力池 (A100)',
    description: '核心深度学习训练与大模型推理专用算力池',
    status: 'active',
    clusterId: 'cluster-prod',
    clusterName: '生产集群',
    nodeSelector: ['worker-gpu-01', 'worker-gpu-02'],
    quota: { cpu: 256, memory: 1024, gpu: 64, storage: 10000, pods: 200 },
    used: { cpu: 184, memory: 812, gpu: 58, storage: 7200, pods: 142 },
    createdAt: '2023-11-15',
    updatedAt: '2024-05-20',
    tenantId: 'tenant-001',
    tenantName: '智能研究院-算力组'
  }
];

export const MOCK_NODE_DETAILS: Record<string, any[]> = {
  'cluster-prod': [
    { id: 'worker-gpu-01', name: 'worker-gpu-01', status: 'Ready', role: 'worker', ip: '10.0.1.10', cpu: { used: 54, total: 64 }, mem: { used: 210, total: 256 }, gpu: { count: 8, model: 'NVIDIA A100' }, storage: { used: 420, total: 1024 }, tags: ['Worker', 'GPU-Optimized', 'Zone-A'] },
    { id: 'worker-gpu-02', name: 'worker-gpu-02', status: 'Warning', role: 'worker', ip: '10.0.1.11', cpu: { used: 61, total: 64 }, mem: { used: 240, total: 256 }, gpu: { count: 8, model: 'NVIDIA A100' }, storage: { used: 890, total: 1024 }, tags: ['Worker', 'AI-Infer', 'Zone-A'] },
    { id: 'worker-npu-01', name: 'worker-npu-01', status: 'Ready', role: 'worker', ip: '10.0.1.20', cpu: { used: 30, total: 128 }, mem: { used: 64, total: 512 }, gpu: null, storage: { used: 200, total: 1024 }, tags: ['Worker', 'NPU-Core'] }
  ]
};

export const MOCK_HETERO_RESOURCES: HeterogeneousResource[] = [
  {
    id: 'ACC-GPU-NV-001',
    name: 'bj-prod-gpu-01-card0',
    model: 'NVIDIA A100-SXM4-80GB',
    vendor: 'NVIDIA',
    type: 'GPU',
    nodeId: 'worker-gpu-01',
    nodeIp: '10.0.1.10',
    clusterName: '生产集群-北京',
    status: 'online',
    healthStatus: 'healthy',
    driverVersion: '535.104.05',
    firmwareVersion: '92.00.1c.00.01',
    memoryTotal: 80,
    memoryUsed: 64,
    utilization: 82,
    temperature: 68,
    power: 320,
    tags: ['GPU', 'Training'],
    lastCheck: '2024-05-24 10:15:30'
  },
  {
    id: 'ACC-GPU-NV-002',
    name: 'bj-prod-gpu-01-card1',
    model: 'NVIDIA A100-SXM4-80GB',
    vendor: 'NVIDIA',
    type: 'GPU',
    nodeId: 'worker-gpu-01',
    nodeIp: '10.0.1.10',
    clusterName: '生产集群-北京',
    status: 'online',
    healthStatus: 'healthy',
    driverVersion: '535.104.05',
    firmwareVersion: '92.00.1c.00.01',
    memoryTotal: 80,
    memoryUsed: 32,
    utilization: 45,
    temperature: 62,
    power: 210,
    tags: ['GPU', 'Inference'],
    lastCheck: '2024-05-24 10:15:30'
  },
  {
    id: 'ACC-NPU-HW-001',
    name: 'bj-prod-npu-01-card0',
    model: 'Ascend 910B',
    vendor: 'Huawei',
    type: 'NPU',
    nodeId: 'worker-npu-01',
    nodeIp: '10.0.1.20',
    clusterName: '生产集群-北京',
    status: 'online',
    healthStatus: 'healthy',
    driverVersion: 'CANN 7.0.RC1',
    firmwareVersion: '1.0.21.5',
    memoryTotal: 64,
    memoryUsed: 12,
    utilization: 15,
    temperature: 45,
    power: 180,
    tags: ['NPU', 'Native-AI'],
    lastCheck: '2024-05-24 10:14:00'
  },
  {
    id: 'ACC-FPGA-XL-001',
    name: 'sh-test-fpga-01-dev0',
    model: 'Xilinx Alveo U250',
    vendor: 'Xilinx',
    type: 'FPGA',
    nodeId: 'sh-worker-01',
    nodeIp: '172.16.5.42',
    clusterName: '测试集群-上海',
    status: 'online',
    healthStatus: 'healthy',
    driverVersion: 'XRT 2023.2',
    firmwareVersion: '5.2.1',
    memoryTotal: 64,
    memoryUsed: 0,
    utilization: 5,
    temperature: 38,
    power: 75,
    tags: ['FPGA', 'Hardware-Accel'],
    lastCheck: '2024-05-24 10:12:00'
  },
  {
    id: 'ACC-DCU-HY-001',
    name: 'sz-dev-dcu-01-card0',
    model: 'Hygon Z100',
    vendor: 'Hygon',
    type: 'DCU',
    nodeId: 'sz-worker-01',
    nodeIp: '192.168.1.15',
    clusterName: '开发集群-深圳',
    status: 'offline',
    healthStatus: 'critical',
    driverVersion: 'DTK 23.04',
    firmwareVersion: '2.1.0',
    memoryTotal: 32,
    memoryUsed: 0,
    utilization: 0,
    temperature: 0,
    power: 0,
    tags: ['DCU', 'Abnormal'],
    lastCheck: '2024-05-24 09:00:00'
  }
];

export const MOCK_TASKS: Task[] = [
  {
    id: 't-98442',
    name: 'llama3-70b-finetune',
    type: 'training',
    typeName: '模型微调',
    status: 'running',
    statusName: '运行中',
    submitter: 'ai-ops',
    tenantName: '智能研究院-算力组',
    projectName: 'Foundation-Models',
    resourcePoolName: 'GPU 算力池 (A100)',
    priority: 'high',
    resources: { gpu: '16x A100', cpu: '64 Cores', memory: '512 GB' },
    duration: '42h 15m',
    progress: 74,
    submittedAt: '2024-05-22 14:30:00',
    image: 'registry.ai-nex.io/pytorch:2.2.0-cuda12.1',
    command: 'torchrun --nproc_per_node=8 train.py --config configs/llama3.yaml'
  }
];

export const SIDEBAR_ITEMS: Record<string, any[]> = {
  compute: [
    {
      title: '算力纳管',
      items: [
        { id: 'clusters', label: '集群与节点 (Clusters)', icon: Server },
        { id: 'pools', label: '资源池化 (Pools)', icon: Layers },
        { id: 'hetero', label: '异构资源 (Hetero)', icon: Cpu },
      ]
    },
    {
      title: '工作负载',
      items: [
        { id: 'tasks', label: '任务调度 (Tasks)', icon: List },
      ]
    },
    {
      title: '可观测性',
      items: [
        { id: 'monitoring', label: '指标监控', icon: Activity },
      ]
    }
  ],
};

export const MODULE_MENU = [
  { id: 'compute', label: '算力调度', icon: Server },
  { id: 'data', label: '数据管理', icon: Database },
  { id: 'training', label: '模型训练', icon: BrainCircuit },
  { id: 'monitoring', label: '监控中心', icon: Activity },
];
