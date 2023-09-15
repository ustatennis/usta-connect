import { getUser, getUserRole } from '../../store/userStore.js';
import { decorateIcons } from '../../scripts/lib-franklin.js';

export default async function decorate(block) {
  const user = getUser();
  const userRole = getUserRole();
  const userName = user.UserAttributes.find(o => o.Name === 'name').Value;
  const userDayInfoPath = '/user-day-info';
  const weatherAlertPath = '/weather-alert';
  const resp = await fetch(
    `${userDayInfoPath}.plain.html`,
    window.location.pathname.endsWith('/user-day-info')
      ? { cache: 'reload' }
      : {},
  );
  const respWeatherAlert = await fetch(
    `${weatherAlertPath}.plain.html`,
    window.location.pathname.endsWith('/weather-alert')
      ? { cache: 'reload' }
      : {},
  );

  if (resp.ok && respWeatherAlert.ok) {
    const weatherAlertHTML = await respWeatherAlert.text();
    const userNameCpitalized =
      // eslint-disable-next-line no-unsafe-optional-chaining
      userName?.charAt(0).toUpperCase() + userName.slice(1);
    const div = document.createElement('div');
    div.className = 'user-day-info';
    div.innerHTML = `
    <div class='user-day-info-left'>
    <div class='weather-alert'>${weatherAlertHTML}</div>
    </div>
    <div class='user-day-info-center'>
    &nbsp;
    </div>
    <div class='user-day-info-right'>
    <div class="username">Welcome <b>${userNameCpitalized}</b>(${userRole?.role})</div>
    </div>
    `;
    const userDayWrapper = document.createElement('div');
    decorateIcons(div);
    userDayWrapper.className = 'user-day-info-wrapper';
    userDayWrapper.append(div);
    block.append(userDayWrapper);

    // const elem = document.getElementById('foo');
    // const rangepicker = new DateRangePicker(elem, { autoclose: false });
    // console.log(rangepicker);
    // const rangestart = document.getElementsByClassName('datepicker-input');
    // const startElem = document.getElementById('range-start');
    // const endElem = document.getElementById('range-end');

    // startElem.addEventListener('changeDate', function (e) {
    //   console.log('range-start', e.detail.date);
    // });

    // endElem.addEventListener('changeDate', function (e) {
    //   console.log('range-end', e.detail.date);
    // });
  }
}
