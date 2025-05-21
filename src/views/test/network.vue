<template>
    <div class="container">
      <div class="charts-row">
        <div class="chart-container">
          <h2>群成员分布拓扑</h2>
          <div class="chart" ref="networkChart" id="no1"></div>
        </div>
        <div class="chart-container" id="no2">
          <h2>接收消息时间线</h2>
          <div class="chart" ref="timelineChart"></div>
        </div>
      </div>
      <div class="table-row">
        <h2>追责操作日志表</h2>
        <TableCustom
          :columns="logColumns"
          :tableData="pagedLogs"
          :total="logPage.total"
          :page-size="logPage.size"
          :current-page="logPage.index"
          @page-change="changeLogPage"
        />
      </div>
    </div>
  </template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import * as echarts from 'echarts';
import TableCustom from '@/components/table-custom.vue';

// 网络拓扑图配置
const networkChart = ref<HTMLElement>();
const networkData = reactive({
  nodes: [] as any[],
  links: [] as any[],
  groupCircles: [] as any[]
});

// 定义群组及其节点
const groups = [
  { name: 'Group1', nodes: ['PC1', 'PC2', 'PC3'] },
  { name: 'Group2', nodes: ['PC4', 'PC5', 'PC6'] },
  { name: 'Group3', nodes: ['PC7', 'PC8', 'PC9', 'PC10'] }
];

// 设置每个群组的圆心和半径
const groupCenters = [
  { x: 200, y: 200, r: 80 },
  { x: 600, y: 200, r: 80 },
  { x: 400, y: 400, r: 100 }
];

// 生成节点和链接数据
groups.forEach((group, index) => {
  const center = groupCenters[index];
  
  // 添加群组圆圈节点
  networkData.groupCircles.push({
    id: `group-${index}`,
    name: group.name,
    x: center.x,
    y: center.y,
    r: center.r,
    category: index
  });
  
  // 生成群组内的PC节点
  const angleStep = (2 * Math.PI) / group.nodes.length;
  group.nodes.forEach((nodeId, i) => {
    const angle = i * angleStep;
    const x = center.x + center.r * 0.7 * Math.cos(angle);
    const y = center.y + center.r * 0.7 * Math.sin(angle);
    
    networkData.nodes.push({
      id: nodeId,
      name: nodeId,
      category: index,
      x,
      y,
      symbolSize: 20,
      itemStyle: {
        color: getNodeColor(index)
      }
    });
    
    // 添加从PC节点到群组圆心的链接
    networkData.links.push({
      source: nodeId,
      target: `group-${index}`,
      lineStyle: {
        width: 1,
        curveness: 0.2,
        opacity: 0.5
      }
    });
  });
});

// 辅助函数：根据群组索引返回颜色
function getNodeColor(groupIndex: number): string {
  const colors = ['#5470c6', '#91cc75', '#fac858'];
  return colors[groupIndex % colors.length];
}

// 时间线图配置（保持不变）
const timelineChart = ref<HTMLElement>();
const timelineData = reactive({
  xAxis: ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
  series: [
    { name: 'Group1', data: [120, 132, 101, 134, 90, 230, 210, 180] },
    { name: 'Group2', data: [220, 182, 191, 234, 290, 330, 310, 280] },
    { name: 'Group3', data: [150, 232, 201, 154, 190, 330, 410, 380] },
  ]
});

// 日志表格配置（保持不变）
const logColumns = ref([
  { prop: 'timestamp', label: '时间戳' },
  { prop: 'operator', label: '操作者ID' },
  { prop: 'action', label: '操作类型' },
  { prop: 'target', label: '目标群/节点' },
  { prop: 'status', label: '结果状态' },
  { prop: 'remark', label: '备注' },
]);

