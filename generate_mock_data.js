const XLSX = require('xlsx');
const fs = require('fs');

const 一级标签 = ['管理类建议', '产品类建议'];
const 二级标签_管理 = ['制度建议', '组织与违规', '市场营销', '培训学院', '集成计划'];
const 二级标签_产品 = ['车型项目', '平台项目'];
const 三级标签列表 = {
  '制度建议': ['零售制度类', '交付制度类', '服务制度类'],
  '组织与违规': ['销售组织类', '服务组织类', '业务违规类'],
  '市场营销': ['市场营销类'],
  '培训学院': ['培训学院类'],
  '集成计划': ['集成计划类'],
  '车型项目': ['第一产品线', '第二产品线'],
  '平台项目': ['自动驾驶', '智能空间']
};
const 工单状态 = ['待处理', '已分流', '进行中', '已完成', '已终止'];
const 是否逾期选项 = ['未逾期', '待处理逾期', '已分流逾期', '进行中逾期'];
const 原声来源 = ['VOE平台', '小红书', '脉脉', '客服热线', '门店反馈'];
const 需求层级列表 = ['群组', '接口人', '一级'];

const 人员名单 = [
  '陈明', '秦茵', '邵仕哲', '韩希', '许娜', '胡蓉', '田伟东', '余乐川',
  '乔立娜', '文彬', '张伟', '李娜', '王强', '刘芳', '赵磊', '周静',
  '吴昊', '郑涛', '孙丽', '马超', '朱婷', '林峰', '黄勇', '徐敏',
  '何军', '高阳', '梁欣', '宋洋', '唐杰', '罗琳', '王芳', '李明',
  '张静', '刘洋', '陈思', '杨帆', '周宇', '吴霞', '郑鑫', '赵敏'
];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generate原声内容() {
  const templates = [
    '希望能够优化门店管理系统的查询功能，目前使用体验较差，影响工作效率',
    '建议增加销售系统的数据权限，便于一线员工更好地开展销售工作',
    '客服系统的流程过于复杂，建议简化步骤，提高处理效率',
    '当前培训制度存在不合理之处，建议调整为分级模式',
    '希望能够开放数据看板数据查看权限，方便一线员工自主分析复盘',
    '审批流程功能使用不便，建议优化界面设计和操作流程',
    '建议增加库存系统提醒功能，避免重要事项遗漏',
    '绩效考核标准不够清晰，建议完善并增加透明度',
    '希望能够统一服务标准，避免各地执行不一致',
    '客户反馈渠道不够畅通，建议增设线上反馈渠道',
    '建议优化售后服务的工单处理功能，目前响应速度较慢',
    '库存系统信息同步不及时，建议增加自动同步功能',
    '希望能够增加销售数据分析报表功能，便于管理层决策',
    '门店审批流程操作步骤较多，建议精简流程',
    '建议完善员工培训资料，新员工上手困难',
    '智能空间功能需要优化，用户体验不佳',
    '自动驾驶功能存在bug，需要修复',
    '第一产品线需要增加新功能',
    '第二产品线需要优化现有功能',
    '建议增加客户满意度调查功能'
  ];
  return getRandomElement(templates);
}

function generate需求名称() {
  const prefixes = ['优化', '完善', '增设', '简化', '开放', '统一', '调整', '改进', '增加', '提升', '加强', '规范'];
  const subjects = [
    'RB数据权限', '门店审批流程', '培训管理制度', '绩效考核标准',
    '数据同步机制', '权限分配规则', '报表导出功能', '提醒通知机制',
    '客户反馈渠道', '库存管理流程', '销售数据分析', '服务评价体系',
    '智能空间功能', '自动驾驶功能', '产品线功能'
  ];
  const suffixes = ['的建议', '需求反馈', '优化方案', '改进建议', '完善方案', ''];
  return `${getRandomElement(prefixes)}${getRandomElement(subjects)}${getRandomElement(suffixes)}`;
}

function generateDate(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const date = new Date(randomTime);
  return date.toISOString().replace('T', ' ').substring(0, 19);
}

