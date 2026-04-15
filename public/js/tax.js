let taxSwitch = document.getElementById('flexSwitchCheckDefault');
let taxInfoElements = document.querySelectorAll('.tax-info');

function toggleTax() {
    taxInfoElements.forEach(function (taxInfo) {
        taxInfo.style.display = taxSwitch.checked ? 'inline' : 'none';
    });
}

if (taxSwitch) {
    toggleTax();
    taxSwitch.addEventListener('change', toggleTax);
}