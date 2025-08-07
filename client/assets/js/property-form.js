function addImage() {
    const input = document.getElementById('imageInput');
    const preview = document.getElementById('preview');
    const file = input.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; max-height: 100%;" />`;
        };
        reader.readAsDataURL(file);
    }
}
