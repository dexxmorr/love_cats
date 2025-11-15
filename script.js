
const loadButton = document.getElementById('loadButton');
const statusMessage = document.querySelector('#statusMessage');
const imagesGallery = document.querySelector('.container__gallery');
const loader = document.querySelector('#loader');

function showLoader() {
    loader.classList.add('container__loader--visible');
}

function hideLoader() {
    loader.classList.remove('container__loader--visible');
}

function loadImage(imageUrl) {
    return new Promise((resolve, reject) => {
        const imageElement = new Image();
        imageElement.onload = () => resolve(imageElement);
        imageElement.onerror = () => reject(new Error(`Не удалось загрузить: ${imageUrl}`));
        imageElement.src = imageUrl;
    });
}

function clearGallery() {
    imagesGallery.innerHTML = '';
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена!');
});

loadButton.addEventListener('click', async function handleButtonClick(event) {
    event.preventDefault();
    
    clearGallery();
    showLoader();
    statusMessage.textContent = 'Загрузка изображений...';
    statusMessage.style.color = '#667eea';
    
    let apiResponseData = null;
    
    try {
        const apiResponse = await fetch('https://api.thecatapi.com/v1/images/search?limit=10');
        
        if (!apiResponse.ok) {
            throw new Error('Ошибка запроса к API');
        }
        
        apiResponseData = await apiResponse.json();
    } catch (error) {
        console.error('Ошибка:', error.message);
        statusMessage.textContent = 'Ошибка загрузки данных';
        statusMessage.style.color = '#e74c3c';
        hideLoader();
        return;
    } finally {
        console.log('Запрос завершён');
    }
    
    if (apiResponseData) {
        const imageUrlsArray = apiResponseData.map(item => item.url);
        
        const imagePromises = imageUrlsArray.map(url => 
            loadImage(url)
                .then(image => image)
                .catch(error => {
                    console.error('Ошибка загрузки изображения:', error.message);
                    return null;
                })
        );
        
        const loadedImages = await Promise.all(imagePromises);
        const validImages = loadedImages.filter(img => img !== null);
        
        validImages.forEach(imageElement => {
            imageElement.classList.add('container__gallery-item');
            imagesGallery.appendChild(imageElement);
        });
        
        statusMessage.textContent = `Загружено изображений: ${validImages.length}`;
        statusMessage.style.color = '#27ae60';
        hideLoader();
    }
});