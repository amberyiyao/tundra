let app = {
    savedList: [],
    imgBaseURL: null,
    init: function () {
        if (sessionStorage.getItem('savedList')) {
            app.savedList = JSON.parse(sessionStorage.getItem('savedList'));
        }
        app.addListeners();
        app.getProfiles();
    },
    addListeners: function () {
        document.getElementById('home').addEventListener('click', app.homePage);
        document.getElementById('saved').addEventListener('click', app.savedPage);
    },
    homePage: function () {
        document.getElementById('homePage').classList.remove('hide');
        document.getElementById('listPage').classList.add('hide');
        document.getElementById('saved').classList.add('notActive');
        document.getElementById('home').classList.remove('notActive');
        document.getElementById('noDate').classList.add('hide');

    },
    savedPage: function () {
        document.getElementById('homePage').classList.add('hide');
        document.getElementById('listPage').classList.remove('hide');
        document.getElementById('saved').classList.remove('notActive');
        document.getElementById('home').classList.add('notActive');
        
        if (sessionStorage.getItem('savedList')) {
            app.savedList = JSON.parse(sessionStorage.getItem('savedList'));
        }

        if (app.savedList.length == 0) {
            document.getElementById('noDate').classList.remove('hide');
            return;
        } else {
            document.getElementById('noDate').classList.add('hide');
        }

        let content = document.getElementById('listPage');
        content.innerHTML = '';

        let documentFragment = new DocumentFragment();

        app.savedList.forEach((item) => {
            let list = document.createElement('div');
            let photoDiv = document.createElement('div');
            let img = document.createElement('img');
            let profile = document.createElement('div');
            let name = document.createElement('p');
            let deleteButton = document.createElement('i');

            list.className = "savedList";
            photoDiv.className = "photoCntSave";
            img.className = "photosSave";
            profile.className = "profileSave";
            name.className = "nameSave";
            deleteButton.classList = "far fa-trash-alt";

            deleteButton.setAttribute('data-id', item.id);
            deleteButton.addEventListener('click', app.deleteSaved);

            let imgSrc = `${app.imgBaseURL}${item.avatar}`
            img.src = imgSrc;
            name.textContent = item.first + " " + item.last;

            photoDiv.appendChild(img);
            profile.appendChild(name);
            profile.appendChild(deleteButton);
            list.appendChild(photoDiv);
            list.appendChild(profile);
            documentFragment.appendChild(list);
        })
        content.appendChild(documentFragment);
    },
    deleteSaved: function (ev) {
        let id = ev.currentTarget.getAttribute('data-id');
        let n = app.savedList.findIndex(item => item.id == id);
        app.savedList.splice(n, 1);
        sessionStorage.setItem('savedList', JSON.stringify(app.savedList));
        document.querySelector(`#listPage>div:nth-child(${n+1})`).classList.add('deleteP');
        setTimeout(() => {
            document.querySelector("#listPage").removeChild(document.querySelector("#listPage").childNodes[n]);
            if (app.savedList.length == 0) {
                document.getElementById('noDate').classList.remove('hide');
                return;
            } else {
                document.getElementById('noDate').classList.add('hide');
            }
        }, 300);

    },
    index: 0,
    getProfiles: function () {
        let url = `http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=female`;
        document.getElementById('loading').classList.remove('hide');
        fetch(url)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.profiles);
                document.getElementById('loading').classList.add('hide');
                app.profilCard = data;
                app.imgBaseURL = `http:${decodeURIComponent(data.imgBaseURL)}`;
                app.creatCard();
            })
            .catch(function (error) {
                console.log(error);
            })
    },
    profilCard: {},
    creatCard: function () {
        if (app.profilCard.profiles.length < 3 || app.index >= app.profilCard.profiles.length) {
            app.getProfiles();
            app.index = 0;
            return;
        }
        let content = document.getElementById('homePage');
        content.innerHTML = "";

        let card = document.createElement('div');
        let photoDiv = document.createElement('div');
        let photo = document.createElement('img');
        let profile = document.createElement('div');
        let name = document.createElement('p');
        let gender = document.createElement('p');
        let distance = document.createElement('p');

        let imgSrc = `${app.imgBaseURL}${app.profilCard.profiles[app.index].avatar}`

        card.className = "card small";
        photoDiv.className = 'photoCnt';
        photo.className = 'photos';
        profile.className = "profile";
        name.className = 'name';
        gender.className = 'gender';
        distance.className = 'distance';

        card.setAttribute('data-id', app.profilCard.profiles[app.index].id);

        photo.src = imgSrc;
        name.textContent = app.profilCard.profiles[app.index].first + ' ' + app.profilCard.profiles[app.index].last;
        gender.textContent = 'Gender: ' + app.profilCard.profiles[app.index].gender;
        distance.textContent = 'Distance: ' + app.profilCard.profiles[app.index].distance;

        app.nowCard = app.profilCard.profiles[app.index];

        photoDiv.appendChild(photo);
        profile.appendChild(name);
        profile.appendChild(gender);
        profile.appendChild(distance);
        card.appendChild(photoDiv);
        card.appendChild(profile);

        let tiny = new tinyshell(card);
        tiny.addEventListener('swipeleft', app.deleteProfile);
        tiny.addEventListener('swiperight', app.saveProfile);

        content.appendChild(card);

        setTimeout(() => {
            card.classList.remove('small');
        }, 50);

        app.index++;
    },
    saveProfile: function (ev) {
        let id = ev.currentTarget.getAttribute('data-id');
        let saved = app.profilCard.profiles.find(item => item.id == id);

        app.savedList.push(saved);
        sessionStorage.setItem('savedList', JSON.stringify(app.savedList));
        document.querySelector('.card').classList.add('save');
        document.getElementById('fvourite').classList.remove('hide');
        setTimeout(() => {
            document.querySelector('.card').classList.add('hide');
            document.getElementById('fvourite').classList.add('hide');
            app.creatCard();
        }, 700);

        document.querySelector('.fa-heart').classList.add('saveHeart');
        setTimeout(() => {
            document.querySelector('.fa-heart').classList.remove('saveHeart');
        }, 700);

        console.log(app.savedList);
    },
    deleteProfile: function () {
        console.log('delete');
        document.querySelector('.card').classList.add('delete');
        document.getElementById('dismiss').classList.remove('hide');
        setTimeout(() => {
            document.querySelector('.card').classList.add('hide');
            document.getElementById('dismiss').classList.add('hide');
            app.creatCard();
        }, 700);
    }
}

app.init();
