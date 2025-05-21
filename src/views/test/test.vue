<template>
    <div class="container">
      <div class="row">
        <div class="chart-box">
          <h3>用户密钥对使用情况</h3>
          <div class="chart" ref="heatmapChart"></div>
        </div>
        <div class="chart-box">
          <h3>密钥类型分布</h3>
          <div class="chart" ref="histogramChart"></div>
        </div>
      </div>
  
      <div class="row">
        <div class="chart-box">
          <h3>AP 节点广播次数</h3>
          <div class="chart" ref="lineChart"></div>
        </div>
        <div class="chart-box">
          <h3>群大小分布</h3>
          <div class="chart" ref="pieChart"></div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as echarts from 'echarts'
  
  const heatmapChart = ref()
  const histogramChart = ref()
  const lineChart = ref()
  const pieChart = ref()
  
  // 热力图数据
  const users = ['PC2', 'PC5', 'PC6', 'PC8']
  const keys = ['Key1', 'Key2', 'Key3', 'Key4', 'Key5', 'Key6']
  const heatmapData = []
  for (let i = 0; i < keys.length; i++) {
    for (let j = 0; j < users.length; j++) {
      heatmapData.push([j, i, Math.floor(Math.random() * 100)])
    }
  }
  
  // 密钥类型分布
  const keyTypes = [
    { type: 'RSA-2048', count: 5 },
    { type: 'ECC-P256', count: 3 },
    { type: 'RSA-4096', count: 2 },
    { type: 'SM2', count: 1 }
  ]
  const colors = ['#5470c6', '#91cc75', '#fac858', '#ee6666']
  
  // 广播次数条形图数据（6个AP）
  const broadcastCounts = [
    { name: 'AP-1', count: 120 },
    { name: 'AP-2', count: 85 },
    { name: 'AP-3', count: 60 },
    { name: 'AP-4', count: 45 },
    { name: 'AP-5', count: 30 },
    { name: 'AP-6', count: 20 }
  ]
  
  // 群大小分布
  const groupSizes = [
    { name: 'Group 1', value: 3 },
    { name: 'Group 2', value: 3 },
    { name: 'Group 3', value: 4 },
  ]
  
  onMounted(() => {
    // 热力图
    echarts.init(heatmapChart.value).setOption({
      tooltip: { position: 'top' },
      grid: { height: '60%', top: '10%' },
      xAxis: {
        type: 'category',
        data: users,
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data: keys,
        splitArea: { show: true }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '5%'
      },
      series: [{
        name: '使用频次',
        type: 'heatmap',
        data: heatmapData,
        label: { show: false },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    })
  
    // 直方图
    echarts.init(histogramChart.value).setOption({
      tooltip: {},
      xAxis: {
        type: 'category',
        data: keyTypes.map(k => k.type)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        name: '数量',
        type: 'bar',
        data: keyTypes.map(k => k.count),
        itemStyle: { color: (params) => colors[params.dataIndex] }
      }]
    })
  
    // 横向条形图：AP 节点广播次数
    echarts.init(lineChart.value).setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'value',
        name: '广播次数'
      },
      yAxis: {
        type: 'category',
        data: broadcastCounts.map(ap => ap.name),
        inverse: true
      },
      series: [{
        name: '广播次数',
        type: 'bar',
        data: broadcastCounts.map(ap => ap.count),
        itemStyle: {
          color: '#3d84a8'
        },
        label: {
          show: true,
          position: 'right'
        }
      }]
    })
  
    // 饼图
    echarts.init(pieChart.value).setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [{
        name: '群规模',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: true,
          position: 'outside'
        },
        labelLine: {
          show: true
        },
        data: groupSizes
      }]
    })
  })
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }
  .row {
    display: flex;
    justify-content: space-between;
    gap: 24px;
  }
  .chart-box {
    flex: 1;
    background-color: #fff;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
  .chart {
    width: 100%;
    height: 360px;
  }
  h3 {
    text-align: center;
    margin-bottom: 12px;
    color: #333;
  }
  </style>
  