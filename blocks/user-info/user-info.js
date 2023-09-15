// import { getUser, getUserRole } from '../../store/userStore.js';

export default async function decorate(block) {
  // fetch nav content
  // const user = getUser();
  // const userRole = getUserRole();
  const userDayInfoPath = '/user-day-info';
  const resp = await fetch(
    `${userDayInfoPath}.plain.html`,
    window.location.pathname.endsWith('/user-day-info')
      ? { cache: 'reload' }
      : {},
  );
  console.log(resp);

  // const html = await resp.text();

  const div = document.createElement('div');
  div.innerHTML = `
  <div>
            <div>
              <picture>
                <source type="image/webp" srcset="./media_1c5558e7998a6e60d1e842c71af1832b3f56c75e2.png?width=2000&amp;format=webply&amp;optimize=medium" media="(min-width: 600px)">
                <source type="image/webp" srcset="./media_1c5558e7998a6e60d1e842c71af1832b3f56c75e2.png?width=750&amp;format=webply&amp;optimize=medium">
                <source type="image/png" srcset="./media_1c5558e7998a6e60d1e842c71af1832b3f56c75e2.png?width=2000&amp;format=png&amp;optimize=medium" media="(min-width: 600px)">
                <img loading="lazy" alt="" type="image/png" src="./media_1c5558e7998a6e60d1e842c71af1832b3f56c75e2.png?width=750&amp;format=png&amp;optimize=medium" width="125" height="125">
              </picture>
            </div>
            <div>INTERVIEW ROOM SCHEDULE</div>
          </div>
  `;

  const userWrapper = document.createElement('div');
  userWrapper.className = 'user-info-wrapper';
  userWrapper.append(div);
  block.append(userWrapper);
}
