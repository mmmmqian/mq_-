
export interface Cluster {
  id: string;
  name: string;
  environment: 'production' | 'testing' | 'development' | 'edge';
  status: 'healthy' | 'degraded' | 'unhealthy';
  k8sVersion: string;
  nodeCount: number;
  cpuUsage: number;
  memoryUsage: number;
  gpuUsage: number;
  region: string;
}

export interface MetricPoint {
  time: string;
  value: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: any;
  category?: string;
}

export interface ProjectQuota {
  cpu: number;
  cpuUsed: number;
  gpu: number;
  gpuUsed: number;
  storage: number;
  storageUsed: number;
  memory: number;
  memoryUsed: number;
  npu?: number;
  npuUsed?: number;
}

export interface ProjectMember {
  userId: string;
  userName: string;
  realName: string;
  role: 'admin' | 'algorithm' | 'developer' | 'scientist';
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  tenantId: string;
  tenantName: string;
  owner: string;
  status: 'active' | 'frozen';
  quota: ProjectQuota;
  memberCount: number;
  createdAt: string;
  description?: string;
}

export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'disabled';
  quota: ProjectQuota;
  projectCount: number;
  projectLimit: number;
  userCount: number;
  createdAt: string;
  description?: string;
}

export type ModuleType = 'compute' | 'data' | 'training' | 'inference' | 'agents' | 'knowledge';

export interface HeterogeneousResource {
  id: string;
  name: string;
  model: string; // e.g., "NVIDIA A100", "Ascend 910B"
  vendor: 'NVIDIA' | 'Huawei' | 'AMD' | 'Cambricon' | 'Hygon' | 'Xilinx' | 'Intel';
  type: 'GPU' | 'NPU' | 'DCU' | 'MLU' | 'FPGA';
  nodeId: string;
  nodeIp: string;
  clusterName: string;
  status: 'online' | 'offline' | 'maintenance';
  healthStatus: 'healthy' | 'warning' | 'critical';
  driverVersion: string;
  firmwareVersion?: string;
  memoryTotal: number; // GB
  memoryUsed: number; // GB
  utilization: number; // %
  temperature: number; // Celsius
  power: number; // Watts
  tags: string[];
  lastCheck: string;
}

export interface ResourceQuota {
  cpu: number; // Cores
  memory: number; // GB
  gpu: number; // Cards
  storage: number; // GB
  pods: number;
}

export interface ResourcePool {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  status: 'active' | 'disabled';
  clusterId: string;
  clusterName: string;
  nodeSelector: string[]; // List of Node IDs or Names
  quota: ResourceQuota;
  used: ResourceQuota;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  tenantName: string;
}

export interface Task {
  id: string;
  name: string;
  type: 'training' | 'inference' | 'preprocessing' | 'other';
  typeName: string;
  status: 'running' | 'pending' | 'completed' | 'failed' | 'cancelled' | 'paused';
  statusName: string;
  submitter: string;
  tenantName: string;
  projectName: string;
  resourcePoolName: string;
  priority: 'high' | 'normal' | 'low';
  resources: {
    gpu: string;
    cpu: string;
    memory: string;
  };
  duration: string;
  progress: number;
  submittedAt: string;
  startedAt?: string;
  image: string;
  command: string;
  nodeName?: string;
  nodeIp?: string;
  errorMessage?: string;
  logs?: string[];
}

export interface InferenceService {
  id: string;
  name: string;
  modelName: string;
  modelVersion: string;
  status: 'running' | 'deploying' | 'failed' | 'stopped';
  replicas: {
    ready: number;
    total: number;
  };
  endpoint: string;
  protocol: 'HTTP' | 'gRPC';
  cpu: string;
  memory: string;
  gpu: string;
  owner: string;
  createdAt: string;
  uptime: string;
}
