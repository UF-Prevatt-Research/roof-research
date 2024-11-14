import "./style.css";

const uploadInput = document.getElementById("upload-input");
const output = document.getElementById("output");
const classifyBtn = document.getElementById("classify-btn");
const outputResult = document.getElementById("output-result");
let file = {
    data: null,
};

uploadInput.onchange = (event) => {
    file.data = event.target.files[0];
    output.src = URL.createObjectURL(file.data);
    output.onload = function () {
        URL.revokeObjectURL(output.src); // free memory
    };
};

classifyBtn.onclick = async (event) => {
    if (!file.data) return;
    const formData = new FormData();
    formData.append("file", file.data);
    // upload file to server
    try {
        classifyBtn.innerText = "loading...";
        classifyBtn.disabled = true;
        const response = await fetch("http://127.0.0.1:8000/classify", {
            method: "POST",
            body: formData,
        });

        if (!response.ok) {
            throw new Error("File upload failed");
        }

        let data = await response.text();
        // remove double quotes
        data = data.replace(/"/g, "");

        outputResult.innerHTML = data;
        classifyBtn.innerText = "classify";
        classifyBtn.disabled = false;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};
