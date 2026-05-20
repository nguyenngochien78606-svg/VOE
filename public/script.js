document.addEventListener('DOMContentLoaded', function() {
  initDateRange();
  loadDashboardData();
  
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  const periodTabs = document.querySelectorAll('.period-tab');
  const statActions = document.querySelectorAll('.stat-action');
  
  startDateInput.addEventListener('change', handleDateChange);
  endDateInput.addEventListener('change', handleDateChange);

  periodTabs.forEach(tab => {
    tab.addEventListener('click', handlePeriodChange);
  });

  statActions.forEach(action => {
    action.addEventListener('click', handleStatActionClick);
  });

  const activityHeader = document.getElementById('activityHeader');
  activityHeader.addEventListener('click', toggleActivity);

  initChartInteractions();
});

function initDateRange() {
  const urlParams = new URLSearchParams(window.location.search);
  const startDateInput = document.getElementById('startDate');
  const endDateInput = document.getElementById('endDate');
  
  const urlStartDate = urlParams.get('startDate');
  const urlEndDate = urlParams.get('endDate');
  
  const storedStartDate = localStorage.getItem('dashboard_startDate');
  const storedEndDate = localStorage.getItem('dashboard_endDate');
  
  let startDate = urlStartDate || storedStartDate;
  let endDate = urlEndDate || storedEndDate;
  
  if (!startDate) {
    const defaultStart = new Date();
    defaultStart.setDate(defaultStart.getDate() - 90);
    startDate = formatDate(defaultStart);
  }
  
  if (!endDate) {
    endDate = formatDate(new Date());
  }
  
  startDateInput.value = startDate;
  endDateInput.value = endDate;
  
  localStorage.setItem('dashboard_startDate', startDate);
  localStorage.setItem('dashboard_endDate', endDate);
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDateParams() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  let params = '';
  if (startDate) params += 'startDate=' + encodeURIComponent(startDate);
  if (endDate) params += (params ? '&' : '') + 'endDate=' + encodeURIComponent(endDate);
  return params;
}

function handleStatActionClick(e) {
  e.preventDefault();
  const target = e.target.dataset.target;
  const filter = e.target.dataset.filter;
  
  if (!target) return;
  
  let url = target;
  const dateParams = getDateParams();
  
  if (dateParams) {
    url += '?' + dateParams;
    if (filter) url += '&' + filter;
  } else if (filter) {
    url += '?' + filter;
  }
  
  window.location.href = url;
}

let currentPeriod = 'day';

let activityExpanded = false;

function toggleActivity() {
  const activityList = document.getElementById('activityList');
  const toggleSpan = document.querySelector('.activity-toggle');
  
  if (activityExpanded) {
    activityList.style.display = 'none';
    toggleSpan.textContent = '展开 ▼';
  } else {
    activityList.style.display = 'block';
    toggleSpan.textContent = '收起 ▲';
  }
  activityExpanded = !activityExpanded;
}