function generateBusinessTrendDate(index, totalCount) {
  const monthDistribution = [
    { month: '2025-10', weight: 1.2 },
    { month: '2025-11', weight: 2.5 },
    { month: '2025-12', weight: 4.0 },
    { month: '2026-01', weight: 3.5 },
    { month: '2026-02', weight: 2.8 },
    { month: '2026-03', weight: 2.0 },
    { month: '2026-04', weight: 1.2 },
    { month: '2026-05', weight: 0.5 }
  ];
  
  const totalWeight = monthDistribution.reduce((sum, m) => sum + m.weight, 0);
  
  const cumulativeWeights = [];
  let cumulative = 0;
  for (const m of monthDistribution) {
    cumulative += m.weight;
    cumulativeWeights.push(cumulative);
  }
  
  const targetWeight = (index / totalCount) * totalWeight;
  
  let selectedMonth = monthDistribution[0];
  for (let i = 0; i < cumulativeWeights.length; i++) {
    if (targetWeight <= cumulativeWeights[i]) {
      selectedMonth = monthDistribution[i];
      break;
    }
  }
  
  const [year, month] = selectedMonth.month.split('-');
  const daysInMonth = new Date(parseInt(year), parseInt(month), 0).getDate();
  const day = Math.floor(Math.random() * daysInMonth) + 1;
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 60);
  const second = Math.floor(Math.random() * 60);
  
  return `${year}-${month.padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`;
}

function generate原声表数据(count) {
  const data = [];
  
  const startDate = new Date('2025-10-01');
  const endDate = new Date('2026-05-13');
  
  for (let i = 1; i <= count; i++) {
    const 一级 = Math.random() > 0.4 ? '管理类建议' : '产品类建议';
    let 二级, 三级;

    if (一级 === '管理类建议') {
      二级 = getRandomElement(二级标签_管理);
      三级 = getRandomElement(三级标签列表[二级]);
    } else {
      二级 = getRandomElement(二级标签_产品);
      三级 = getRandomElement(三级标签列表[二级]);
    }

    const 状态 = getRandomElement(['待处理', '已分流', '进行中', '已完成', '已终止']);
    const 是否终止 = 状态 === '已终止' ? '是' : '否';
    const 逾期 = (状态 === '已终止' || 状态 === '已完成') ? '未逾期' : 
                  (Math.random() > 0.7 ? getRandomElement(是否逾期选项.filter(o => o !== '未逾期')) : '未逾期');
    
    const 需求提交时间 = generateBusinessTrendDate(i - 1, count);
    const 是否实名 = Math.random() > 0.3 ? '是' : '否';
    const 提需人 = 是否实名 === '是' ? getRandomElement(人员名单) : '--';
    const 需求运营人 = getRandomElement(人员名单);
    const 工单经办人 = getRandomElement(人员名单);
    const 业务负责人 = getRandomElement(人员名单);

    let 分流时长 = '';
    let 启动时长 = '';
    let 处理时长 = '';
    let 计划完成时间 = '';
    let 实际完成时间 = '';

    if (状态 !== '待处理') {
      分流时长 = (Math.random() * 48 + 1).toFixed(1);
    }
    if (状态 === '进行中' || 状态 === '已完成' || 状态 === '已终止') {
      启动时长 = (Math.random() * 72 + 1).toFixed(1);
      计划完成时间 = generateDate('2026-01-01', '2026-06-30');
    }
    if (状态 === '已完成') {
      处理时长 = (Math.random() * 168 + 24).toFixed(1);
      实际完成时间 = generateDate(计划完成时间, '2026-06-30');
    }

    const 是否合并 = Math.random() > 0.35 ? '是' : '否';
    const 合并需求编号 = 是否合并 === '是' ? `ZDJY-LS-${100 + Math.floor(i / 3)}` : '';
    const 合并需求名称 = 是否合并 === '是' ? generate需求名称() : '';

    const 终止原因 = 是否终止 === '是' ? getRandomElement([
      '需求重复', '不在业务范围内', '已通过其他方式解决', '信息不完整无法处理'
    ]) : '';

    const 进度反馈 = 状态 === '进行中' ? getRandomElement([
      '已安排调研中', '正在输出落地方案', '已完成初步评估', '已与相关部门沟通'
    ]) : '';

    const 总结反馈 = 状态 === '已完成' ? getRandomElement([
      '已完成功能上线，需求已闭环', '已纳入后续版本规划', '已优化流程并实施',
      '需求已解决', '已完善相关制度'
    ]) : '';

    const 满意度反馈 = (状态 === '已完成' && 是否实名 === '是' && Math.random() > 0.4) ? getRandomElement([
      '处理及时，很满意', '方案可行，满意', '解决了问题', '服务态度好', ''
    ]) : '';

    const 质量评分 = 满意度反馈 ? getRandomInt(3, 5) : '';
    const 效率评分 = 满意度反馈 ? getRandomInt(3, 5) : '';

    data.push({
      '原声序号': i,
      '需求原声': generate原声内容(),
      '需求提交时间': 需求提交时间,
      '原声来源': getRandomElement(原声来源),
      '提需人': 提需人,
      '是否实名': 是否实名,
      '是否逾期': 逾期,
      '需求运营人': 需求运营人,
      '工单状态': 状态,
      '合并前终止': 是否终止,
      '合并前终止原因': 终止原因,
      '合并需求编号': 合并需求编号,
      '合并需求名称': 合并需求名称,
      '一级标签': 一级,
      '二级标签': 二级,
      '三级标签': 三级,
      '业务接口人': 工单经办人,
      '工单经办人': 工单经办人,
      '业务负责人': 业务负责人,
      '工单创建时间': 状态 !== '待处理' ? generateDate(需求提交时间, '2026-06-30') : '',
      '分流时长(h)': 分流时长,
      '启动时长(h)': 启动时长,
      '处理时长(h)': 处理时长,
      '计划完成时间': 计划完成时间,
      '实际完成时间': 实际完成时间,
      '进度反馈': 进度反馈,
      '总结反馈': 总结反馈,
      '满意度反馈': 满意度反馈,
      '问卷满意度质量评分': 质量评分,
      '问卷满意度效率评分': 效率评分
    });
  }

  return data;
}

