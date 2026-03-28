const buttonReviews = document.querySelectorAll('.btn-comment');
const panels = document.querySelectorAll('.tab-panel');

buttonReviews.forEach(button => {
  button.addEventListener('click', () => {
    // remove activated state
    buttonReviews.forEach(btn => btn.classList.remove('activated'));
    panels.forEach(panel => panel.classList.remove('activated'));

    // activate clicked button
    button.classList.add('activated');

    // activate matching panel
    document.getElementById(button.dataset.tab).classList.add('activated');
  });
});

//Get curent date
const dateInput = document.getElementById('visit-date');

function getTodayDate() {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

dateInput.value = getTodayDate();


//⭐ Star generator function
function renderStars(value) {
  const fullStars = Math.floor(value);
  const hasHalf = value % 1 === 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  let starsHTML = '';

  // full stars
  for (let i = 0; i < fullStars; i++) {
    starsHTML += '<span class="star full">★</span>';
  }

  // half star
  if (hasHalf) {
    starsHTML += '<span class="star half">★</span>';
  }

  // empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHTML += '<span class="star empty">★</span>';
  }

  return starsHTML;
}

//Star level
function getRatingLevel(rate) {
  switch (rate) {
    case 1: return 'Poor';
    case 2: return 'Fair';
    case 3: return 'Good';
    case 4: return 'Very Good';
    case 5: return 'Excellent';
    default: return '';
  }
}

//Highlight and clickable stars logic
const stars = document.querySelectorAll('#rating-input span');
const ratingError = document.getElementById('rating-error');
const nameError = document.getElementById('name-error');
const commentError = document.getElementById('comment-error');

let selectedRating = 0;

stars.forEach(star => {
  star.addEventListener('mouseover', () => {
    highlightStars(star.dataset.value);
  });

  star.addEventListener('click', () => {
    selectedRating = parseInt(star.dataset.value, 10);
    highlightStars(selectedRating);
    //ratingError.style.visibility = 'hidden';
    ratingError.classList.remove('show');
  });
});

document
  .getElementById('rating-input')
  .addEventListener('mouseleave', () => {
    highlightStars(selectedRating);
  });

function highlightStars(value) {
  stars.forEach(star => {
    star.classList.toggle(
      'active',
      parseInt(star.dataset.value, 10) <= value
    );
  });
}

/*Message error*/
const nameInput = document.getElementById('name');
const commentInput = document.getElementById('comment');

nameInput.addEventListener('input', () => {
  if (nameInput.value.trim()) {
    nameError.classList.remove('show');
  } else {
    nameError.textContent = 'Please enter your name';
    nameError.classList.add('show');
  }
});

commentInput.addEventListener('input', () => {
  if (commentInput.value.trim()) {
    commentError.classList.remove('show');
  } else {
    commentError.textContent = 'Please enter your comment';
    commentError.classList.add('show');
  }
});


/*Submit form */
const form = document.querySelector('.div-form');
const reviews = [];

form.addEventListener('submit', (e) => {
  e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const comment = document.getElementById('comment').value.trim();    
    const rate = selectedRating;
    const ratingLevel =  getRatingLevel(rate);  

    if (!name) {
        nameError.textContent = 'Please enter your name';
        nameError.classList.add('show');
    }

    if (rate === 0) {
        ratingError.textContent = 'Please select a rating';
        ratingError.classList.add('show');
    }

    if (!comment) {
        commentError.textContent = 'Please enter your comment';
        commentError.classList.add('show');
    }

    if (!name || rate === 0 || !comment) {
     return;
    }

    reviews.push({
        name,
        comment,
        rate,
        ratingLevel,
        date: new Date().toLocaleDateString()
    });

    /**Render/write a review */
    renderReviews(reviews);
    /**Calculate average */
    renderAverage(reviews);

    // switch to Review tab
    document.querySelector('[data-tab="tab1"]').click();

    form.reset();
    dateInput.value = getTodayDate();
    
    selectedRating = 0;
    highlightStars(0);
    ratingLevel = "";
});

//Render a review
const reviewsList = document.getElementById('reviews-list');
function renderReviews(arrReviews2) {
  reviewsList.innerHTML = '';

  arrReviews2.forEach(review => {
    const div = document.createElement('div');
    div.className = 'div-review-item';

    div.innerHTML = `
      <div class="div-review-name">${review.name}</div>
      <div class="div-review-rating">
        ${renderStars(review.rate)}
        <span>(${review.rate}) : <span class="span-ratingLevel">${review.ratingLevel}</span>
      </div>
      <div class="div-review-date">${review.date}</div>      
      <div class="div-review-comment">${review.comment}</div>
      <hr>
    `;

    reviewsList.appendChild(div);
  });
}

//Calculate & render average
const avgStars = document.getElementById('average-stars');
const avgNumber = document.getElementById('average-number');

function renderAverage(arrReviews) {
  if (arrReviews.length === 0) {
    avgStars.innerHTML = renderStars(0);
    avgNumber.textContent = '(0)';
    return;
  }

  const total = arrReviews.reduce((sum, r) => sum + r.rate, 0);
  const average = Math.round((total / arrReviews.length) * 2) / 2;

  avgStars.innerHTML = renderStars(average);
  avgNumber.textContent = `(${average})`;
}