function loadDashboardData() {
  try {
    const result = window.mockDashboardData || {
      success: true,
      核心指标: {
        总原声量: { value: 1356, 环比: '+12.3%' },
        待处理原声: { value: 156, 环比: '-8.2%' },
        总需求量: { value: 489, 环比: '+15.6%' },
        完成需求量: { value: 324, 环比: '+23.1%' },
        已逾期需求: { value: 23 },
        原声终止率: { value: '15.2%', 环比: '-2.4%' },
        原声合并率: { value: '68.5%', 环比: '+5.8%' },
        反馈合格率: { value: '87.3%', 环比: '+3.2%' }
      },
      趋势数据: [
        { date: '2026-02-19', 新增原声: 45, 新增需求: 18, 合并率: 40.0 },
        { date: '2026-02-26', 新增原声: 52, 新增需求: 22, 合并率: 42.3 },
        { date: '2026-03-04', 新增原声: 38, 新增需求: 15, 合并率: 39.5 },
        { date: '2026-03-11', 新增原声: 61, 新增需求: 28, 合并率: 45.9 },
        { date: '2026-03-18', 新增原声: 48, 新增需求: 21, 合并率: 43.8 },
        { date: '2026-03-25', 新增原声: 55, 新增需求: 24, 合并率: 43.6 },
        { date: '2026-04-01', 新增原声: 42, 新增需求: 19, 合并率: 45.2 },
        { date: '2026-04-08', 新增原声: 68, 新增需求: 31, 合并率: 45.6 },
        { date: '2026-04-15', 新增原声: 59, 新增需求: 26, 合并率: 44.1 },
        { date: '2026-04-22', 新增原声: 47, 新增需求: 20, 合并率: 42.6 },
        { date: '2026-04-29', 新增原声: 72, 新增需求: 35, 合并率: 48.6 },
        { date: '2026-05-06', 新增原声: 56, 新增需求: 27, 合并率: 48.2 },
        { date: '2026-05-13', 新增原声: 63, 新增需求: 30, 合并率: 47.6 },
        { date: '2026-05-20', 新增原声: 49, 新增需求: 22, 合并率: 44.9 }
      ],
      三级标签分布列表: [
        { name: '智能空间', count: 285, percentage: '21.0%', rankChange: -1 },
        { name: '自动驾驶', count: 243, percentage: '17.9%', rankChange: 1 },
        { name: '第一产品线', count: 215, percentage: '15.9%', rankChange: 0 },
        { name: '第二产品线', count: 198, percentage: '14.6%', rankChange: -2 },
        { name: '集成计划类', count: 167, percentage: '12.3%', rankChange: 2 }
      ],
      状态分布: { 待处理: 156, 已分流: 128, 进行中: 95, 已完成: 87, 已终止: 23 },
      重点需求速览: {
        违规反馈: [
          { id: 'ZDJY-20260520-001', 需求名称: '业务违规处理不及时', 三级标签: '业务违规类', 工单状态: '待处理', 工单经办人: '张伟', 创建时间: '2026-05-20 09:30:00', 关联原声数量: 3 },
          { id: 'ZDJY-20260519-002', 需求名称: '制度执行不到位问题', 三级标签: '业务违规类', 工单状态: '已分流', 工单经办人: '李明', 创建时间: '2026-05-19 14:20:00', 关联原声数量: 2 },
          { id: 'ZDJY-20260518-003', 需求名称: '权限违规操作', 三级标签: '业务违规类', 工单状态: '进行中', 工单经办人: '王芳', 创建时间: '2026-05-18 10:15:00', 关联原声数量: 5 }
        ],
        组织建议: [
          { id: 'ZDJY-20260520-004', 需求名称: '服务团队任务分配优化', 三级标签: '服务组织类', 工单状态: '待处理', 工单经办人: '刘洋', 创建时间: '2026-05-20 11:00:00', 关联原声数量: 4 },
          { id: 'ZDJY-20260519-005', 需求名称: '销售组织架构调整建议', 三级标签: '销售组织类', 工单状态: '已分流', 工单经办人: '陈静', 创建时间: '2026-05-19 16:30:00', 关联原声数量: 6 },
          { id: 'ZDJY-20260517-006', 需求名称: '跨部门协作流程改进', 三级标签: '销售组织类', 工单状态: '已完成', 工单经办人: '赵磊', 创建时间: '2026-05-17 09:00:00', 关联原声数量: 2 }
        ],
        产品建议: [
          { id: 'ZDJY-20260520-007', 需求名称: '优化报表导出功能', 三级标签: '智能空间', 工单状态: '进行中', 工单经办人: '孙丽', 创建时间: '2026-05-20 08:45:00', 关联原声数量: 8 },
          { id: 'ZDJY-20260519-008', 需求名称: '完善数据同步机制', 三级标签: '第一产品线', 工单状态: '已分流', 工单经办人: '周宇', 创建时间: '2026-05-19 13:10:00', 关联原声数量: 5 },
          { id: 'ZDJY-20260518-009', 需求名称: '系统性能优化问题', 三级标签: '自动驾驶', 工单状态: '待处理', 工单经办人: '郑涛', 创建时间: '2026-05-18 15:20:00', 关联原声数量: 12 }
        ],
        制度建议: [
          { id: 'ZDJY-20260520-010', 需求名称: '培训制度完善建议', 三级标签: '培训学院类', 工单状态: '待处理', 工单经办人: '刘芳', 创建时间: '2026-05-20 10:00:00', 关联原声数量: 3 },
          { id: 'ZDJY-20260519-011', 需求名称: '考核制度优化', 三级标签: '交付制度类', 工单状态: '已分流', 工单经办人: '陈思', 创建时间: '2026-05-19 11:30:00', 关联原声数量: 4 },
          { id: 'ZDJY-20260516-012', 需求名称: '审批流程简化', 三级标签: '零售制度类', 工单状态: '已完成', 工单经办人: '宋洋', 创建时间: '2026-05-16 09:15:00', 关联原声数量: 7 }
        ]
      },
      反馈质量监控: [
        { 三级标签: '智能空间', 需求量: 156, 有反馈需求量: 142, 反馈文案总数: 328, 进行中反馈数: 45, 反馈合格需求数: 124, 反馈合格率: '87.3%', 不合格反馈数: 18, 进度反馈数: 89, 总结反馈数: 112, 终止原因反馈数: 23, 进度反馈不合格数: 8, 总结反馈不合格数: 6, 终止原因不合格数: 4 },
        { 三级标签: '自动驾驶', 需求量: 134, 有反馈需求量: 121, 反馈文案总数: 287, 进行中反馈数: 38, 反馈合格需求数: 108, 反馈合格率: '89.3%', 不合格反馈数: 13, 进度反馈数: 76, 总结反馈数: 95, 终止原因反馈数: 19, 进度反馈不合格数: 5, 总结反馈不合格数: 4, 终止原因不合格数: 4 },
        { 三级标签: '第一产品线', 需求量: 118, 有反馈需求量: 105, 反馈文案总数: 246, 进行中反馈数: 32, 反馈合格需求数: 91, 反馈合格率: '86.7%', 不合格反馈数: 14, 进度反馈数: 65, 总结反馈数: 82, 终止原因反馈数: 16, 进度反馈不合格数: 6, 总结反馈不合格数: 5, 终止原因不合格数: 3 },
        { 三级标签: '第二产品线', 需求量: 105, 有反馈需求量: 94, 反馈文案总数: 218, 进行中反馈数: 28, 反馈合格需求数: 82, 反馈合格率: '87.2%', 不合格反馈数: 12, 进度反馈数: 58, 总结反馈数: 73, 终止原因反馈数: 14, 进度反馈不合格数: 4, 总结反馈不合格数: 5, 终止原因不合格数: 3 },
        { 三级标签: '集成计划类', 需求量: 89, 有反馈需求量: 81, 反馈文案总数: 189, 进行中反馈数: 24, 反馈合格需求数: 72, 反馈合格率: '88.9%', 不合格反馈数: 9, 进度反馈数: 51, 总结反馈数: 63, 终止原因反馈数: 12, 进度反馈不合格数: 3, 总结反馈不合格数: 4, 终止原因不合格数: 2 }
      ],
      处理时效监控: [
        { 三级标签: '智能空间', 需求量: 156, 逾期量: 12, 逾期率: '7.7%', 待处理逾期: 4, 已分流逾期: 3, 进行中逾期: 5, 分流时长: '8.5h', 启动时长: '18.2h', 处理时长: '45.6h', 总时长: '72.3h', 已闭环需求量: 89, 按时闭环率: '91.0%' },
        { 三级标签: '自动驾驶', 需求量: 134, 逾期量: 8, 逾期率: '6.0%', 待处理逾期: 2, 已分流逾期: 3, 进行中逾期: 3, 分流时长: '6.8h', 启动时长: '15.4h', 处理时长: '38.9h', 总时长: '61.1h', 已闭环需求量: 76, 按时闭环率: '93.4%' },
        { 三级标签: '第一产品线', 需求量: 118, 逾期量: 15, 逾期率: '12.7%', 待处理逾期: 6, 已分流逾期: 4, 进行中逾期: 5, 分流时长: '12.3h', 启动时长: '22.1h', 处理时长: '52.4h', 总时长: '86.8h', 已闭环需求量: 62, 按时闭环率: '85.5%' },
        { 三级标签: '第二产品线', 需求量: 105, 逾期量: 6, 逾期率: '5.7%', 待处理逾期: 2, 已分流逾期: 2, 进行中逾期: 2, 分流时长: '7.2h', 启动时长: '16.8h', 处理时长: '41.2h', 总时长: '65.2h', 已闭环需求量: 58, 按时闭环率: '94.8%' },
        { 三级标签: '集成计划类', 需求量: 89, 逾期量: 4, 逾期率: '4.5%', 待处理逾期: 1, 已分流逾期: 2, 进行中逾期: 1, 分流时长: '5.6h', 启动时长: '13.2h', 处理时长: '35.8h', 总时长: '54.6h', 已闭环需求量: 52, 按时闭环率: '96.2%' }
      ],
      满意度低分警示: [
        { 需求名称: '系统响应速度慢，影响工作效率', 三级标签: '第一产品线', 工单状态: '进行中', 工单经办人: '张伟', 评分: 1, 评价原文: '响应速度很慢，处理方式也不满意', 合并需求编号: 'ZDJY-20260515-001' },
        { 需求名称: '界面操作复杂，学习成本高', 三级标签: '智能空间', 工单状态: '已分流', 工单经办人: '李明', 评分: 1, 评价原文: '整体体验很差，希望能改进', 合并需求编号: 'ZDJY-20260514-002' },
        { 需求名称: '数据同步延迟严重', 三级标签: '第二产品线', 工单状态: '待处理', 工单经办人: '王芳', 评分: 1, 评价原文: '处理不及时，反馈质量较差', 合并需求编号: 'ZDJY-20260513-003' },
        { 需求名称: '审批流程过于繁琐', 三级标签: '交付制度类', 工单状态: '进行中', 工单经办人: '刘洋', 评分: 1, 评价原文: '服务态度一般，响应有待提高', 合并需求编号: 'ZDJY-20260512-004' },
        { 需求名称: '移动端适配问题较多', 三级标签: '自动驾驶', 工单状态: '已分流', 工单经办人: '陈静', 评分: 2, 评价原文: '功能基本满足，但是还有不少问题', 合并需求编号: 'ZDJY-20260511-005' },
        { 需求名称: '部分功能存在bug', 三级标签: '智能空间', 工单状态: '待处理', 工单经办人: '赵磊', 评分: 2, 评价原文: '体验还行，但有改进空间', 合并需求编号: 'ZDJY-20260510-006' },
        { 需求名称: '报表导出格式单一', 三级标签: '第一产品线', 工单状态: '进行中', 工单经办人: '孙丽', 评分: 2, 评价原文: '处理及时，但是细节还有问题', 合并需求编号: 'ZDJY-20260509-007' },
        { 需求名称: '权限配置不够灵活', 三级标签: '零售制度类', 工单状态: '已完成', 工单经办人: '周宇', 评分: 2, 评价原文: '功能不错，但有一些小bug', 合并需求编号: 'ZDJY-20260508-008' },
        { 需求名称: '培训资料不够完善', 三级标签: '培训学院类', 工单状态: '待处理', 工单经办人: '郑涛', 评分: 3, 评价原文: '整体还可以，建议增加更多培训内容', 合并需求编号: 'ZDJY-20260507-009' },
        { 需求名称: '文档说明不够清晰', 三级标签: '集成计划类', 工单状态: '已分流', 工单经办人: '刘芳', 评分: 3, 评价原文: '文档需要进一步完善', 合并需求编号: 'ZDJY-20260506-010' },
        { 需求名称: '部分页面加载慢', 三级标签: '第二产品线', 工单状态: '进行中', 工单经办人: '陈思', 评分: 3, 评价原文: '整体体验一般', 合并需求编号: 'ZDJY-20260505-011' },
        { 需求名称: '操作指引不够明确', 三级标签: '市场营销类', 工单状态: '已完成', 工单经办人: '宋洋', 评分: 3, 评价原文: '建议增加操作指引文档', 合并需求编号: 'ZDJY-20260504-012' }
      ],
      全量处理动态: [
        { 提需人: '张伟', 时间: '2026-05-20 14:30:00', 需求内容: '建议优化报表导出功能...', 操作: '提交需求', 三级标签: '第一产品线' },
        { 提需人: '李明', 时间: '2026-05-20 14:15:00', 需求内容: '希望增加数据同步机制...', 操作: '已分流', 三级标签: '第二产品线' },
        { 提需人: '王芳', 时间: '2026-05-20 13:45:00', 需求内容: '反馈系统响应慢...', 操作: '开始处理', 三级标签: '智能空间' },
        { 提需人: '刘洋', 时间: '2026-05-20 13:20:00', 需求内容: '建议改进审批流程...', 操作: '已完成', 三级标签: '交付制度类' },
        { 提需人: '陈静', 时间: '2026-05-20 12:50:00', 需求内容: '希望增加新功能...', 操作: '提交需求', 三级标签: '自动驾驶' },
        { 提需人: '赵磊', 时间: '2026-05-20 11:30:00', 需求内容: '反馈登录问题...', 操作: '已分流', 三级标签: '智能空间' },
        { 提需人: '孙丽', 时间: '2026-05-20 10:45:00', 需求内容: '建议优化用户体验...', 操作: '开始处理', 三级标签: '第一产品线' },
        { 提需人: '周宇', 时间: '2026-05-20 09:30:00', 需求内容: '希望增加移动端支持...', 操作: '已终止', 三级标签: '第二产品线' },
        { 提需人: '郑涛', 时间: '2026-05-19 16:20:00', 需求内容: '反馈页面加载慢...', 操作: '提交需求', 三级标签: '自动驾驶' },
        { 提需人: '刘芳', 时间: '2026-05-19 15:40:00', 需求内容: '建议改进权限管理...', 操作: '已分流', 三级标签: '零售制度类' }
      ],
      meta: { 筛选范围: '全部数据', 原声总数: 1356, 需求总数: 489 }
    };
    
    updateCoreMetrics(result.核心指标);
    updateTrendChart(result.趋势数据);
    updateCategoryDistribution(result.三级标签分布列表);
    updateLifecycle(result.状态分布);
    updateQuickView(result.重点需求速览);
    updateQualityTable(result.反馈质量监控);
    updateTimingTable(result.处理时效监控);
    updateWarningList(result.满意度低分警示);
    updateActivityList(result.全量处理动态);
    updateFilterInfo(result.meta);
    
    setTimeout(() => {
      const trendChartContainer = document.getElementById('trendChartContainer');
      const barChartContainer = document.getElementById('categoryDistribution');
      if (trendChartContainer) trendChartContainer.classList.add('animate');
      if (barChartContainer) barChartContainer.classList.add('animate');
    }, 50);
  } catch (error) {
    console.error('加载数据失败:', error);
  }
}