function generate需求表数据(count, 原声Data) {
  const data = [];
  const 已合并原声 = 原声Data.filter(item => item['合并需求编号'] && item['合并需求编号'] !== '');
  const uniqueMergeIds = [...new Set(已合并原声.map(item => item['合并需求编号']))];

  for (let i = 1; i <= count; i++) {
    const mergeId = uniqueMergeIds[i % uniqueMergeIds.length] || `ZDJY-LS-${100 + i}`;
    const related原声 = 已合并原声.filter(item => item['合并需求编号'] === mergeId);
    const 关联数量 = related原声.length > 0 ? related原声.length : getRandomInt(1, 8);

    const 一级 = Math.random() > 0.4 ? '管理类建议' : '产品类建议';
    let 二级, 三级;

    if (一级 === '管理类建议') {
      二级 = getRandomElement(二级标签_管理);
      三级 = getRandomElement(三级标签列表[二级]);
    } else {
      二级 = getRandomElement(二级标签_产品);
      三级 = getRandomElement(三级标签列表[二级]);
    }

    const 状态 = getRandomElement(['待处理', '已分流', '进行中', '已完成', '已终止']);
    const 层级 = getRandomElement(需求层级列表);
    const 是否逾期 = (状态 === '已终止' || 状态 === '已完成') ? '未逾期' : 
                      (Math.random() > 0.75 ? getRandomElement(是否逾期选项.filter(o => o !== '未逾期')) : '未逾期');
    
    const 逾期情况 = 是否逾期 === '未逾期' ? '' : 
                     (是否逾期 === '待处理逾期' ? `待处理逾期${getRandomInt(1, 48)}h` :
                      是否逾期 === '已分流逾期' ? `已分流逾期${getRandomInt(1, 72)}h` :
                      `进行中逾期${getRandomInt(1, 168)}h`);
    
    const 工单创建时间 = generateBusinessTrendDate(i - 1, count);
    const 需求提交时间 = generateDate('2025-10-01', 工单创建时间);

    let 分流时长 = (Math.random() * 48 + 1).toFixed(1);
    let 启动时长 = (Math.random() * 72 + 1).toFixed(1);
    let 处理时长 = '';
    let 计划完成时间 = '';
    let 实际完成时间 = '';
    let 工单终止时间 = '';

    if (状态 === '进行中') {
      处理时长 = (Math.random() * 168 + 24).toFixed(1);
      计划完成时间 = generateDate('2026-01-01', '2026-06-30');
    } else if (状态 === '已完成') {
      处理时长 = (Math.random() * 168 + 24).toFixed(1);
      计划完成时间 = generateDate('2026-01-01', '2026-05-01');
      实际完成时间 = generateDate(计划完成时间, '2026-06-30');
    } else if (状态 === '已终止') {
      处理时长 = (Math.random() * 100 + 10).toFixed(1);
      计划完成时间 = generateDate('2026-01-01', '2026-04-01');
      工单终止时间 = generateDate(计划完成时间, '2026-05-13');
    }

    const 工单经办人 = getRandomElement(人员名单);
    const 业务负责人 = getRandomElement(人员名单);
    const 需求运营人 = getRandomElement(人员名单);
    const 需求提交人 = getRandomElement(人员名单);

    const 进度反馈 = 状态 === '进行中' ? getRandomElement([
      '已完成需求调研', '正在输出落地方案', '已安排技术评估', '已与业务方沟通确认',
      '方案已提交审批', '正在开发中', '已完成测试', '准备上线'
    ]) : '';

    const 总结反馈 = 状态 === '已完成' ? getRandomElement([
      '已完成功能上线，需求已闭环', '已纳入后续版本规划', '已优化流程并实施',
      '需求已解决', '已完善相关制度', '功能已优化完成并上线'
    ]) : '';

    const 工单终止原因 = 状态 === '已终止' ? getRandomElement([
      '需求重复，已合并至其他工单', '不在业务范围内', '已通过其他方式解决', '长期无进展，自动终止'
    ]) : '';

    const 群组链接 = `已分流-一线反馈工单-${mergeId}-${generate需求名称().substring(0, 10)}`;

    const 更多优化建议 = (状态 === '已完成' && Math.random() > 0.6) ? getRandomElement([
      '建议增加相关培训', '建议完善配套文档', '建议持续优化体验', '', '', ''
    ]) : '';

    const 满意度评分 = (状态 === '已完成' && Math.random() > 0.5) ? getRandomInt(3, 5) : '';
    const 满意度反馈信息 = 满意度评分 ? getRandomElement([
      '处理及时，很满意', '方案可行，满意', '解决了问题', '服务态度好'
    ]) : '';
    
    const 反馈信息是否合格 = (状态 === '已完成' || 状态 === '进行中') ? 
                             (Math.random() > 0.15 ? '合格' : '不合格') : '';
    const 反馈信息不合格原因 = 反馈信息是否合格 === '不合格' ? getRandomElement([
      '反馈内容不完整', '反馈不及时', '反馈质量较差', '未按要求反馈'
    ]) : '';

    data.push({
      '合并需求编号': mergeId,
      '合并需求名称': generate需求名称(),
      '关联原声数量': 关联数量,
      '工单状态': 状态,
      '群组链接': 群组链接,
      '需求层级': 层级,
      '一级标签': 一级,
      '二级标签': 二级,
      '三级标签': 三级,
      '工单创建时间': 工单创建时间,
      '需求提交时间': 需求提交时间,
      '需求提交人': 需求提交人,
      '工单经办人': 工单经办人,
      '业务负责人': 业务负责人,
      '需求运营人': 需求运营人,
      '是否逾期': 是否逾期,
      '逾期情况': 逾期情况,
      '计划完成时间': 计划完成时间,
      '实际完成时间': 实际完成时间,
      '工单终止时间': 工单终止时间,
      '分流时长(h)': 分流时长,
      '启动时长(h)': 启动时长,
      '处理时长(h)': 处理时长,
      '总时长(h)': 状态 === '已完成' ? (parseFloat(分流时长) + parseFloat(启动时长) + parseFloat(处理时长)).toFixed(1) : '',
      '进度反馈': 进度反馈,
      '总结反馈': 总结反馈,
      '工单终止原因': 工单终止原因,
      '更多优化建议': 更多优化建议,
      '反馈信息是否合格': 反馈信息是否合格,
      '反馈信息不合格原因': 反馈信息不合格原因,
      '问卷满意度效率评分': 满意度评分,
      '问卷满意度质量评分': 满意度评分,
      '合并需求满意度评分': 满意度评分,
      '满意度反馈信息': 满意度反馈信息
    });
  }

  return data;
}

