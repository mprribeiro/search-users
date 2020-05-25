let users = [];
let inputSearch = null;
let buttonSearch = null;
let usersPanel = null;
let statisticsPanel = null;
let searchedUsers = null;
let numberFormat = null;

window.addEventListener('load', () => {
  inputSearch = document.querySelector('#inputSearch');
  buttonSearch = document.querySelector('.btn');
  usersPanel = document.querySelector('#users');
  statisticsPanel = document.querySelector('#statistics');

  numberFormat = Intl.NumberFormat('pt-BR');

  loadData();
  inputSearch.addEventListener('keyup', enableButton);
  buttonSearch.addEventListener('click', searchUsers);
  document.addEventListener(
    'keypress',
    function (e) {
      if (
        e.key === 'Enter' &&
        inputSearch.value !== '' &&
        inputSearch.value !== null
      ) {
        searchUsers();
      }
    },
    false
  );
});

async function loadData() {
  const res = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await res.json();

  users = json.results.map((user) => {
    return {
      name: user.name.first + ' ' + user.name.last,
      picture: user.picture.medium,
      age: user.dob.age,
      gender: user.gender,
    };
  });
}

const enableButton = () => {
  if (inputSearch.value !== '' && inputSearch.value !== null) {
    buttonSearch.disabled = false;
  } else {
    buttonSearch.disabled = true;
  }
};

const searchUsers = () => {
  searchedUsers = users.filter((user) => {
    if (
      user.name.indexOf(inputSearch.value.toLowerCase()) > -1 ||
      user.name.indexOf(inputSearch.value.toUpperCase()) > -1 ||
      user.name.indexOf(firstUpperCase()) > -1
    ) {
      return user;
    }
  });
  inputSearch.value = '';
  inputSearch.focus();
  buttonSearch.disabled = true;
  render();
};

const render = () => {
  usersRender();
  statiscticsRender();
};

const usersRender = () => {
  orderedUsers = searchedUsers.sort((a, b) => {
    return a.name.localeCompare(b.name);
  });

  let usersHTML = '<div>';
  usersHTML += `<h3> ${searchedUsers.length} usuário(s) encontrado(s) </h3>`;

  orderedUsers.forEach((user) => {
    const { name, age, picture } = user;
    const userHTML = `
      <div class='user'>
        <div>
         <img src="${picture}" ">
        </div>
        <div>
          <p> ${name}, ${age} anos </p>
        </div>
      </div>
    `;

    usersHTML += userHTML;
  });
  usersHTML += '</div>';
  usersPanel.innerHTML = usersHTML;
};

const statiscticsRender = (users) => {
  let male = 0;
  let female = 0;
  let ageSum = 0;
  let ageAverage = 0;

  searchedUsers.forEach((user) => {
    if (user.gender === 'male') {
      male++;
    } else {
      female++;
    }
  });

  ageSum = searchedUsers.reduce((acc, curr) => {
    return acc + curr.age;
  }, 0);

  if (searchedUsers.length > 0) {
    ageAverage = ageSum / searchedUsers.length;
  }

  let statisticsHTML = '<div>';

  const statisticHTML = `
      <div class='statistics'>
        <div>
          <h3>Estatísticas</h3>
            <li>
            Sexo masculino: ${male}
            </li>
            <li>
            Sexo feminino: ${female}
            </li>
            <li>
            Soma das idades: ${ageSum}
            </li>
            <li>
            Média das idades: ${formatNumber(ageAverage.toFixed(2))}
            </li>
      </div>
    `;

  statisticsHTML += statisticHTML;
  statisticsHTML += '</div>';
  statisticsPanel.innerHTML = statisticsHTML;
};

const formatNumber = (number) => {
  return numberFormat.format(number);
};

const firstUpperCase = () => {
  const lower = inputSearch.value.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
};