function handleDateChange() {
  const startDate = document.getElementById('startDate').value;
  const endDate = document.getElementById('endDate').value;
  
  localStorage.setItem('dashboard_startDate', startDate);
  localStorage.setItem('dashboard_endDate', endDate);
  
  const params = new URLSearchParams();
  if (startDate) params.set('startDate', startDate);
  if (endDate) params.set('endDate', endDate);
  
  const newUrl = window.location.pathname + '?' + params.toString();
  history.pushState({ path: newUrl }, '', newUrl);
  
  if (startDate && endDate) {
    loadDashboardData();
  }
}

function handlePeriodChange(e) {
  const period = e.target.dataset.period;
  if (!period) return;
  
  currentPeriod = period;
  
  document.querySelectorAll('.period-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  e.target.classList.add('active');
  
  loadDashboardData();
}

function updateFilterInfo(meta) {
  const filterInfo = document.getElementById('filterInfo');
  if (meta && filterInfo) {
    filterInfo.textContent = '当前显示: ' + meta.筛选范围 + ' | 原声: ' + meta.原声总数 + '条 | 需求: ' + meta.需求总数 + '条';
  }
}

function updateCoreMetrics(metrics) {
  updateMetric('totalVoice', metrics.总原声量);
  updateMetric('pendingVoice', metrics.待处理原声);
  updateMetric('totalDemand', metrics.总需求量);
  updateMetric('overdueDemand', metrics.已逾期需求, true);
  updateMetric('completedDemand', metrics.完成需求量);
  updateMetric('terminationRate', metrics.原声终止率);
  updateMetric('mergeRate', metrics.原声合并率);
  updateMetric('feedbackRate', metrics.反馈合格率);
}

function updateMetric(elementId, metric, noTrend) {
  const valueEl = document.getElementById(elementId);
  const trendEl = document.getElementById(elementId + 'Trend');
  
  if (valueEl) {
    valueEl.textContent = metric.value !== undefined ? metric.value : '--';
  }
  
  if (trendEl && !noTrend) {
    const trend = metric.环比 || '--';
    const trendClass = getTrendClass(trend);
    const arrow = trendClass === 'trend-up' ? '↑' : trendClass === 'trend-down' ? '↓' : '';
    trendEl.innerHTML = '<span class="trend-label">环比</span>' + trend + ' <span>' + arrow + '</span>';
    trendEl.className = 'stat-trend ' + trendClass;
  }
}

function getTrendClass(value) {
  if (!value) return 'trend-neutral';
  if (value.startsWith('+')) return 'trend-up';
  if (value.startsWith('-')) return 'trend-down';
  return 'trend-neutral';
}

function updateTrendChart(trendData) {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;
  
  const container = document.getElementById('trendChartContainer');
  if (!container) return;
  
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  
  const containerRect = container.getBoundingClientRect();
  const width = containerRect.width;
  const height = containerRect.height;
  
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);
  
  ctx.clearRect(0, 0, width, height);
  
  if (!trendData || trendData.length === 0) {
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('暂无数据', width / 2, height / 2);
    return;
  }
  
  const padding = { top: 45, right: 70, bottom: 55, left: 70 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  
  const voiceValues = trendData.map(d => d.新增原声);
  const demandValues = trendData.map(d => d.新增需求);
  const rateValues = trendData.map(d => d.合并率);
  
  const maxVoiceDemand = Math.max.apply(Math, voiceValues.concat(demandValues).concat([1]));
  const maxRate = 100;
  const rateScaledValues = rateValues.map(r => (r / maxRate) * maxVoiceDemand);
  
  const xStep = trendData.length > 1 ? chartWidth / (trendData.length - 1) : 0;
  
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(padding.left, padding.top, chartWidth, chartHeight);
  
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.setLineDash([]);
  const gridLines = 6;
  for (let i = 0; i <= gridLines; i++) {
    const y = padding.top + (chartHeight / gridLines) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    
    const voiceValue = Math.round(maxVoiceDemand - (maxVoiceDemand / gridLines) * i);
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(String(voiceValue), padding.left - 8, y + 4);
    
    const rateValue = Math.round(((gridLines - i) / gridLines) * maxRate);
    ctx.fillStyle = '#059669';
    ctx.textAlign = 'left';
    ctx.fillText(rateValue + '%', width - padding.right + 8, y + 4);
  }
  
  ctx.fillStyle = '#6b7280';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('需求数量', padding.left - 8, padding.top - 12);
  
  ctx.fillStyle = '#059669';
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('合并率', width - padding.right + 8, padding.top - 12);
  
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.textAlign = 'center';
  
  const step = Math.max(1, Math.floor(trendData.length / 8));
  for (let i = 0; i < trendData.length; i += step) {
    const x = padding.left + xStep * i;
    const dateStr = trendData[i].date.substring(5);
    ctx.fillText(dateStr, x, height - 20);
  }

  drawSmoothLineWithFill(voiceValues, '#3b82f6', 'rgba(59, 130, 246, 0.3)', maxVoiceDemand);
  drawSmoothLineWithFill(demandValues, '#f59e0b', 'rgba(245, 158, 11, 0.3)', maxVoiceDemand);
  
  ctx.setLineDash([6, 4]);
  const ratePoints = trendData.map(function(d, i) {
    return {
      x: padding.left + xStep * i,
      y: padding.top + chartHeight * (1 - Math.max(0, Math.min(1, rateScaledValues[i] / maxVoiceDemand)))
    };
  });
  
  ctx.beginPath();
  ctx.moveTo(ratePoints[0].x, ratePoints[0].y);
  for (let i = 1; i < ratePoints.length; i++) {
    ctx.lineTo(ratePoints[i].x, ratePoints[i].y);
  }
  ctx.strokeStyle = '#059669';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.strokeRect(padding.left, padding.top, chartWidth, chartHeight);

  const legends = [
    { label: '新增原声', color: '#3b82f6' },
    { label: '新增需求', color: '#f59e0b' },
    { label: '合并率', color: '#059669' }
  ];
  
  const legendStartX = width - padding.right - 260;
  const legendY = padding.top - 20;
  let legendX = legendStartX;
  
  ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  
  legends.forEach(function(legend) {
    ctx.beginPath();
    ctx.arc(legendX + 6, legendY + 4, 5, 0, Math.PI * 2);
    ctx.fillStyle = legend.color;
    ctx.fill();
    
    ctx.fillStyle = '#6b7280';
    ctx.textAlign = 'left';
    ctx.fillText(legend.label, legendX + 16, legendY + 8);
    legendX += 90;
  });

  window.trendChartData = {
    trendData: trendData,
    voiceValues: voiceValues,
    demandValues: demandValues,
    rateValues: rateValues,
    maxVoiceDemand: maxVoiceDemand,
    maxRate: maxRate,
    xStep: xStep,
    padding: padding,
    chartHeight: chartHeight,
    width: width,
    height: height
  };

  function drawSmoothLineWithFill(values, color, fillColor, maxValue) {
    const points = trendData.map(function(d, i) {
      return {
        x: padding.left + xStep * i,
        y: padding.top + chartHeight * (1 - Math.max(0, Math.min(1, values[i] / maxValue)))
      };
    });
    
    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      
      if (points.length <= 2) {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      } else {
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const next = points[i + 1];
          
          if (next) {
            const cp1x = prev.x + (curr.x - prev.x) / 3;
            const cp1y = prev.y;
            const cp2x = curr.x - (next.x - prev.x) / 3;
            const cp2y = curr.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y);
          } else {
            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y;
            ctx.quadraticCurveTo(cp1x, cp1y, curr.x, curr.y);
          }
        }
      }
      
      ctx.lineTo(points[points.length - 1].x, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
    }
    
    ctx.beginPath();
    if (points.length > 0) {
      ctx.moveTo(points[0].x, points[0].y);
      
      if (points.length <= 2) {
        for (let i = 1; i < points.length; i++) {
          ctx.lineTo(points[i].x, points[i].y);
        }
      } else {
        for (let i = 1; i < points.length; i++) {
          const prev = points[i - 1];
          const curr = points[i];
          const next = points[i + 1];
          
          if (next) {
            const cp1x = prev.x + (curr.x - prev.x) / 3;
            const cp1y = prev.y;
            const cp2x = curr.x - (next.x - prev.x) / 3;
            const cp2y = curr.y;
            ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, curr.x, curr.y);
          } else {
            const cp1x = prev.x + (curr.x - prev.x) * 0.5;
            const cp1y = prev.y;
            ctx.quadraticCurveTo(cp1x, cp1y, curr.x, curr.y);
          }
        }
      }
      
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    }
  }
}