const allLogs = ref([
  { timestamp: '2023-01-01 10:00', operator: 'admin', action: '删除', target: 'Group1', status: '成功', remark: '清理过期数据' },
  { timestamp: '2023-01-01 11:30', operator: 'user1', action: '修改', target: 'PC2', status: '失败', remark: '权限不足' },
  { timestamp: '2023-01-02 09:15', operator: 'admin', action: '添加', target: 'Group3', status: '成功', remark: '新增测试节点' },
  { timestamp: '2023-01-02 14:45', operator: 'user2', action: '连接', target: 'PC4-PC5', status: '成功', remark: '节点通信建立' },
  { timestamp: '2023-01-03 08:20', operator: 'admin', action: '删除', target: 'PC6', status: '失败', remark: '节点正在使用中' },
  { timestamp: '2023-01-03 16:10', operator: 'user3', action: '修改', target: 'Group2', status: '成功', remark: '更新策略规则' },
  { timestamp: '2023-01-04 12:00', operator: 'user1', action: '扫描', target: 'Group3', status: '成功', remark: '定期检查' },
  { timestamp: '2023-01-04 18:25', operator: 'admin', action: '断开', target: 'PC9', status: '成功', remark: '隔离异常节点' },
  { timestamp: '2023-01-05 09:00', operator: 'user2', action: '添加', target: 'PC10', status: '失败', remark: '参数配置错误' },
  { timestamp: '2023-01-05 17:40', operator: 'admin', action: '恢复', target: 'PC6', status: '成功', remark: '节点恢复上线' },
]);

const logPage = reactive({
  index: 1,
  size: 4,
  get total() {
    return allLogs.value.length;
  }
});

const changeLogPage = (val: number) => {
  logPage.index = val;
};

const pagedLogs = computed(() => {
  const start = (logPage.index - 1) * logPage.size;
  return allLogs.value.slice(start, start + logPage.size);
});

// 初始化图表
onMounted(() => {
  if (networkChart.value) {
    const chart = echarts.init(networkChart.value);
    chart.setOption({
      tooltip: {},
      legend: {
        data: groups.map(g => g.name)
      },
      series: [{
        type: 'graph',
        layout: 'none',
        data: [
          ...networkData.nodes,
          ...networkData.groupCircles.map(circle => ({
            ...circle,
            symbol: 'circle',
            symbolSize: circle.r * 2,
            itemStyle: {
              color: 'transparent',
              borderColor: getNodeColor(circle.category),
              borderWidth: 2
            },
            label: {
              show: true,
              position: 'center',
              formatter: circle.name,
              color: '#333',
              fontSize: 14
            }
          }))
        ],
        links: networkData.links,
        categories: groups.map(g => ({ name: g.name })),
        roam: true,
        label: {
          show: true,
          position: 'right',
          formatter: (params: any) => {
            return params.data.id.startsWith('group-') ? '' : params.data.name;
          }
        },
        emphasis: {
          focus: 'adjacency',
          label: { show: true }
        },
        lineStyle: {
          opacity: 0.9,
          width: 1,
          curveness: 0
        }
      }]
    });
  }

  // 时间线图初始化保持不变
  if (timelineChart.value) {
    const chart = echarts.init(timelineChart.value);
    chart.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: { backgroundColor: '#6a7985' }
        }
      },
      legend: {
        data: timelineData.series.map(item => item.name)
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timelineData.xAxis
      },
      yAxis: { type: 'value' },
      series: timelineData.series.map(item => ({
        name: item.name,
        type: 'line',
        stack: 'Total',
        areaStyle: {},
        emphasis: { focus: 'series' },
        data: item.data
      }))
    });
  }
});
</script>

<style scoped>
.container {
  padding: 0px;
  background-color: transparent;
  border: 0;
  width: 100%;
}
.content{
    padding: 0;
}
.charts-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.chart-container{
    margin-top: 10px;
}
.chart-container,
.table-row {
  background-color: #fff;
  padding: 20px;
  padding-left: 0px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.chart-container {
  flex: 1;
  min-width: 400px;
  height: 400px;
}

.chart {
  width: 100%;
  height: 100%;
}
#no2{
    padding-right: 0;
}
h2 {
  margin-bottom: 12px;
  font-weight: 600;
  font-size: 20px;
  color: #333;
  text-align: center;
}

.table-row {
  margin-top: 20px;
  width: 99%;
}
</style>
