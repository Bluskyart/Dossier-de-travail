function mauGallery(options) {
  var defaults = {
      columns: 3,
      lightBox: true,
      lightboxId: null,
      showTags: true,
      tagsPosition: 'bottom',
      navigation: true
  };

  options = Object.assign(defaults, options);
  var tagsCollection = [];
  
  var gallery = document.querySelector('.gallery');
  createRowWrapper(gallery);

  if (options.lightBox) {
      createLightBox(gallery, options.lightboxId, options.navigation);
  }

  initListeners(options);

  // Parcourir chaque élément de la galerie
  var galleryItems = gallery.querySelectorAll('.gallery-item');
  galleryItems.forEach(function(item) {
      responsiveImageItem(item);
      moveItemInRowWrapper(item);
      wrapItemInColumn(item, options.columns);
      var theTag = item.getAttribute('data-gallery-tag');
      if (options.showTags && theTag && tagsCollection.indexOf(theTag) === -1) {
          tagsCollection.push(theTag);
      }
  });

  if (options.showTags) {
      showItemTags(gallery, options.tagsPosition, tagsCollection);
  }

  gallery.style.display = 'block';
}

function initListeners(options) {
  document.querySelectorAll('.gallery-item').forEach(function(item) {
      item.addEventListener('click', function() {
          if (options.lightBox && item.tagName === 'IMG') {
              openLightBox(item, options.lightboxId);
          }
      });
  });

  document.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', filterByTag);
  });

  var prevBtn = document.querySelector('.mg-prev');
  var nextBtn = document.querySelector('.mg-next');

  if (prevBtn) {
      prevBtn.addEventListener('click', function() {
          prevImage(options.lightboxId);
      });
  }

  if (nextBtn) {
      nextBtn.addEventListener('click', function() {
          nextImage(options.lightboxId);
      });
  }
}

function createRowWrapper(element) {
  if (!element.querySelector('.gallery-items-row')) {
      var rowWrapper = document.createElement('div');
      rowWrapper.classList.add('gallery-items-row', 'row');
      element.appendChild(rowWrapper);
  }
}

function wrapItemInColumn(element, columns) {
  var columnClass = '';
  if (typeof columns === 'number') {
      columnClass = `col-${Math.ceil(12 / columns)}`;
  } else if (typeof columns === 'object') {
      columnClass = `col-${Math.ceil(12 / columns.xs)} col-sm-${Math.ceil(12 / columns.sm)} col-md-${Math.ceil(12 / columns.md)} col-lg-${Math.ceil(12 / columns.lg)} col-xl-${Math.ceil(12 / columns.xl)}`;
  }

  var columnWrapper = document.createElement('div');
  columnWrapper.classList.add('item-column', 'mb-4');
  columnWrapper.classList.add(...columnClass.split(' '));
  element.parentNode.insertBefore(columnWrapper, element);
  columnWrapper.appendChild(element);
}

function moveItemInRowWrapper(element) {
  var rowWrapper = document.querySelector('.gallery-items-row');
  rowWrapper.appendChild(element);
}

function responsiveImageItem(element) {
  if (element.tagName === 'IMG') {
      element.classList.add('img-fluid');
  }
}

function createLightBox(gallery, lightboxId, navigation) {
  var modal = document.createElement('div');
  modal.classList.add('modal', 'fade');
  modal.id = lightboxId ? lightboxId : 'galleryLightbox';
  modal.setAttribute('tabindex', '-1');
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-hidden', 'true');

  modal.innerHTML = `
      <div class="modal-dialog" role="document">
          <div class="modal-content">
              <div class="modal-body">
                  ${navigation ? '<div class="mg-prev" style="cursor:pointer;position:absolute;top:50%;left:-15px;background:white;">&lt;</div>' : ''}
                  <img class="lightboxImage img-fluid" alt="Image content"/>
                  ${navigation ? '<div class="mg-next" style="cursor:pointer;position:absolute;top:50%;right:-15px;background:white;">&gt;</div>' : ''}
              </div>
          </div>
      </div>`;
  
  gallery.appendChild(modal);
}

function openLightBox(element, lightboxId) {
  var lightbox = document.getElementById(lightboxId);
  var lightboxImage = lightbox.querySelector('.lightboxImage');
  lightboxImage.src = element.src;
  $(lightbox).modal('toggle');
}

function prevImage() {
  navigateImage('prev');
}

function nextImage() {
  navigateImage('next');
}

function navigateImage(direction) {
  var activeImage = document.querySelector('.lightboxImage').src;
  var images = document.querySelectorAll('.gallery-item');
  var imagesArray = Array.prototype.slice.call(images);
  var currentIndex = imagesArray.findIndex(img => img.src === activeImage);

  if (direction === 'prev') {
      currentIndex = currentIndex === 0 ? imagesArray.length - 1 : currentIndex - 1;
  } else {
      currentIndex = currentIndex === imagesArray.length - 1 ? 0 : currentIndex + 1;
  }

  document.querySelector('.lightboxImage').src = imagesArray[currentIndex].src;
}

function showItemTags(gallery, position, tags) {
  var tagList = '<li class="nav-item"><span class="nav-link active active-tag" data-images-toggle="all">Tous</span></li>';
  tags.forEach(function(tag) {
      tagList += `<li class="nav-item"><span class="nav-link" data-images-toggle="${tag}">${tag}</span></li>`;
  });

  var tagBar = document.createElement('ul');
  tagBar.classList.add('my-4', 'tags-bar', 'nav', 'nav-pills');
  tagBar.innerHTML = tagList;

  if (position === 'top') {
      gallery.insertBefore(tagBar, gallery.firstChild);
  } else {
      gallery.appendChild(tagBar);
  }
}

function filterByTag() {
  var tag = this.getAttribute('data-images-toggle');
  document.querySelectorAll('.gallery-item').forEach(function(item) {
      var parent = item.closest('.item-column');
      parent.style.display = tag === 'all' || item.getAttribute('data-gallery-tag') === tag ? 'block' : 'none';
  });

  document.querySelectorAll('.active-tag').forEach(function(tagElement) {
      tagElement.classList.remove('active', 'active-tag');
  });
  this.classList.add('active', 'active-tag');
}