function initChartInteractions() {
  const canvas = document.getElementById('trendChart');
  if (!canvas) return;

  canvas.addEventListener('mousemove', handleChartHover);
  canvas.addEventListener('mouseleave', hideTooltip);
}

function handleChartHover(e) {
  const canvas = document.getElementById('trendChart');
  if (!canvas || !window.trendChartData) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const data = window.trendChartData;
  const index = Math.round((x - data.padding.left) / data.xStep);
  
  if (index >= 0 && index < data.trendData.length) {
    const date = data.trendData[index].date;
    const voice = data.voiceValues[index];
    const demand = data.demandValues[index];
    const rate = data.rateValues[index];

    showTooltip(e.clientX, e.clientY, { date: date, voice: voice, demand: demand, rate: rate });
  }
}

function showTooltip(x, y, data) {
  let tooltip = document.getElementById('chartTooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'chartTooltip';
    tooltip.style.cssText = 'position: fixed;background: #1e293b;color: #fff;padding: 12px 16px;border-radius: 8px;font-size: 13px;box-shadow: 0 4px 12px rgba(0,0,0,0.2);pointer-events: none;z-index: 1000;opacity: 0;transition: opacity 0.2s ease;';
    document.body.appendChild(tooltip);
  }

  tooltip.innerHTML = '<div style="font-weight: 600;margin-bottom: 8px;border-bottom: 1px solid #374151;padding-bottom: 8px;">' + data.date + '</div><div style="display: flex;align-items: center;gap: 8px;margin-bottom: 4px;"><span style="display: inline-block;width: 10px;height: 3px;background: #3b82f6;"></span><span>新增原声: <strong>' + data.voice + '</strong></span></div><div style="display: flex;align-items: center;gap: 8px;margin-bottom: 4px;"><span style="display: inline-block;width: 10px;height: 3px;background: #f59e0b;"></span><span>新增需求: <strong>' + data.demand + '</strong></span></div><div style="display: flex;align-items: center;gap: 8px;"><span style="display: inline-block;width: 10px;height: 3px;background: #059669;"></span><span>合并率: <strong>' + data.rate + '%</strong></span></div>';

  tooltip.style.left = (x + 15) + 'px';
  tooltip.style.top = (y - 80) + 'px';
  tooltip.style.opacity = '1';
}

