if (typeof listing === 'undefined' || !listing || !listing.geometry || !listing.geometry.coordinates) {
    console.log('No listing data available for map');
    const mapDiv = document.getElementById('map');
    if (mapDiv) {
        mapDiv.innerHTML = '<p style="padding:20px;">Map not available</p>';
    }
} else {
    const coords = listing.geometry.coordinates;
    console.log('Coordinates:', coords);
    
    const map = L.map('map').setView([coords[1], coords[0]], 9);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([coords[1], coords[0]])
        .addTo(map)
        .bindPopup(`<h3>${listing.title}</h3><p>${listing.location}</p>`)
        .openPopup();
        
    console.log('Map initialized successfully');
}
