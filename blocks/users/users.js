import { getUsersList } from '../../middleware/admin.js';
import { isAdminUser } from '../../store/userStore.js';
import { uploadS3Objects, listFiles } from '../../scripts/s3script.js';
import '../../jslibraries/ag-grid-community.min.js';
import { getAWSStore } from '../../store/awsStore.js';
import BtnCellRenderer from '../available-files/btn-cell-renderer.js';
import userSystemCellRenderer from '../available-files/user-system-cell-renderer.js';
import { formatBytes } from '../../jslibraries/utility/utility.js';
import { iconColorBar } from '../../scripts/helpers.js';

export default async function decorate(block) {
  if (!isAdminUser()) return;

  let selectedUser = {};
  const isHomePage = window.location.pathname === '/';

  const Users = isHomePage ? await getUsersList(10) : await getUsersList(0);

  const usersData = [];
  Users.forEach(user => {
    const singleRow = {};
    user.Attributes.forEach(attr => {
      singleRow[attr.Name] = attr.Value;
    });
    singleRow.Username = user.Username;
    usersData.push(singleRow);
  });

  // Function to create and populate a dropdown
  function createUsersDropdown(users) {
    const dropdown = document.createElement('select');
    dropdown.className = 'dropdown'; // Adding class name "dropdown"
    // Add an empty option
    const emptyOption = document.createElement('option');
    emptyOption.value = ''; // You can set it to any value you want
    emptyOption.textContent = '-- Select a user --'; // Text for the empty option
    dropdown.appendChild(emptyOption);
    // Add an option for each user
    users.forEach(function (user) {
      const option = document.createElement('option');
      option.value = user.sub; // You can use any unique identifier here
      option.textContent = `${user.Username} | ${user.email}`;
      dropdown.appendChild(option);
    });
    return dropdown;
  }

  // Create the dropdown
  const usersDropdown = createUsersDropdown(usersData);

  // Add file upload input and upload button
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.id = 'fileInput';
  fileInput.disabled = true; // Initially disabled
  fileInput.title = 'Please select a user';

  // upload button
  const uploadButton = document.createElement('button');
  uploadButton.textContent = 'Upload';
  uploadButton.disabled = true; // Initially disabled
  uploadButton.title = 'Please select a user';
  uploadButton.onclick = function () {
    selectedUser = usersData.find(item => item.sub === usersDropdown.value);
    const { files } = document.getElementById('fileInput');
    if (selectedUser && files) {
      const config = getAWSStore();
      uploadS3Objects(files, config.s3DownloadBucket, selectedUser);
      // Perform upload action here
      // console.log('Uploading file:', selectedFile.name, 'for user:', selectedUser);
    } else {
      alert('Please select a user and choose a file to upload.');
    }
  };

  // div element for file upload status
  const outputDiv = document.createElement('div'); // Create a new div element
  outputDiv.id = 'output'; // Set the id attribute of the div
  // Append the dropdown to the block
  block.append(usersDropdown);
  block.append(fileInput);
  block.append(uploadButton);
  block.append(outputDiv); // Append the div to the body of the HTML document

  const divheader = document.createElement('div');
  if (isHomePage) {
    divheader.innerHTML = `<div class='grid-header'>
    <div class='grid-header-left'>New Partners</div>
    <div class='grid-header-denter'>&nbsp;</div>
    <a href='/users' class='grid-header-right button primary'>View All Users</a>
    </div>`;
  } else {
    // TODO - Commenting out partners header
    // divheader.innerHTML = `<div class='grid-header'>
    // <div class='grid-header-left'>Partners</div>
    // <div class='grid-header-denter'>&nbsp;</div>
    // </div>`;
  }

  class iconNameAndDateRenderer {
    init(params) {
      this.eGui = document.createElement('div');
      this.eGui.className = 'cellIconWrapper';
      const { fileName, createdTime } = params.data;
      const clr = 'red';
      this.eGui.innerHTML = `${iconColorBar(
        clr,
      )}<div class="gridNameDate"><div class="gridItemFileName"><u>${fileName?.toUpperCase()}</u></div>
      <div class="gridItemCreatedTime">
      ${createdTime.toString() || ''}</div></div>`;
    }

    getGui() {
      return this.eGui;
    }
  }
  function formatBytesGetter(params) {
    return formatBytes(params.data.size, 0);
  }

  const div = document.createElement('div');
  div.id = 'userGrid';
  div.style = isHomePage
    ? 'height: 800px; width:100%;font-size:17px'
    : 'height: 800px; width:100%;font-size:17px';
  div.className = 'ag-theme-alpine';

  div.innerHTML = '';

  // block.textContent = '';

  divheader.appendChild(div);
  block.appendChild(divheader);

  const columnDefs = [
    {
      field: 'fileName',
      headerName: 'FILE NAME',
      sortable: true,
      minWidth: 380,
      cellRenderer: iconNameAndDateRenderer,
      cellClass: 'fileName',
    },
    {
      field: 'modifiedTime',
      headerName: 'DATE ADDED',
      sortable: true,
      minWidth: 150,
    },
    {
      field: 'owner',
      headerName: 'USER / SYSTEM',
      cellRenderer: userSystemCellRenderer,
      sortable: true,
      comparator: (valueA, valueB) => {
        if (valueA === valueB) return 0;
        return valueA > valueB ? 1 : -1;
      },
      minWidth: 160,
    },
    {
      field: 'md5',
      headerName: 'MD5',
      sortable: false,
      minWidth: 280,
      comparator: (valueA, valueB, nodeA, nodeB) => {
        if (nodeA.data.etag === nodeB.data.etag) return 0;
        return nodeA.data.etag > nodeB.data.etag ? 1 : -1;
      },
    },
    {
      field: 'size',
      valueGetter: formatBytesGetter,
      headerName: 'SIZE',
      sortable: true,
      comparator: (valueA, valueB, nodeA, nodeB) => {
        if (nodeA.data.size === nodeB.data.size) return 0;
        return nodeA.data.size > nodeB.data.size ? 1 : -1;
      },
      minWidth: 120,
    },
    {
      field: 'action',
      headerName: 'DOWNLOAD',
      cellRenderer: BtnCellRenderer,
      cellRendererParams: {
        clicked() {
          // console.log(this)
        },
      },
      minWidth: 120,
    },
  ];

  const miscGridOptions = {
    rowHeight: 78,
    unSortIcon: true,
    icons: {
      sortAscending: '<i class="icon-sort-up"/>',
      sortDescending: '<i class="icon-sort-down"/>',
      sortUnSort: '<i class="icon-sort"/>',
    },
  };

  async function fetchFiles(user) {
    const config = getAWSStore();
    if (!user) return [];
    const downloadFiles = await listFiles(config.s3DownloadBucket, 1000, user);
    const scannedFiles = await listFiles(config.s3ScannedBucket, 1000, user);
    const files = [
      ...downloadFiles.map(obj => {
        return { ...obj, owner: 'SYSTEM' };
      }),
      ...scannedFiles.map(obj => {
        return { ...obj, owner: 'USER' };
      }),
    ];
    files.sort((a, b) => b.createdTime - a.createdTime);
    return files;
  }

  // const files = await getDataFromFolder(FOLDER_IDS.availablefiles);


  let files = [];

  // let the grid know which columns and what data to use
  const gridOptions = {
    columnDefs,
    ...miscGridOptions,
    rowData: files,
  };

  // block.textContent = '';
  if (isHomePage) {
    block.append(divheader, div);
  } else {
    // TODO - disabling input search box
    block.appendChild(divheader, div);
  }

  // listing files for selected user
  const gridDiv = document.querySelector('#userGrid');
  gridDiv.style.setProperty('height', 800);
  // eslint-disable-next-line
  
  // TODO - disabling users list
  const userGrid = new agGrid.Grid(gridDiv, gridOptions);
  if (!isHomePage) gridOptions.api.sizeColumnsToFit();
  gridOptions.api.sizeColumnsToFit();
  gridOptions.api.setDomLayout('autoHeight');

  // Function to enable/disable file input and upload button based on dropdown selection
  async function toggleFileInputAndButton() {
    selectedUser = usersData.find(item => item.sub === usersDropdown.value);
    fileInput.disabled = !selectedUser;
    uploadButton.disabled = !selectedUser;
    // Toggle disabled class based on selected user
    if (!selectedUser) {
      fileInput.classList.add('disabled');
      uploadButton.classList.add('disabled');
    } else {
      fileInput.classList.remove('disabled');
      uploadButton.classList.remove('disabled');
      files = await fetchFiles(selectedUser);
      // console.log(files);
      gridOptions.api.setRowData(files);
    }
  }
  // Add event listener to dropdown
  usersDropdown.addEventListener('change', toggleFileInputAndButton);

  document.addEventListener('uploaded', async function (/* event */) {
    console.log('able to listend to uploaded files');
    await new Promise(resolve => {
      setTimeout(() => resolve('success'), 2000);
    });
    files = await fetchFiles(selectedUser);
    // console.log(files);
    gridOptions.api.setRowData(files);
  });
}