function hideTooltip() {
  const tooltip = document.getElementById('chartTooltip');
  if (tooltip) {
    tooltip.style.opacity = '0';
  }
}

function updateCategoryDistribution(data) {
  const container = document.getElementById('categoryDistribution');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!data || data.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 1rem;">暂无数据</p>';
    return;
  }
  
  const maxCount = Math.max.apply(Math, data.map(function(d) { return d.count; }));
  
  data.forEach(function(item, index) {
    const widthPercent = (item.count / maxCount) * 100;
    
    const barItem = document.createElement('div');
    barItem.className = 'bar-item';
    barItem.style.opacity = '0';
    barItem.style.transform = 'translateX(-20px)';
    barItem.style.transition = 'opacity 0.5s ease-out ' + (index * 0.1) + 's, transform 0.5s ease-out ' + (index * 0.1) + 's';
    
    const rank = document.createElement('div');
    rank.className = 'bar-rank ' + (index < 3 ? 'rank-' + (index + 1) : 'rank-other');
    rank.textContent = String(index + 1);
    
    const name = document.createElement('div');
    name.className = 'bar-name';
    name.textContent = item.name;
    
    const barWrapper = document.createElement('div');
    barWrapper.className = 'bar-wrapper';
    
    const barFill = document.createElement('div');
    barFill.className = 'bar-fill';
    barFill.style.width = '0';
    
    barWrapper.appendChild(barFill);
    
    const stats = document.createElement('div');
    stats.className = 'bar-stats';
    
    const changeTrend = item.rankChange !== undefined ? (item.rankChange > 0 ? '↑' + item.rankChange : item.rankChange < 0 ? '↓' + Math.abs(item.rankChange) : '—') : '';
    const trendColor = item.rankChange > 0 ? '#059669' : item.rankChange < 0 ? '#ef4444' : '#6b7280';
    
    stats.innerHTML = '<span>' + item.count + '</span><span>' + item.percentage + '</span><span style="color: ' + trendColor + '; font-weight: 600;">' + changeTrend + '</span>';
    
    barItem.appendChild(rank);
    barItem.appendChild(name);
    barItem.appendChild(barWrapper);
    barItem.appendChild(stats);
    
    container.appendChild(barItem);
    
    setTimeout(function() {
      barItem.style.opacity = '1';
      barItem.style.transform = 'translateX(0)';
      setTimeout(function() {
        barFill.style.width = widthPercent + '%';
      }, 150);
    }, 100 + index * 100);
  });
}

