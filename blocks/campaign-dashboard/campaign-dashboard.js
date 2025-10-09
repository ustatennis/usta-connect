// import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const dashboard = document.createElement('iframe');
  dashboard.className = 'campaign-dashboard';
  dashboard.id = 'campaign-dashboard';
  const htmlContent = `
  <script type='module' src='https://analytics.usta.com/javascripts/api/tableau.embedding.3.latest.min.js'></script><tableau-viz id='tableau-viz' src='https://analytics.usta.com/t/usopen_enterprise/views/MarketingLogDashboard/MarketingTriggersDashboard' width='1366' height='808' hide-tabs toolbar='bottom' ></tableau-viz>

  `;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  dashboard.src = URL.createObjectURL(blob);
  // decorateIcons(footer);
  block.append(dashboard);
}
