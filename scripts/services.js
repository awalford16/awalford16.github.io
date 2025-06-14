let services = ["Electrical", "Networking", "Operations"]
function update_nav() {
    let html = '';

    for (var i = 0; i < services.length; i++) {
        html += `<li><button onclick="show_file('services', ${i})">${services[i].replaceAll("_", " ")}</button></li>`
    }

    document.getElementById("left_nav").innerHTML = html;
}

function show_file(content, index) {
    file = services[index].toLowerCase()
    fetch(`${content}/${file}.txt`)
        .then(res => res.text())
        .then(text => {
            const lines = text.split('\n');
            let html = `<h2>${services[index]}</h2>\n`;
            let inCode = false;
            let codeLang = '';
            let codeBuffer = [];

            lines.forEach(line => {
                const code_match = line.match(/^```(\w*)?/); // detect ``` or ```lang
                const h3_match = line.match(/^#[a-zA-Z0-9_ ]*$/); // detect #
                const h4_match = line.match(/^##[a-zA-Z0-9_ ]*$/); // detect #
                if (code_match) {
                    if (!inCode) {
                        // Start of code block
                        inCode = true;
                        codeLang = code_match[1] || '';
                        codeBuffer = [];
                    } else {
                        // End of code block
                        inCode = false;
                        html += `<pre><code class="language-${codeLang}">${escapeHtml(codeBuffer.join('\n'))}</code></pre>\n`;
                        codeLang = '';
                    }
                } else if (inCode) {
                    codeBuffer.push(line);
                } else if (h4_match) {
                    html += `<h4><i>${escapeHtml(line.replace("##", ""))}</i></h4>\n`;
                } else if (h3_match) {
                    html += `<br/><h3>${escapeHtml(line.replace("#", ""))}</h3>\n`;
                } else {
                    // Normal text
                    html += `<p>${escapeHtml(line)}</p>\n`;
                }
            });

            document.getElementById('file_content').innerHTML = html;
        });
}

function escapeHtml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

update_nav('electrical')
show_file('services', 0)