function updateLifecycle(data) {
  const container = document.getElementById('lifecycleContainer');
  if (!container) return;
  
  container.innerHTML = '';
  
  const dateParams = getDateParams();
  
  const stages = [
    { key: '已分流', label: '已分流', color: 'processing', baseUrl: 'demand-table.html', filter: 'status=已分流' },
    { key: '进行中', label: '进行中', color: 'ongoing', baseUrl: 'demand-table.html', filter: 'status=进行中' },
    { key: '已完成', label: '已完成/已终止', color: 'completed', baseUrl: 'demand-table.html', filter: 'status=已完成,已终止' }
  ];
  
  stages.forEach(function(stage, index) {
    const stageEl = document.createElement('div');
    stageEl.className = 'lifecycle-stage';
    
    let url = stage.baseUrl;
    if (dateParams) {
      url += '?' + dateParams + '&' + stage.filter;
    } else {
      url += '?' + stage.filter;
    }
    
    stageEl.addEventListener('click', function() {
      window.location.href = url;
    });
    
    const box = document.createElement('div');
    box.className = 'lifecycle-box ' + stage.color;
    let count = data[stage.key] || 0;
    if (stage.key === '已完成') {
      count = (data['已完成'] || 0) + (data['已终止'] || 0);
    }
    box.innerHTML = '<div style="font-size: 1.5rem;">' + count + '</div><div style="font-size: 0.75rem; margin-top: 2px;">' + stage.label + '</div>';
    
    const label = document.createElement('div');
    label.className = 'lifecycle-label';
    
    stageEl.appendChild(box);
    stageEl.appendChild(label);
    
    container.appendChild(stageEl);
    
    if (index < stages.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'lifecycle-arrow';
      arrow.textContent = '→';
      container.appendChild(arrow);
    }
  });
}

function updateQuickView(data) {
  updateQuickViewSection('violationList', data.违规反馈);
  updateQuickViewSection('organizationList', data.组织建议);
  updateQuickViewSection('productList', data.产品建议);
  updateQuickViewSection('systemList', data.制度建议);
  
  document.getElementById('violationCount').textContent = (data.违规反馈 || []).length;
  document.getElementById('organizationCount').textContent = (data.组织建议 || []).length;
  document.getElementById('productCount').textContent = (data.产品建议 || []).length;
  document.getElementById('systemCount').textContent = (data.制度建议 || []).length;
}

