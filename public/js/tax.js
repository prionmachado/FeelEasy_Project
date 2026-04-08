let taxSwitch = document.getElementById('flexSwitchCheckDefault');
taxSwitch.addEventListener('change', function () {
    let taxInfoElements = document.querySelectorAll('.tax-info');
    taxInfoElements.forEach(function (taxInfo) {
        taxInfo.style.display = taxSwitch.checked ? 'inline' : 'none';
    });
}); 