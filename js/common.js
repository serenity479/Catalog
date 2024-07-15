$(document).ready(function() {

    localStorage.clear();
    const itemsPerPage = 4;
    let data;
    data = JSON.parse(localStorage.getItem('tilesData'));
    let numberOfTiles = 20;
    let idIndex = 0;

    // Если данные еще не сохранены в localStorage, заполняем их
    if (!data) {
        data = [];
        for(let i=1; i<=numberOfTiles; i++){
            var obj = 
                {
                    Name: "Product " + i,
                    Description: "Description " + i,
                    Image: "img/image.jpg", 
                    Price: 1000,
                    id: idIndex++
                }   
                data.push(obj);
        }

        localStorage.setItem('tilesData', JSON.stringify(data));
    }

    

    // Добавим кнопки пагинации динамически
    function renderPagination() {
        const paginationContainer = document.getElementsByClassName('pagination')[0];
        paginationContainer.innerHTML = "";
        data = JSON.parse(localStorage.getItem('tilesData'));
        const numberOfPages = Math.ceil(data.length / itemsPerPage);  // определяем кол-во страниц, в звависимости от длины массива
        let currentPage = 1;  
        let targetForArrow;    
        
       
        const updatePagination = () => {
            paginationContainer.innerHTML = "";
    
            // Create left arrow
            paginationContainer.appendChild(createArrow('left'));
    
            // создаст столько кнопок пагинации, сколько нужно
            for (let i = 1; i <= numberOfPages; i++) {
                paginationContainer.appendChild(createPageAndNumber(i));
            }
    
            // Create right arrow
            paginationContainer.appendChild(createArrow('right'));
        };
    

        // Обработка нажатий по клику на стрелочку
        const createArrow = (direction) => {
            const arrow = document.createElement('a');
            arrow.classList.add('arrow');
            arrow.innerHTML = direction === 'left' ? '&lsaquo;' : '&rsaquo;';
            arrow.addEventListener('click', (e) => {
                if (direction === 'left' && currentPage > 1) {
                    currentPage--;
                    targetForArrow = targetForArrow.previousElementSibling;
                } else if (direction === 'right' && currentPage < numberOfPages) {
                    currentPage++;
                    targetForArrow = targetForArrow.nextElementSibling;
                }
                renderTiles(currentPage);
                setActivePage(targetForArrow);   
            });
            return arrow;
        };
    

        // Обработка нажатий по клику на цифру
        const createPageAndNumber = (number) => {
            const pageNumber = document.createElement('a');
            if(number === 1){
                targetForArrow = pageNumber;
            }
            pageNumber.innerText = number;
            if (number === currentPage) {
                pageNumber.classList.add('active');
            }
            pageNumber.addEventListener('click', (e) => {
                currentPage = number;
                renderTiles(number);
                targetForArrow = e.target;
                setActivePage(e.target);
            });
            return pageNumber;
        };


         // Вызовем updatePagination для первоначальной отрисовки пагинации
         updatePagination();       
    }


    // Инициализация первого рендера при первой загрузке
    renderTiles(1);
    renderPagination();
    

    function renderTiles(page) {
        const tilesContainer = document.getElementById('tiles-container');
        tilesContainer.innerHTML = "";

        // вычисляем какие элементы из массива data скопировать
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentTiles = data.slice(start, end);
    

        currentTiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('profile-card');
            tileElement.setAttribute('id', tile.id); //здесь добавляем id 
            tileElement.innerHTML = `
                <div class="hover-overlay">
                    <img class="card-img" src="${tile.Image}" alt="${tile.Name}">
                    <div class="delete-icon">
                        <img src="img/delete.png" alt="Delete Icon">
                    </div>     
                </div>
                
                <div class="profile-info">
                    <div class="info">
                        <h3>${tile.Name}</h3>
                        <p>${tile.Description}</p>
                    </div>
                    <div class="price">
                        <h3>${tile.Price} ₽</h3>
                    </div>
                </div>
            `;
            tilesContainer.appendChild(tileElement);
        });
    }

    function setActivePage(target) {
        const buttons = document.querySelectorAll('.pagination a');
        buttons.forEach(button => {
            button.classList.remove('active');
        });
        target.classList.add('active');
        console.log(target.classList);
    }





    // Удаление профиля 
    $('#tiles-container').on('click', '.delete-icon', function() {
        
        var card = $(this).closest('.profile-card');
        var cardId = card.attr('id');
        // Анимация удаления
        card.addClass('fade-out');
        
   
        setTimeout(function() {
            card.remove();  // Удаляем с html

             // Получаем данные из Local Storage
            data = JSON.parse(localStorage.getItem('tilesData'));

            // Удаляем элемент с соответствующим идентификатором
            data = data.filter(function(item) {
                return item.id !== Number(cardId);
            });

            // Обновляем данные в Local Storage
            localStorage.setItem('tilesData', JSON.stringify(data));
    
        }, 500); // Длительность анимации удаления
    });






    // Добавление новой карточки
    $('.profile-settings').on('click', '#save-button', function() {


    // получим данные из инпутов
    const name = document.getElementById('name-input').value;
    const description = document.getElementById('description-input').value;
    const price1 = parseFloat(document.getElementById('price-input-1').value);
    const price2 = parseFloat(document.getElementById('price-input-2').value);
    const price3 = parseFloat(document.getElementById('price-input-3').value);
    let imgElement = document.getElementById('img-profile-settings');
    let img = "";
        if(imgElement && imgElement.src){
            img = document.getElementById('img-profile-settings').src;
        }else{
            img = "img/image.jpg";
        }

    const newTile = {
        Name: name,
        Description: description,
        Image: img,
        Price: price1,
        id: idIndex++
    };



    // запишем новый элемент в Local storage
    let data = JSON.parse(localStorage.getItem('tilesData'));
    if (!data) {
        data = [];
    }
    data.push(newTile);
    localStorage.setItem('tilesData', JSON.stringify(data));
    console.log(JSON.parse(localStorage.getItem('tilesData')));
    

    // Отправка HTTP-запроса
    fetch('https://www.example.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTile)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(dataResp => {
        console.log('Success:', dataResp);
        // Дополнительные действия при успешном запросе
    })
    .catch(error => {
        console.error('Error:', error);
        // Дополнительные действия при ошибке запроса
    });


    renderPagination();
      
    });




    // Валидация полей ввода
    const formGroups = document.querySelectorAll('.form-group input')
    formGroups.forEach(input => {
        input.addEventListener('blur', validateInput);
        // input.addEventListener('input', validateInput);
      });

    function validateInput(event) {
        const input = event.target;

        let dataInput = input.value.toString();

        if(input.previousElementSibling.textContent === "Name" || 
            input.previousElementSibling.textContent === "Description"){
            addClassValidation( dataInput || !dataInput.trim() === '');
        }
        if(input.parentNode.children[0].textContent === "Price"){
            addClassValidation( dataInput.match("^\\d+$"));
        }
                
        function addClassValidation(validation){
            if (validation) {
                input.classList.remove('invalid');
                input.classList.add('valid');
              } else {
                input.classList.remove('valid');
                input.classList.add('invalid');
              }
          }
      }

      



    // Загрузка картинки 
    document.getElementById('upload').addEventListener('click', function() {
        document.getElementById('file-input').click();
    });  


    document.getElementById('file-input').addEventListener('change', function(event) {
        const file = event.target.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.setAttribute('id', 'img-profile-settings');
    
                const uploadDiv = document.getElementById('upload');
                uploadDiv.innerHTML = '';
                uploadDiv.appendChild(img);
            }
            
            reader.readAsDataURL(file);
        }
    });

});



        
        
    
     