function updateQuickViewSection(containerId, items) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!items || items.length === 0) {
    container.innerHTML = '<div class="quick-view-item" style="color: #9ca3af;">暂无数据</div>';
    return;
  }
  
  const dateParams = getDateParams();
  
  items.forEach(function(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'quick-view-item';
    itemEl.style.cursor = 'pointer';
    itemEl.addEventListener('click', function() {
      let url = item.id ? 'demand-table.html?id=' + encodeURIComponent(item.id) : 'demand-table.html';
      
      if (dateParams) {
        const separator = url.indexOf('?') >= 0 ? '&' : '?';
        url += separator + dateParams;
      }
      
      window.location.href = url;
    });
    
    // 提取关键信息展示
    const keyInfo = extractKeyInfo(item);
    
    const title = document.createElement('div');
    title.className = 'quick-view-title';
    title.textContent = keyInfo.title;
    
    const meta = document.createElement('div');
    meta.className = 'quick-view-meta';
    
    const statusClass = getStatusClass(item.工单状态);
    const statusBadge = '<span class="quick-view-badge ' + statusClass + '">' + item.工单状态 + '</span>';
    const assignee = '<span>' + (item.工单经办人 || '--') + '</span>';
    const voiceCount = item.关联原声数量 ? '<span>关联原声: ' + item.关联原声数量 + '</span>' : '';
    
    meta.innerHTML = statusBadge + assignee + voiceCount;
    
    itemEl.appendChild(title);
    itemEl.appendChild(meta);
    
    container.appendChild(itemEl);
  });
}

function extractKeyInfo(item) {
  let title = item.需求名称;
  let desc = '';
  
  // 从需求名称中提取关键信息，进行简洁展示
  title = summarizeDemandTitle(item.需求名称);
  
  return { title, desc };
}

function summarizeDemandTitle(title) {
  if (!title) return '';
  
  let result = title;
  
  result = result.replace(/^(问题：|问题|建议：|建议|需求：|需求|反馈：|反馈|关于|一线反馈)/, '').trim();
  
  const colonIndex = result.indexOf('：');
  if (colonIndex !== -1) {
    result = result.substring(0, colonIndex).trim();
  }
  
  if (result.length > 14) {
    result = extractCoreKeyword(result);
  }
  
  return result || title;
}

function extractCoreKeyword(title) {
  const keywords = ['优化', '改进', '完善', '改进', '修复', '增强', '提升', '简化', '调整', '新增'];
  
  for (const keyword of keywords) {
    const idx = title.indexOf(keyword);
    if (idx !== -1) {
      const before = title.substring(0, idx).trim();
      const after = title.substring(idx, idx + 4).trim();
      const combined = (before.length > 6 ? before.substring(0, 6) : before) + after;
      return combined.length > 14 ? combined.substring(0, 14) : combined;
    }
  }
  
  return title.substring(0, 14);
}

function getStatusClass(status) {
  const map = {
    '待处理': 'pending',
    '已分流': 'processing',
    '进行中': 'ongoing',
    '已完成': 'completed',
    '已终止': 'terminated'
  };
  return map[status] || 'pending';
}

function updateQualityTable(data) {
  const table = document.getElementById('qualityTable');
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="13" style="text-align: center; color: #9ca3af;">暂无数据</td></tr>';
    return;
  }
  
  const dateParams = getDateParams();
  
  data.forEach(function(item) {
    const row = document.createElement('tr');
    
    const progressBtn = createJumpButton(item.进度反馈不合格数, '进度', item.三级标签, dateParams);
    const summaryBtn = createJumpButton(item.总结反馈不合格数, '总结', item.三级标签, dateParams);
    const reasonBtn = createJumpButton(item.终止原因不合格数, '终止原因', item.三级标签, dateParams);
    
    row.innerHTML = '<td style="font-weight: 500; text-align: left;">' + item.三级标签 + '</td><td>' + (item.需求量 || 0) + '</td><td>' + (item.有反馈需求量 || 0) + '</td><td>' + (item.反馈文案总数 || 0) + '</td><td>' + (item.进行中反馈数 || 0) + '</td><td>' + (item.总结反馈数 || 0) + '</td><td>' + (item.终止原因反馈数 || 0) + '</td><td>' + (item.反馈合格需求数 || 0) + '</td><td class="pass-rate">' + (item.反馈合格率 || '0%') + '</td><td class="fail-count">' + (item.不合格反馈数 || 0) + '</td><td>' + progressBtn + '</td><td>' + summaryBtn + '</td><td>' + reasonBtn + '</td>';
    tbody.appendChild(row);
  });
}

function createJumpButton(count, type, tag, dateParams) {
  const num = parseInt(count) || 0;
  if (num <= 0) {
    return '<span style="color: #9ca3af;">—</span>';
  }
  
  const url = 'quality-table.html?tag=' + encodeURIComponent(tag) + '&feedbackType=' + encodeURIComponent(type) + '&qualified=false' + (dateParams ? '&' + dateParams : '');
  
  return '<button class="jump-btn" onclick="window.location.href=\'' + url + '\'">' + num + '</button>';
}

