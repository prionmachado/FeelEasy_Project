const filtersContainer = document.getElementById("filters");
const scrollRight = document.getElementById("scrollRight");
const scrollLeft = document.getElementById("scrollLeft");

// Scroll functionality
scrollRight.onclick = () => {
    filtersContainer.scrollBy({ left: 300, behavior: "smooth" });
};

scrollLeft.onclick = () => {
    filtersContainer.scrollBy({ left: -300, behavior: "smooth" });
};

// Filter click functionality
const allFilters = document.querySelectorAll(".filter");

allFilters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.dataset.category;
        window.location.href = `/listings?category=${category}`;
    });
}); 