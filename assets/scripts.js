// Carousel functionality
document.addEventListener('DOMContentLoaded', function () {
    const carouselInner = document.querySelector('.carousel-inner');
    const items = document.querySelectorAll('.carousel-item');
    let currentIndex = 0;

    function updateCarousel() {
        carouselInner.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    document.querySelector('.carousel-control-next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });

    document.querySelector('.carousel-control-prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    // Initialize carousel
    updateCarousel();
});

// Gallery functionality
document.addEventListener('DOMContentLoaded', function () {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Optionally, you could create tags dynamically or add more advanced filtering logic here
    const tags = Array.from(new Set(Array.from(galleryItems).map(item => item.dataset.galleryTag)));

    // Create a filter menu
    const filterMenu = document.createElement('div');
    filterMenu.className = 'gallery-filter-menu';
    tags.forEach(tag => {
        const button = document.createElement('button');
        button.textContent = tag;
        button.addEventListener('click', () => {
            filterGallery(tag);
        });
        filterMenu.appendChild(button);
    });
    document.getElementById('gallery').insertBefore(filterMenu, document.querySelector('.gallery'));

    function filterGallery(selectedTag) {
        galleryItems.forEach(item => {
            if (item.dataset.galleryTag === selectedTag || selectedTag === 'All') {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
});