function updateTimingTable(data) {
  const table = document.getElementById('timingTable');
  if (!table) return;
  
  const tbody = table.querySelector('tbody');
  if (!tbody) return;
  
  tbody.innerHTML = '';
  
  if (!data || data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="14" style="text-align: center; color: #9ca3af;">暂无数据</td></tr>';
    return;
  }
  
  const dateParams = getDateParams();
  
  data.forEach(function(item) {
    const row = document.createElement('tr');
    
    const pendingOverdueBtn = createTimingJumpButton(item.待处理逾期, '待处理逾期', item.三级标签, dateParams);
    const assignedOverdueBtn = createTimingJumpButton(item.已分流逾期, '已分流逾期', item.三级标签, dateParams);
    const ongoingOverdueBtn = createTimingJumpButton(item.进行中逾期, '进行中逾期', item.三级标签, dateParams);
    
    row.innerHTML = '<td>' + item.三级标签 + '</td><td>' + item.需求量 + '</td><td class="fail-count">' + item.逾期量 + '</td><td>' + item.逾期率 + '</td><td>' + pendingOverdueBtn + '</td><td>' + assignedOverdueBtn + '</td><td>' + ongoingOverdueBtn + '</td><td>' + item.分流时长 + '</td><td>' + item.启动时长 + '</td><td>' + item.处理时长 + '</td><td>' + item.总时长 + '</td><td>' + item.已闭环需求量 + '</td><td class="pass-rate">' + item.按时闭环率 + '</td>';
    tbody.appendChild(row);
  });
}

function createTimingJumpButton(count, type, tag, dateParams) {
  const num = parseInt(count) || 0;
  if (num <= 0) {
    return '<span style="color: #9ca3af;">—</span>';
  }
  
  const url = 'quality-table.html?tag=' + encodeURIComponent(tag) + '&overdue=true&status=' + encodeURIComponent(type) + (dateParams ? '&' + dateParams : '');
  
  return '<button class="jump-btn" onclick="window.location.href=\'' + url + '\'">' + num + '</button>';
}

function updateWarningList(data) {
  const container = document.getElementById('warningList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="warning-item" style="justify-content: center; color: #9ca3af;">暂无低分满意度数据</div>';
    return;
  }
  
  const dateParams = getDateParams();
  
  data.forEach(function(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'warning-item';
    
    const score = parseInt(item.评分) || 1;
    let borderColor = 'rgba(239, 68, 68, 0.3)';
    if (score === 1) {
      borderColor = 'rgba(220, 38, 38, 0.8)';
      itemEl.classList.add('warning-score-1');
    } else if (score === 2) {
      borderColor = 'rgba(239, 68, 68, 0.5)';
      itemEl.classList.add('warning-score-2');
    } else {
      itemEl.classList.add('warning-score-3');
    }
    itemEl.style.borderLeft = '4px solid ' + borderColor;
    
    const content = document.createElement('div');
    content.className = 'warning-content';
    content.style.cursor = 'pointer';
    content.addEventListener('click', function() {
      let url = item.合并需求编号 ? 'quality-table.html?id=' + encodeURIComponent(item.合并需求编号) : 'quality-table.html';
      
      if (dateParams) {
        const separator = url.indexOf('?') >= 0 ? '&' : '?';
        url += separator + dateParams;
      }
      
      window.location.href = url;
    });
    
    const leftCol = document.createElement('div');
    leftCol.style.display = 'flex';
    leftCol.style.flexDirection = 'column';
    leftCol.style.gap = '6px';
    leftCol.style.flexShrink = '0';
    
    const title = document.createElement('div');
    title.style.fontWeight = '500';
    title.style.color = '#1e293b';
    title.style.fontSize = '0.95rem';
    title.textContent = item.需求名称;
    
    const meta = document.createElement('div');
    meta.style.display = 'flex';
    meta.style.flexWrap = 'wrap';
    meta.style.gap = '1rem';
    meta.style.fontSize = '0.85rem';
    meta.style.color = '#64748b';
    
    const tagSpan = document.createElement('span');
    tagSpan.textContent = '标签: ' + item.三级标签;
    
    const statusSpan = document.createElement('span');
    statusSpan.textContent = '状态: ' + item.工单状态;
    
    const handlerSpan = document.createElement('span');
    handlerSpan.textContent = '经办人: ' + (item.工单经办人 || '--');
    
    meta.appendChild(tagSpan);
    meta.appendChild(statusSpan);
    meta.appendChild(handlerSpan);
    
    leftCol.appendChild(title);
    leftCol.appendChild(meta);
    
    const rightCol = document.createElement('div');
    rightCol.style.display = 'flex';
    rightCol.style.flexDirection = 'column';
    rightCol.style.alignItems = 'flex-end';
    rightCol.style.justifyContent = 'space-between';
    rightCol.style.minWidth = '200px';
    rightCol.style.maxWidth = '300px';
    rightCol.style.marginLeft = 'auto';
    
    const scoreBadge = document.createElement('div');
    scoreBadge.className = 'score-badge';
    scoreBadge.textContent = item.评分 + '分';
    
    const comment = document.createElement('div');
    comment.style.fontSize = '0.85rem';
    comment.style.color = '#64748b';
    comment.style.maxWidth = '280px';
    comment.style.textAlign = 'right';
    comment.style.fontStyle = 'italic';
    comment.style.marginTop = '8px';
    comment.textContent = '"' + (item.评价原文 || '--') + '"';
    
    rightCol.appendChild(scoreBadge);
    rightCol.appendChild(comment);
    
    content.appendChild(leftCol);
    content.appendChild(rightCol);
    
    itemEl.appendChild(content);
    
    container.appendChild(itemEl);
  });
}

function updateActivityList(data) {
  const container = document.getElementById('activityList');
  if (!container) return;
  
  container.innerHTML = '';
  
  if (!data || data.length === 0) {
    container.innerHTML = '<div class="activity-item" style="text-align: center; color: #9ca3af;">暂无处理动态</div>';
    return;
  }
  
  data.forEach(function(item) {
    const itemEl = document.createElement('div');
    itemEl.className = 'activity-item';
    
    const content = document.createElement('div');
    content.className = 'activity-content';
    content.textContent = item.提需人 + ' ' + item.操作 + ': ' + item.需求内容;
    
    const time = document.createElement('div');
    time.className = 'activity-time';
    time.textContent = item.时间;
    
    itemEl.appendChild(content);
    itemEl.appendChild(time);
    
    container.appendChild(itemEl);
  });
}