console.log('开始生成模拟数据...');

const 原声数据 = generate原声表数据(1300);
const 需求数据 = generate需求表数据(500, 原声数据);

const workbook = XLSX.utils.book_new();

const 原声Worksheet = XLSX.utils.json_to_sheet(原声数据);
const 需求Worksheet = XLSX.utils.json_to_sheet(需求数据);

const colWidths原声 = [
  { wch: 10 }, { wch: 60 }, { wch: 20 }, { wch: 12 }, { wch: 12 },
  { wch: 8 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 10 },
  { wch: 15 }, { wch: 10 }, { wch: 40 }, { wch: 12 }, { wch: 12 },
  { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 20 }, { wch: 10 },
  { wch: 10 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 30 },
  { wch: 30 }, { wch: 30 }, { wch: 8 }, { wch: 8 }
];
原声Worksheet['!cols'] = colWidths原声;

const colWidths需求 = [
  { wch: 20 }, { wch: 50 }, { wch: 10 }, { wch: 12 }, { wch: 50 },
  { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 20 },
  { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 },
  { wch: 12 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 10 },
  { wch: 10 }, { wch: 10 }, { wch: 30 }, { wch: 30 }, { wch: 30 },
  { wch: 30 }, { wch: 8 }, { wch: 8 }, { wch: 8 }, { wch: 30 }
];
需求Worksheet['!cols'] = colWidths需求;

