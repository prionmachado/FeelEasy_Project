const filtersContainer = document.getElementById("filters");
const scrollRight = document.getElementById("scrollRight");
const scrollLeft = document.getElementById("scrollLeft");

if (scrollRight && scrollLeft && filtersContainer) {
    scrollRight.addEventListener("click", () => {
        filtersContainer.scrollBy({ left: 200, behavior: "smooth" });
    });

    scrollLeft.addEventListener("click", () => {
        filtersContainer.scrollBy({ left: -200, behavior: "smooth" });
    });
}

const allFilters = document.querySelectorAll(".filter");

allFilters.forEach(filter => {
    filter.addEventListener("click", () => {
        const category = filter.dataset.category;
        window.location.href = `/listings?category=${category}`;
    });
});