XLSX.utils.book_append_sheet(workbook, 原声Worksheet, '原声表');
XLSX.utils.book_append_sheet(workbook, 需求Worksheet, '需求表');

const outputPath = '模拟数据_原声1300条_需求500条.xlsx';
XLSX.writeFile(workbook, outputPath);

console.log(`数据生成完成！`);
console.log(`原声表: ${原声数据.length} 条记录`);
console.log(`需求表: ${需求数据.length} 条记录`);
console.log(`文件已保存至: ${outputPath}`);

const stats原声 = {
  '总需求数': 原声数据.length,
  '待处理': 原声数据.filter(d => d['工单状态'] === '待处理').length,
  '已分流': 原声数据.filter(d => d['工单状态'] === '已分流').length,
  '进行中': 原声数据.filter(d => d['工单状态'] === '进行中').length,
  '已完成': 原声数据.filter(d => d['工单状态'] === '已完成').length,
  '已终止': 原声数据.filter(d => d['工单状态'] === '已终止').length,
  '已合并': 原声数据.filter(d => d['合并需求编号'] && d['合并需求编号'] !== '').length,
  '未逾期': 原声数据.filter(d => d['是否逾期'] === '未逾期').length,
  '有逾期': 原声数据.filter(d => d['是否逾期'] !== '未逾期').length,
  '实名': 原声数据.filter(d => d['是否实名'] === '是').length,
  '匿名': 原声数据.filter(d => d['是否实名'] === '否').length
};

console.log('\n=== 原声表数据统计 ===');
Object.entries(stats原声).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

const stats需求 = {
  '总需求数': 需求数据.length,
  '待处理': 需求数据.filter(d => d['工单状态'] === '待处理').length,
  '已分流': 需求数据.filter(d => d['工单状态'] === '已分流').length,
  '进行中': 需求数据.filter(d => d['工单状态'] === '进行中').length,
  '已完成': 需求数据.filter(d => d['工单状态'] === '已完成').length,
  '已终止': 需求数据.filter(d => d['工单状态'] === '已终止').length,
  '未逾期': 需求数据.filter(d => d['是否逾期'] === '未逾期').length,
  '有逾期': 需求数据.filter(d => d['是否逾期'] !== '未逾期').length,
  '平均关联原声数': (需求数据.reduce((sum, d) => sum + d['关联原声数量'], 0) / 需求数据.length).toFixed(1)
};

console.log('\n=== 需求表数据统计 ===');
Object.entries(stats需求).forEach(([key, value]) => {
  console.log(`${key}: ${value}`);
});

const 三级标签统计 = {};
原声数据.forEach(d => {
  const 标签 = d['三级标签'];
  if (标签) {
    三级标签统计[标签] = (三级标签统计[标签] || 0) + 1;
  }
});

console.log('\n=== 三级标签分布 ===');
Object.entries(三级标签统计)
  .sort((a, b) => b[1] - a[1])
  .forEach(([key, value]) => {
    console.log(`${key}: ${value} (${(value / 原声数据.length * 100).toFixed(1)}%)`);
  });